import { ethers } from "hardhat";

const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PM_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

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