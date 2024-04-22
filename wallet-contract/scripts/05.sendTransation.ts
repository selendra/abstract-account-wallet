import { ethers } from "hardhat";

const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
    const [signer0] = await ethers.getSigners();

    const tx = {
        to: "0xc09d08a44a18149e93cb7863a3899f9907661951",
        value: "10"
    }

    signer0.sendTransaction(tx).then((data) => {
        console.log(data.hash)
    })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});