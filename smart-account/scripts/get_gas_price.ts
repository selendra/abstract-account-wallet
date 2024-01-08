import { ethers } from "hardhat";

async function main() {
    const feeData = await ethers.provider.getFeeData();

    let gasPrice = feeData.gasPrice ? feeData.gasPrice: 0;
    let maxFeePerGas = feeData.maxFeePerGas;
    let maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;

    const gasPriceInEth = ethers.utils.formatUnits(gasPrice, 'ether');
    const gasPriceInGwei = ethers.utils.formatUnits(gasPrice, 'gwei');
    const gasPriceInWei = ethers.utils.formatUnits(gasPrice, 'wei');

    console.log(`price in Ether ${gasPriceInEth}`)
    console.log(`price in Gwei ${gasPriceInGwei}`)
    console.log(`price in Wei ${gasPriceInWei}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});