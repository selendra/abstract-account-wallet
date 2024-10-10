import { ethers } from "ethers";
import { ethers as hre } from "hardhat";
import { payments } from "../typechain-types/contracts";
import { EntryPoint__factory } from "../typechain-types/factories/@account-abstraction/contracts/core/EntryPoint__factory";

interface UserOperation {
  sender: string;
  nonce: string;
  factory: string;
  factoryData: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymaster: string;
  paymasterData: string;
  signature: string;
}

interface GasEstimation {
  preVerificationGas: string;
  verificationGasLimit: string;
  callGasLimit: string;
}
// const EntryPointABI = EntryPoint__factory.abi;
const EntryPointABI = [
  "function balanceOf(address account) public view returns (uint256)",
  "function getNonce(address sender, uint192 key) view returns (uint256)",
  "function handleOps(tuple(address sender, uint256 nonce, address factory, bytes factoryData, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, address paymaster, bytes paymasterData, bytes signature)[] calldata ops, address beneficiary) external",
];

const provider = new ethers.JsonRpcProvider('https://rpc.selendra.org');

async function eth_estimateUserOperationGas(
  userOperation: UserOperation,
  entryPointAddress: string,
): Promise<GasEstimation> { 
    const entryPoint = new ethers.Contract(entryPointAddress, EntryPointABI, provider);

    async function checkPaymasterBalance(
      entryPoint: ethers.Contract,
      paymasterAddress: string
    ): Promise<bigint> {
      try {
        // Call the balanceOf function of the EntryPoint contract
        const balance = await entryPoint.balanceOf(paymasterAddress);
    
        return ethers.toBigInt(balance);
      } catch (error) {
        console.error("Error checking paymaster balance:", error);
        throw error;
      }
    }

    function estimatePreVerificationGas(userOperation: UserOperation): bigint {
      const baseGas = 21000n;
      const dataGas = BigInt(ethers.getBytes(userOperation.callData).length) * 16n;
      return baseGas + dataGas;
    }

    async function manualSimulateValidation(
      provider: ethers.Provider,
      entryPoint: ethers.Contract,
      userOp: UserOperation
    ): Promise<{ success: boolean; gasUsed: bigint; validationResult: string }> {
  
      try {
        // Step 1: Verify the sender exists
        const senderCode = await provider.getCode(userOp.sender);
        if (senderCode === '0x' && userOp.factory === ethers.ZeroAddress) {
          throw new Error("Sender doesn't exist and no factory provided");
        }
    
        // Step 2: Check nonce
        const nonce = await entryPoint.getNonce(userOp.sender, 0);
        if (ethers.toBigInt(userOp.nonce) !== nonce) {
          throw new Error(`Invalid nonce. Expected: ${nonce}, Got: ${userOp.nonce}`);
        }
    
        // Step 3: Validate paymaster if present
        if (userOp.paymaster !== ethers.ZeroAddress) {
          const paymasterCode = await provider.getCode(userOp.paymaster);
          if (paymasterCode === '0x') {
            throw new Error("Paymaster doesn't exist");
          }
          // Additional paymaster validation would go here
        }
    
        // Step 4: Estimate gas for the call
        let gasUsed = ethers.toBigInt(userOp.preVerificationGas);
        
        // Estimate gas for the main call
        const callGasEstimate = await provider.estimateGas({
          to: userOp.sender,
          data: userOp.callData
        });
        gasUsed += callGasEstimate;
    
        // Step 5: Validate signature
        // This is a simplified check. In a real implementation, you'd need to recover the signer from the signature
        if (userOp.signature === '0x') {
          throw new Error("Signature is empty");
        }
    
        // Step 6: Check if the account has enough balance
        const requiredPrefund = ethers.toBigInt(userOp.callGasLimit) * ethers.toBigInt(userOp.maxFeePerGas);
        const paymasterBalance = await checkPaymasterBalance(entryPoint, userOp.paymaster);
        if (paymasterBalance < requiredPrefund) {
          throw new Error(`Insufficient balance. Required: ${requiredPrefund}, Got: ${paymasterBalance}`);
        }
    
        return {
          success: true,
          gasUsed,
          validationResult: "UserOperation is valid"
        };
    
      } catch (error) {
        return {
          success: false,
          gasUsed: ethers.toBigInt(0),
          validationResult: error instanceof Error ? error.message : "Unknown error occurred"
        };
      }
    }

    async function manualEstimateCallGasLimit(
      provider: ethers.JsonRpcProvider,
      userOp: UserOperation
    ): Promise<bigint> {
      // 1. Check if it's a contract creation
      const isContractCreation = userOp.factory !== ethers.ZeroAddress;
    
      // 2. Estimate gas for the main call
      let callGas: bigint;
      try {
        callGas = await provider.estimateGas({
          to: userOp.sender,
          data: userOp.callData
        });
      } catch (error: any) {
        // Use a default value if estimation fails
        callGas = 100000n; // Adjust this value based on your expected call complexity
      }
    
      // 3. Add some buffer for safety
      const gasBuffer = 50000n; // Adjust as needed
    
      // 4. Sum up all gas estimates
      const totalGasEstimate =  callGas + gasBuffer;
    
      // 5. Apply any specific EntryPoint overhead
      // This is an example value, adjust based on EntryPoint v0.7.0 implementation
      const entryPointOverhead = 100000n;
      const finalGasEstimate = totalGasEstimate + entryPointOverhead;
  
      return finalGasEstimate;
    }  
  
    // 1. Estimate preVerificationGas
    const preVerificationGas = estimatePreVerificationGas(userOperation);
  
    // 2. Estimate verificationGas
    const verificationGasLimit = await manualSimulateValidation(provider, entryPoint, userOperation);
  
    // 3. Estimate callGasLimit
    const callGasLimit = await manualEstimateCallGasLimit(provider, userOperation);
  
    return {
      preVerificationGas: ethers.toBeHex(preVerificationGas),
      verificationGasLimit: ethers.toBeHex(verificationGasLimit.gasUsed),
      callGasLimit: ethers.toBeHex(callGasLimit)
    };
  }

  async function createUserOperation(
    provider: ethers.Provider,
    entryPointAddress: string,
    factoryAddress: string,
    ownerAddress: string,
    payMasterAddress: string,
    callData: string,
    signer: ethers.Signer,
  ): Promise<UserOperation> {

    function createFactoryData(ownerAddress: string): string {
      // This function will depend on your specific factory implementation
      // Here's a simple example assuming the factory takes an owner address
      const abiCoder = new ethers.AbiCoder();
      return abiCoder.encode(['address'], [ownerAddress]);
    }

    async function calculateCounterfactualAddress(factoryAddress: string, factoryData: string): Promise<string> {
      // This function will depend on your specific factory implementation
      // Here's a simplified example
      const create2Salt = ethers.keccak256(factoryData);
      const initCodeHash = ethers.keccak256(factoryData); // This should actually be the hash of your account contract's init code
    
      return ethers.getCreate2Address(factoryAddress, create2Salt, initCodeHash);
    }

    function getUserOpHash(userOp: UserOperation, entryPointAddress: string, chainId: bigint): string {
      const userOpHash = ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'uint256', 'bytes32', 'bytes32', 'bytes32', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'address', 'bytes32'],
        [
          userOp.sender,
          userOp.nonce,
          ethers.keccak256(userOp.factory),
          ethers.keccak256(userOp.factoryData),
          ethers.keccak256(userOp.callData),
          userOp.callGasLimit,
          userOp.verificationGasLimit,
          userOp.preVerificationGas,
          userOp.maxFeePerGas,
          userOp.maxPriorityFeePerGas,
          userOp.paymaster,
          ethers.keccak256(userOp.paymasterData)
        ]
      ));
    
      return ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(
        ['bytes32', 'address', 'uint256'],
        [userOpHash, entryPointAddress, chainId]
      ));
    }

    async function signUserOp(
      userOp: UserOperation,
      signer: ethers.Signer,
      entryPointAddress: string,
      chainId: bigint
    ): Promise<string> {
      const userOpHash = getUserOpHash(userOp, entryPointAddress, chainId);
      const signature = await signer.signMessage(ethers.getBytes(userOpHash));
      return signature;
    }

    // 1. Create factoryData
    const factoryData = createFactoryData(ownerAddress);
  
    // 2. Calculate the counterfactual address (sender)
    // const sender = await calculateCounterfactualAddress(factoryAddress, factoryData);
    const sender = "0xe78573331e88c65ed4cf0317c711d36066b1abe5"
  
    // 3. Get the current nonce for the account (it should be 0 for a new account)
    const entryPoint = new ethers.Contract(entryPointAddress, EntryPointABI, provider);
    const nonce = await entryPoint.getNonce(sender, 0);
  
    // 4. Estimate gas prices
    const feeData = await provider.getFeeData();
  
    // 5. Create the UserOperation
    const userOp: UserOperation = {
      sender: sender,
      nonce: ethers.toBeHex(nonce),
      factory: factoryAddress,
      factoryData: "0x",
      callData: callData,
      callGasLimit: "0x7A1200", // Will be filled by estimation
      verificationGasLimit: "0x927C0", // Will be filled by estimation
      preVerificationGas:  "0x15F90", // Will be filled by estimation
      maxFeePerGas: ethers.toBeHex(feeData.maxFeePerGas || 0),
      maxPriorityFeePerGas: ethers.toBeHex(feeData.maxPriorityFeePerGas || 0),
      paymaster: payMasterAddress,
      paymasterData: "0x",
      signature: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c", // Will be filled later
    };
  
    try {
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      const signature = await signUserOp(userOp, signer, entryPointAddress, chainId);
      
      // Update the userOp with the signature
      userOp.signature = signature;
    } catch (error) {
      console.error("Error signing UserOperation:", error);
    }
  
    return userOp;
  }

  async function eth_sendUserOperation(
    userOp: UserOperation,
    entryPointAddress:string,
    signer: ethers.Signer
): Promise<string> {

    function packUint(high128: ethers.BigNumberish, low128: ethers.BigNumberish): string {
      const high = ethers.getBigInt(high128);
      const low = ethers.getBigInt(low128);
      const packed = (high << 128n) | low;
      return ethers.zeroPadValue(ethers.toBeHex(packed), 32);
    }

    function packPaymasterData(
      paymaster: string,
      paymasterVerificationGasLimit: ethers.BigNumberish,
      postOpGasLimit: ethers.BigNumberish,
      paymasterData: ethers.BytesLike = '0x'
    ): string {
      const packedUint = packUint(paymasterVerificationGasLimit, postOpGasLimit);
      return ethers.concat([
          paymaster,
          packedUint,
          paymasterData
      ]);
    }

    const entryPoint = new ethers.Contract(entryPointAddress, EntryPointABI, provider);
    const entryPointWithSigner = entryPoint.connect(signer);

    // const entryPoint = await hre.getContractAt("EntryPoint", entryPointAddress);

    // const gasFees = packUint(BigInt(userOp.maxFeePerGas), BigInt(userOp.maxPriorityFeePerGas))
    // const accountGasLimits  = packUint(BigInt(userOp.callGasLimit), BigInt(userOp.verificationGasLimit))

    // const paymasterVerificationGasLimit = 600000n;
    // const postOpGasLimit = 600000;

    // const paymasterAndData = packPaymasterData(
    //   userOp.paymaster,
    //   paymasterVerificationGasLimit,
    //   postOpGasLimit,
    //   userOp.paymasterData
    // )

    // let userOp1: any = {
    //   sender: userOp.sender,
    //   nonce: userOp.nonce,
    //   initCode: "0x",
    //   callData: userOp.callData,
    //   accountGasLimits,
    //   preVerificationGas: userOp.preVerificationGas,
    //   gasFees,
    //   paymasterAndData: paymasterAndData,
    //   signature: userOp.signature
    // }

    const address = await signer.getAddress()
    const tx = await (entryPointWithSigner as any).handleOps([userOp], address);
    const receipt = await tx.wait();
    console.log(receipt)

    // try {
    //   const tx = await entryPoint.handleOps([userOp1], "0xAb89ea78baB322ca2062DFf7EA0530C7fb03156E", { gasPrice: ethers.parseUnits("50", "gwei"),  gasLimit: 1_000_000 });
    //   const receipt = await tx.wait();
    //   return receipt?.hash ? receipt?.hash: "0x";
    // } catch (error) {
    //   console.error('Failed to send UserOperation:', error);
    //   throw error;
    // }

    return "ox"

  }

// Usage example
async function main() {
  const payMasterAddress = "0x99202434921642effF80D50cCa49f1dd74D9bF8F";
  const entryPointAddress = "0x0000000071727De22E5E9d8BAf0edAc6f37da032"; // Example EntryPoint address
  const factoryAddress = "0xb323171fD9b7fC7d577F68623Ea012f37E816AC8"; // Your factory address
  const ownerAddress = "0xAb89ea78baB322ca2062DFf7EA0530C7fb03156E"; // The owner of the new account

  // Replace with the private key of the account owner
  const privateKey = "0xc57ce1f4b3c390da493e6cf5d1763344fa49347a26db142c2d307eeda0293a1e";
  const signer = new ethers.Wallet(privateKey, provider);
  
  // // Example callData for a simple transfer
  // const callData = new ethers.Interface(["function transfer(address to, uint256 amount)"]).encodeFunctionData(
  //   "transfer",
  //   ["0x5bCae15E6EB33C4E54b0738bAeb895Fc3aDF8d85", ethers.parseEther("0.1")]
  // );

  const Account = await hre.getContractFactory("LightAccount");

  const encodeData = (target: string, value: ethers.BigNumberish, data: string) => {
    return Account.interface.encodeFunctionData('execute', [target, value, data])
  }
  const callData = encodeData("0xAb89ea78baB322ca2062DFf7EA0530C7fb03156E", "10000000000000000", "0x");  // transfer native token

  const userOp = await createUserOperation(
    provider,
    entryPointAddress,
    factoryAddress,
    ownerAddress,
    payMasterAddress,
    callData,
    signer,
  );

  // Now you can use this userOp with eth_estimateUserOperationGas
  const gasEstimation = await eth_estimateUserOperationGas(userOp, entryPointAddress);

  // Update userOp with estimated gas values
  userOp.callGasLimit = gasEstimation.callGasLimit;
  userOp.verificationGasLimit = gasEstimation.verificationGasLimit;
  userOp.preVerificationGas = gasEstimation.preVerificationGas;

  // Send user operation
  const txHash = await eth_sendUserOperation(userOp, entryPointAddress, signer);
  console.log("Transaction hash:", txHash);
}

main().catch(console.error);