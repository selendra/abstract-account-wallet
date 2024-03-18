import { ethers } from "hardhat";

async function main() {
	const [owner] = await ethers.getSigners();
	const entrypoint = await ethers.getContractFactory('EntryPoint', owner);
	const ep = await entrypoint.deploy();

	const addr = await ep.getAddress()

	console.log(addr)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});