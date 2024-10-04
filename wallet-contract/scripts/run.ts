import { ethers as hre } from "hardhat";
import { ethers } from "ethers";

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
  paymasterVerificationGasLimit: string,
  paymasterPostOpGasLimit: string,
  paymaster: string;
  paymasterData: string;
  signature: string;
}

interface GasEstimation {
  preVerificationGas: string;
  verificationGas: string;
  callGasLimit: string;
}

const EntryPointABI = [
  "function simulateValidation(tuple(address sender, uint256 nonce, address factory, bytes factoryData, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, uint256 paymasterVerificationGasLimit, uint256 paymasterPostOpGasLimit, address paymaster, bytes paymasterData, bytes signature) calldata userOp) external",
  "function simulateExecution(address sender, bytes calldata callData) external",
  "function handleOps(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, address paymaster, bytes paymasterData, bytes signature)[] calldata ops, address beneficiary) external",
];

const provider = new ethers.JsonRpcProvider('https://rpc.selendra.org');

async function eth_estimateUserOperationGas(userOperation: UserOperation, entryPointAddress: string) { //: Promise<GasEstimation>
    const entryPoint = new ethers.Contract(entryPointAddress, EntryPointABI, provider);
    // const entryPoint = await hre.getContractAt("EntryPoint", entryPointAddress);
  
    // 1. Estimate preVerificationGas
    const preVerificationGas = estimatePreVerificationGas(userOperation);
  
    // 2. Estimate verificationGas
    const verificationGas = await estimateVerificationGas(entryPoint, userOperation);
  
    // // 3. Estimate callGasLimit
    // const callGasLimit = await estimateCallGasLimit(entryPoint, userOperation);
  
    return {
      preVerificationGas: ethers.toBeHex(preVerificationGas),
    //   verificationGas: ethers.toBeHex(verificationGas),
    //   callGasLimit: ethers.toBeHex(callGasLimit)
    };
  }
  
  function estimatePreVerificationGas(userOperation: UserOperation): bigint {
    const baseGas = 21000n;
    const dataGas = BigInt(ethers.getBytes(userOperation.callData).length) * 16n;
    return baseGas + dataGas;
  }
  
  async function estimateVerificationGas(entryPoint: ethers.Contract, userOperation: UserOperation) { //Promise<bigint>

    try {
      const gasUsed = await entryPoint.simulateValidation.estimateGas(userOperation);
      return gasUsed;
    } catch (error) {
      console.error('Validation simulation failed:', error);
      return 100000n;
    }
  }
  
  async function estimateCallGasLimit(entryPoint: ethers.Contract, userOperation: UserOperation): Promise<bigint> {
    try {
      const gasUsed = await entryPoint.simulateExecution.estimateGas(
        userOperation.sender,
        userOperation.callData
      );
      return gasUsed;
    } catch (error) {
      console.error('Execution simulation failed:', error);
      return 100000n;
    }
  }


  async function createUserOperation(
    provider: ethers.Provider,
    entryPointAddress: string,
    factoryAddress: string,
    ownerAddress: string,
    payMasterAddress: string,
    callData: string
  ): Promise<UserOperation> {
    // 1. Create factoryData
    const factoryData = createFactoryData(ownerAddress);
  
    // 2. Calculate the counterfactual address (sender)
    const sender = await calculateCounterfactualAddress(factoryAddress, factoryData);
  
    // 3. Get the current nonce for the account (it should be 0 for a new account)
    const entryPoint = new ethers.Contract(
      entryPointAddress,
      ["function getNonce(address sender, uint192 key) view returns (uint256)"],
      provider
    );
    const nonce = await entryPoint.getNonce(sender, 0);
  
    // 4. Estimate gas prices
    const feeData = await provider.getFeeData();
  
    // 5. Create the UserOperation
    const userOp: UserOperation = {
      sender: sender,
      nonce: ethers.toBeHex(nonce),
      factory: factoryAddress,
      factoryData: factoryData,
      callData: callData,
      callGasLimit: "0x7A1200", // Will be filled by estimation
      verificationGasLimit: "0x927C0", // Will be filled by estimation
      preVerificationGas: "0x15F90", // Will be filled by estimation
      maxFeePerGas: ethers.toBeHex(feeData.maxFeePerGas || 0),
      maxPriorityFeePerGas: ethers.toBeHex(feeData.maxPriorityFeePerGas || 0),
      paymasterVerificationGasLimit: "0x927C0",
      paymasterPostOpGasLimit: "0x927C0",
      paymaster: payMasterAddress, // No paymaster in this example
      paymasterData: "0x",
      signature: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c", // Will be filled later
    };
  
    // 6. Generate the signature
    // const signature = await signUserOp(userOp, ownerAddress, entryPointAddress, provider);
    // userOp.signature = signature;
  
    return userOp;
  }
  
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
  
  async function signUserOp(userOp: UserOperation, ownerAddress: string, entryPointAddress: string, provider: ethers.Provider): Promise<string> {
    // 1. Hash the UserOperation
    const userOpHash = await getUserOpHash(userOp, entryPointAddress, 1961);
  
    // 2. Sign the hash
    const signer = new ethers.Wallet(ownerAddress, provider);
    return await signer.signMessage(ethers.getBytes(userOpHash));
  }
  
  async function getUserOpHash(userOp: UserOperation, entryPointAddress: string, chainId: number): Promise<string> {
    const encodedUserOp = encodeUserOp(userOp);
    const encoded = ethers.solidityPacked(
      ['bytes32', 'address', 'uint256'],
      [ethers.keccak256(encodedUserOp), entryPointAddress, chainId]
    );
    return ethers.keccak256(encoded);
  }
  
  function encodeUserOp(userOp: UserOperation): string {
    const abiCoder = new ethers.AbiCoder();
    return abiCoder.encode(
      ['address', 'uint256', 'bytes', 'bytes', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'address', 'bytes', 'bytes'],
      [userOp.sender, userOp.nonce, userOp.factory, userOp.factoryData, userOp.callData, 
       userOp.callGasLimit, userOp.verificationGasLimit, userOp.preVerificationGas, 
       userOp.maxFeePerGas, userOp.maxPriorityFeePerGas, userOp.paymaster, userOp.paymasterData]
    );
  }

// Usage example
async function main() {
    const payMasterAddress = "0xda2Bd5566c6dEfe816b204ce9333a8526150dAa8";
    const entryPointAddress = "0x0000000071727De22E5E9d8BAf0edAc6f37da032"; // Example EntryPoint address
    const factoryAddress = "0x51e5eDFb3C66DE71516D0B92417f3DDe81F96C68"; // Your factory address
    const ownerAddress = "0xAb89ea78baB322ca2062DFf7EA0530C7fb03156E"; // The owner of the new account
    
    // Example callData for a simple transfer
    const callData = new ethers.Interface(["function transfer(address to, uint256 amount)"]).encodeFunctionData(
      "transfer",
      ["0x5bCae15E6EB33C4E54b0738bAeb895Fc3aDF8d85", ethers.parseEther("0.1")]
    );
  
    const userOp = await createUserOperation(
      provider,
      entryPointAddress,
      factoryAddress,
      ownerAddress,
      payMasterAddress,
      callData
    );
  
    console.log("Created UserOperation:", userOp);
  
    // Now you can use this userOp with eth_estimateUserOperationGas
    const gasEstimation = await eth_estimateUserOperationGas(userOp, entryPointAddress);
    console.log("Gas Estimation:", gasEstimation);
  }
  
  main().catch(console.error);
