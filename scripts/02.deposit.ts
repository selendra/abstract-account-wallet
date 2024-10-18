import { ethers } from "hardhat";

const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  const entryPoint = await ethers.getContractAt("EntryPoint", EP_ADDRESS);

  await entryPoint.depositTo(PM_ADDRESS, {
    value: ethers.parseEther("5"),
  });

  console.log("deposit was successful!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});