import { ethers } from "hardhat";
import { ethers as bundler } from "ethers";

// Define constants for the factory contract's nonce and addresses
const FACTORY_NONCE = 1;
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADRRES = "0xA104Aea188a793D0AD9e0FF97F81C330c683887d";
const FACTORY_ADDRESS = "0x6A038C3c62F5905011713d9f758b907BbD8D1eBe";


async function main() {
  // Retrieve the deployed EntryPoint contract
  const entryPoint = await ethers.getContractAt("EntryPoint", EP_ADDRESS); // Calculate the expected sender (smart account) address using the factory address and nonce
  const AccountFactory = await ethers.getContractFactory("AccountFactory");
  const Account = await ethers.getContractFactory("Account");

  const sender = ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  }); // Get the AccountFactory contract to encode its functions

  console.log(`Sender Address ${sender}`);

  // Retrieve the first signer from the hardhat environment
  const [signer0, signer1] = await ethers.getSigners();
  // Get the address of the first signer
  const address0 = await signer0.getAddress();

  // Prepare the initCode by combining the factory address with encoded createAccount function, removing the '0x' prefix
  const initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0])
      .slice(2); // Deposit funds to the sender account to cover transaction fees

  // // //if you want to run in secound time (_createSenderIfNeeded from entrypoint.sol)
  // // const initCode = "0x";

  // deposit prefund to entrypoint for execute via (stakemanger)
  await entryPoint.depositTo(PM_ADRRES, {
    value: ethers.parseEther("5"),
    gasLimit: 300000,
  }); // Define the user operation (userOp) with necessary details for execution

  const userOp: any = {
    sender,
    nonce: (await entryPoint.getNonce(sender, 0)).toString(), // Fetching the current nonce for the sender
    initCode,
    callData: Account.interface.encodeFunctionData("increment"), // Encoding the call to the increment function
    callGasLimit: String(400_000),
    verificationGasLimit: String(2_248_800),
    preVerificationGas: String(100_000),
    maxFeePerGas: String(ethers.parseUnits("10", "gwei")),
    maxPriorityFeePerGas: String(ethers.parseUnits("5", "gwei")),
    paymasterAndData: PM_ADRRES,
    signature: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  }; // Execute the user operation via the EntryPoint contract, passing the userOp and the fee receiver address

  const customHttpProvider = new bundler.JsonRpcProvider("http://127.0.0.1:3000");

  console.log(userOp)

  const { preVerificationGas, verificationGasLimit, callGasLimit } =
    await customHttpProvider.send("eth_estimateUserOperationGas", [
      userOp,
      EP_ADDRESS,
    ]);

  console.log(verificationGasLimit)

  // const userOpHash = await entryPoint.getUserOpHash(userOp);

  // userOp.signature = signer0.signMessage(ethers.getBytes(userOpHash))

  // const { maxFeePerGas } = await ethers.provider.getFeeData()

  // console.log(maxFeePerGas)

  

  // const tx = await entryPoint.handleOps([userOp], address0);
  // // Wait for the transaction to be confirmed
  // const receipt = await tx.wait();

//   // // Log the transaction receipt to the console
//   console.log(receipt);
}

// Execute the main function and handle any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
