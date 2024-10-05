import { ethers } from "hardhat";

const EP_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
const PM_ADDRESS = "0xda2Bd5566c6dEfe816b204ce9333a8526150dAa8";

async function main() {
  const entryPoint = await ethers.getContractAt("EntryPoint", EP_ADDRESS);

  await entryPoint.depositTo(PM_ADDRESS, {
    value: ethers.parseEther("1"),
  });

  console.log("deposit was successful!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});