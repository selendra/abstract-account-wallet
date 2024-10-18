import { ethers } from "hardhat";

async function main() {

	const [owner] = await ethers.getSigners();

	const entrypoint = await ethers.getContractFactory("EntryPoint", owner);
	const ep = await entrypoint.deploy();
	
	const epAddr = await ep.getAddress()

	const paymaster = await ethers.getContractFactory('Paymaster', owner);
	const accountFactory = await ethers.getContractFactory('LightAccountFactory', owner);

	const pm = await paymaster.deploy();
	const af = await accountFactory.deploy(epAddr) as any;

	const pmAddr = await pm.getAddress()
	const afAddr = await af.getAddress()
	
	console.log(`EntryPoint address: ${epAddr}`)
	console.log(`Account Factory address: ${afAddr}`)
	console.log(`paymaster address: ${pmAddr}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});