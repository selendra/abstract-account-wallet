import { ethers } from "hardhat";

async function main() {
	const [owner] = await ethers.getSigners();
	const accountFactory = await ethers.getContractFactory('AccountFactory', owner);
	const af = await accountFactory.deploy();

	const addr = await af.getAddress()

	console.log(addr)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});