import { ethers } from "hardhat";

async function deploy(signer: any) {
    const storage = await ethers.getContractFactory('Storage', signer);
    const st = await storage.deploy();
    const stAddr = await st.getAddress()
    console.log(`Storage address: ${stAddr}`)
}

async function store(signer: any, address: string, value: number) {
    const storage = await ethers.getContractAt("Storage", address);
    await storage.store(value)
}

async function retrieve(signer: any, address: string) {
    const storage = await ethers.getContractAt("Storage", address);
    console.log(await storage.retrieve())
}

async function main() {
	const [owner] = await ethers.getSigners();
	// await deploy(owner)

    const storage = "0x0165878A594ca255338adfa4d48449f69242Eb8F"

    // await store(owner, storage, 5);
    await retrieve(owner, storage);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});