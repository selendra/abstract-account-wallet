import { ethers } from "hardhat";

async function main() {
	const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

	const [owner] = await ethers.getSigners();

	const paymaster = await ethers.getContractFactory('Paymaster', owner);
	const accountFactory = await ethers.getContractFactory('LightAccountFactory', owner);

	const pm = await paymaster.deploy();
	const af = await accountFactory.deploy(EP_ADDRESS) as any;

	const pmAddr = await pm.getAddress()
	const afAddr = await af.getAddress()
	console.log(`paymaster address: ${pmAddr}`)
	console.log(`Account Factory address: ${afAddr}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});