import { ethers } from "hardhat";
import { ethers as bundler } from "ethers";

// Define constants for the factory contract's nonce and addresses
const FACTORY_NONCE = 1;
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADRRES = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const FACTORY_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  // Retrieve the deployed EntryPoint contract
  const entryPoint = await ethers.getContractAt("EntryPoint", EP_ADDRESS); // Calculate the expected sender (smart account) address using the factory address and nonce
  const AccountFactory = await ethers.getContractFactory("AccountFactory");
  const Account = await ethers.getContractFactory("Account");

  // Retrieve the first signer from the hardhat environment
  const [signer0, signer1] = await ethers.getSigners();
  // Get the address of the first signer
  const address0 = await signer0.getAddress();

  const address1 = await signer1.getAddress();

  // Prepare the initCode by combining the factory address with encoded createAccount function, removing the '0x' prefix
  let initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address1])
      .slice(2); // Deposit funds to the sender account to cover transaction fees

  let sender: string = "";
  try {
    await entryPoint.getSenderAddress(initCode);
  } catch (ex: any) {
    sender = "0x" + ex.data.slice(-40);
    console.log(sender);
  }

  // check if acount have been create
  const senderIsDeploy = await ethers.provider.getCode(sender);
  if (senderIsDeploy !== "0x"){
    initCode = "0x";
  }

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
    signature: "0x",
  }; // Execute the user operation via the EntryPoint contract, passing the userOp and the fee receiver address

//   const customHttpProvider = new bundler.JsonRpcProvider("http://127.0.0.1:3000");

//   console.log(userOp)

//   const { preVerificationGas, verificationGasLimit, callGasLimit } =
//     await customHttpProvider.send("eth_estimateUserOperationGas", [
//       userOp,
//       EP_ADDRESS,
//     ]);

//   console.log(verificationGasLimit)

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = signer1.signMessage(ethers.getBytes(userOpHash))

  const tx = await entryPoint.handleOps([userOp], address1);
  const receipt = await tx.wait();

  console.log(receipt);
}

// Execute the main function and handle any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
