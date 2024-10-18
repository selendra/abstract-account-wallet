import { ethers } from "hardhat";
import { BigNumberish, ethers as bundler, } from "ethers";
import { randomBytes } from "crypto";

const EP_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
const PM_ADRRES = "0x99202434921642effF80D50cCa49f1dd74D9bF8F";
const FACTORY_ADDRESS = "0xb323171fD9b7fC7d577F68623Ea012f37E816AC8";

async function main() {
  const entryPoint = await ethers.getContractAt("EntryPoint", EP_ADDRESS); // Calculate the expected sender (smart account) address using the factory address and nonce
  const AFactory = await ethers.getContractAt("LightAccountFactory", FACTORY_ADDRESS);
  const AccountFactory = await ethers.getContractFactory("LightAccountFactory");
  const Account = await ethers.getContractFactory("LightAccount");

  const [signer0] = await ethers.getSigners();
  const address0 = await signer0.getAddress();
  const salt = "0x33e34b09d1f4ca3ab07f99aaadbd13af9a7bd9bf"

  // await AFactory.createAccount(address0, salt);

  let initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0, salt])
      .slice(2);

  let sender: string = "";
  try {
    await entryPoint.getSenderAddress(initCode);
  } catch (ex: any) {
    sender = "0x" + ex.data.slice(-40);
  }

  // check if acount have been create
  const senderIsDeploy = await ethers.provider.getCode(sender);
  if (senderIsDeploy !== "0x") {
    initCode = "0x";
  }

  const encodeData = (target: string, value: BigNumberish, data: string) => {
    return Account.interface.encodeFunctionData('execute', [target, value, data])
  }

  // //  // Encoding the call to the increment function
  const callData = encodeData("0x25018807e887c36B0a7761cE17876eE81AD78209", "100000000000000000", "0x");  // transfer native token

  const accountGasLimits  = packUint("0xb5db", "0xc81b")
  const gasFees = packUint(BigInt("0x01868504f2"), BigInt("0x59682f00"))
  const paymasterVerificationGasLimit = 600000n;
  const postOpGasLimit = 600000;

  const paymasterAndData = packPaymasterData(
    PM_ADRRES,
    paymasterVerificationGasLimit,
    postOpGasLimit,
    "0x"
  )
  const userOp: any = {
      sender: sender,
      nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
      initCode: initCode,
      callData: callData,
      accountGasLimits,
      preVerificationGas: "0x186A0",
      gasFees,
      paymasterAndData: paymasterAndData,
      signature: '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c',
    }

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = (await (signer0.signMessage(ethers.getBytes(userOpHash)))).toString();

  const tx = await entryPoint.handleOps([userOp], address0, { gasLimit: 10_000_000});
  const receipt = await tx.wait();

  console.log(receipt);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

function packUint(high128: bundler.BigNumberish, low128: bundler.BigNumberish): string {
  const high = ethers.getBigInt(high128);
  const low = ethers.getBigInt(low128);
  const packed = (high << 128n) | low;
  return ethers.zeroPadValue(ethers.toBeHex(packed), 32);
}

function packPaymasterData(
  paymaster: string,
  paymasterVerificationGasLimit: bundler.BigNumberish,
  postOpGasLimit: bundler.BigNumberish,
  paymasterData: bundler.BytesLike = '0x'
): string {
  const packedUint = packUint(paymasterVerificationGasLimit, postOpGasLimit);
  return bundler.concat([
      paymaster,
      packedUint,
      paymasterData
  ]);
}