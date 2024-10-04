import { ethers } from "hardhat";
import { BigNumberish, ethers as bundler, } from "ethers";
import { randomBytes } from "crypto";

const bundlerProvider = new bundler.JsonRpcProvider("http://127.0.0.1:3000");

const EP_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
const PM_ADRRES = "0xda2Bd5566c6dEfe816b204ce9333a8526150dAa8";
const FACTORY_ADDRESS = "0x51e5eDFb3C66DE71516D0B92417f3DDe81F96C68";

async function main() {
  // Retrieve the deployed EntryPoint contract
  const entryPoint = await ethers.getContractAt("EntryPoint", EP_ADDRESS); // Calculate the expected sender (smart account) address using the factory address and nonce
  const AFactory = await ethers.getContractAt("LightAccountFactory", FACTORY_ADDRESS);
  const AccountFactory = await ethers.getContractFactory("LightAccountFactory");
  
  const Account = await ethers.getContractFactory("LightAccount");

  // Retrieve the first signer from the hardhat environment
  const [signer0] = await ethers.getSigners();
  // Get the address of the first signer
  const address0 = await signer0.getAddress();

  const salt = "0x33e34b09d1f4ca3ab07f99aaadbd13af9a7bd9bf" //"0x" + randomBytes(32).toString("hex");


  await AFactory.createAccount(address0, salt);

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
  }

  console.log(sender);

  // check if acount have been create
  const senderIsDeploy = await ethers.provider.getCode(sender);
  if (senderIsDeploy !== "0x") {
    initCode = "0x";
  }

  const encodeData = (target: string, value: BigNumberish, data: string) => {
    return Account.interface.encodeFunctionData('execute', [target, value, data])
  }

  // console.log(await ethers.provider.getBalance(sender))
  // console.log(await ethers.provider.getBalance("0xAb89ea78baB322ca2062DFf7EA0530C7fb03156E"))

  // //  // Encoding the call to the increment function
  // const callData = encodeData("0xAb89ea78baB322ca2062DFf7EA0530C7fb03156E", "100000000000000000", "0x");  // transfer native token
  const storagedata = await encodeStoragedata(3); // example of call other contract funtion
  const stotageAddress = "0x6E0E1090348AC4061fEd3b079B34Ba594Aa4815B" // target contract
  const callData = encodeData(stotageAddress, 0, storagedata);

  const userOp: any = {
    sender,
    nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
    factoryData: initCode,
    callData,
    signature: '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c',
    paymaster: PM_ADRRES,
  }; // Execute the user operation via the EntryPoint contract, passing the userOp and the fee receiver address

  console.log
  
  try {
    const data = await bundlerProvider.send("eth_estimateUserOperationGas", [
      userOp,
      EP_ADDRESS,
    ]);
    console.log(data)
  }catch(error){
    console.log(error)
  }
   
  

  // userOp.maxFeePerGas = "0x" + maxFeePerGas?.toString(16);
  // userOp.maxPriorityFeePerGas = "0x" + maxPriorityFeePerGas?.toString(16);


  // const userOpHash = await entryPoint.getUserOpHash(userOp);
  // userOp.signature = (await (signer0.signMessage(ethers.getBytes(userOpHash)))).toString();

  // const opHash = await bundlerProvider.send("eth_sendUserOperation", [
  //   userOp,
  //   EP_ADDRESS,
  // ]);

  //   setTimeout(async () => {
  //   const { transactionHash } = await bundlerProvider.send(
  //     "eth_getUserOperationByHash",
  //     [opHash]
  //   );

  //   console.log(transactionHash);
  // }, 8000);


  // // const tx = await entryPoint.handleOps([userOp], address0);
  // // const receipt = await tx.wait();

  // // console.log(opHash);

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
