import { ethers } from "hardhat";

// Define constants for the factory contract's nonce and addresses
const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = "0x50CD3D0F4b8AFe0AFbb74b7a532DCbb251B69845";
const EP_ADDRESS = "0x3B40BeC5eD866fd51635CefB1324f3Ce8Ac42E6A";
const PM_ADRRES = "0x9b75ba1f9F99f28b3031961397Ac519987697753";

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

  // // Prepare the initCode by combining the factory address with encoded createAccount function, removing the '0x' prefix
  // const initCode =
  //   FACTORY_ADDRESS +
  //   AccountFactory.interface
  //     .encodeFunctionData("createAccount", [address0])
  //     .slice(2); // Deposit funds to the sender account to cover transaction fees

  //if you want to run in secound time (_createSenderIfNeeded from entrypoint.sol)
  const initCode = "0x";

  // // deposit prefund to entrypoint for execute via (stakemanger)
  // await entryPoint.depositTo(PM_ADRRES, {
  //   value: ethers.parseEther("100"),
  // }); // Define the user operation (userOp) with necessary details for execution

  const userOp: any = {
    sender,
    nonce: await entryPoint.getNonce(sender, 0), // Fetching the current nonce for the sender
    initCode,
    callData: Account.interface.encodeFunctionData("increment"), // Encoding the call to the increment function
    callGasLimit: 400_000,
    verificationGasLimit: 400_000,
    preVerificationGas: 100_000,
    maxFeePerGas: ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("5", "gwei"),
    paymasterAndData: PM_ADRRES,
    signature: "0x",
  }; // Execute the user operation via the EntryPoint contract, passing the userOp and the fee receiver address

  const userOpHash = await entryPoint.getUserOpHash(userOp);

  userOp.signature = signer0.signMessage(ethers.getBytes(userOpHash))

  const tx = await entryPoint.handleOps([userOp], address0);
  // Wait for the transaction to be confirmed
  const receipt = await tx.wait();

  // // Log the transaction receipt to the console
  console.log(receipt);
}

// Execute the main function and handle any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
