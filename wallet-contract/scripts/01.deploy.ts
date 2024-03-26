import { ethers } from "hardhat";

async function main() {
	const [owner] = await ethers.getSigners();

	const entrypoint = await ethers.getContractFactory('EntryPoint', owner);
	const paymaster = await ethers.getContractFactory('Paymaster', owner);
	const accountFactory = await ethers.getContractFactory('AccountFactory', owner);

	const ep = await entrypoint.deploy();
	const pm = await paymaster.deploy();
	const af = await accountFactory.deploy();

	const epAddr = await ep.getAddress()
	const pmAddr = await pm.getAddress()
	const afAddr = await af.getAddress()

	console.log(`endpoint address: ${epAddr}`)
	console.log(`paymaster address: ${pmAddr}`)
	console.log(`Account Factory address: ${afAddr}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});