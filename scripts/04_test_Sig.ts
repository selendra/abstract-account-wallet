import { ethers } from "hardhat";

async function main() {
    const [signer] = await ethers.getSigners();

    const signature = await signer.signMessage(ethers.getBytes(ethers.id("validate")))

    const Test = await ethers.getContractFactory("TestSig",)
    const test = await Test.deploy(signature);

    console.log(`address ${await signer.getAddress()}`)
}

// Execute the main function and handle any errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  

//   npx hardhat run scripts/02.excecute.ts --network localhost