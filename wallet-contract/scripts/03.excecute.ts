import { ethers } from "hardhat";
import { BigNumberish, ethers as bundler } from "ethers";
import { randomBytes } from "crypto";

const bundlerProvider = new bundler.JsonRpcProvider("http://0.0.0.0:3000");

// Define constants for the factory contract's nonce and addresses
const FACTORY_NONCE = 1;
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADRRES = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

async function main() {
  // Retrieve the deployed EntryPoint contract
  const entryPoint = await ethers.getContractAt("EntryPoint", EP_ADDRESS); // Calculate the expected sender (smart account) address using the factory address and nonce
  const AccountFactory = await ethers.getContractFactory("LightAccountFactory");
  const Account = await ethers.getContractFactory("LightAccount");

  const [signer0] = await ethers.getSigners();
  const address0 = await signer0.getAddress();

  const salt = "0x33e34b09d1f4ca3ab07f99aaadbd13af9a7bd9bf" //"0x" + randomBytes(32).toString("hex");

  // Prepare the initCode by combining the factory address with encoded createAccount function, removing the '0x' prefix
  let initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0, salt])
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
  if (senderIsDeploy !== "0x") {
    initCode = "0x";
  }

  const encodeData = (target: string, value: BigNumberish, data: string) => {
    return Account.interface.encodeFunctionData('execute', [target, value, data])
  }

  // Encoding the call to the increment function
  // const callData = encodeData("0xcE2Dd4ef6aD5e8aB787B35BED941A5c213C99Dd6", 1, "0x");  // transfer native token

  const storagedata = await encodeStoragedata(3); // example of call other contract funtion
  const stotageAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707" // target contract
  const callData = encodeData(stotageAddress, 0, storagedata);

  const userOp: any = {
    sender,
    nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
    initCode,
    callData,
    paymasterAndData: PM_ADRRES,
    signature: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  }; // Execute the user operation via the EntryPoint contract, passing the userOp and the fee receiver address

  userOp.callGasLimit = 2000_000;
  userOp.verificationGasLimit = 2000_000;
  userOp.preVerificationGas = 5000_000;

  const { maxFeePerGas, maxPriorityFeePerGas } = await ethers.provider.getFeeData();

  userOp.maxFeePerGas = "0x" + maxFeePerGas?.toString(16);
  userOp.maxPriorityFeePerGas = "0x" + maxPriorityFeePerGas?.toString(16);

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = (await (signer0.signMessage(ethers.getBytes(userOpHash)))).toString();

  const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();
  console.log(receipt)
}

// Execute the main function and handle any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


async function encodeStoragedata(value: BigNumberish,): Promise<string> {

  const contractAbi = await ethers.getContractFactory("Storage");
  const callData = contractAbi.interface.encodeFunctionData('store', [value])

  return callData
}