import { ethers } from "hardhat";

async function main() {
	const EP_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";

	const [owner] = await ethers.getSigners();

	const accountFactory = await ethers.getContractFactory('LightAccountFactory', owner);
	const paymaster = await ethers.getContractFactory('Paymaster', owner);

	const pm = await paymaster.deploy();
	const af = await accountFactory.deploy(owner, EP_ADDRESS) as any;

	const afAddr = await af.getAddress()
	const pmAddr = await pm.getAddress()

	console.log(`paymaster address: ${pmAddr}`)
	console.log(`Account Factory address: ${afAddr}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});