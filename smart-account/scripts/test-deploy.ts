import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();

  const EntryPoint = await ethers.getContractFactory("SmartAccountFactory");
  const myToken = await EntryPoint.deploy('0xa37fF661F89824ed16452f2097f9E9C1bc446E09', signer.address);
  await myToken.deployed();

  console.log("Ocean token deployed: ", myToken.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});