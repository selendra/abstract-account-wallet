
import { ethers } from "hardhat";
import { formatEther } from "ethers/lib/utils";
import { BitrielWalletFactory__factory } from "../typechain";

const contractsDeployed: Record<string, string> = {};

let entryPointAddress = "";
let implwalletFactory = "";

export async function deployGeneric(
  contractName: string,
  constructorArguments: any[]
) {
  const contractFactory = await ethers.getContractFactory(contractName);
  const contract = await contractFactory.deploy(...constructorArguments);
  await contract.deployed();
  contractsDeployed[contractName] = contract.address;
  return contract.address;
}

async function deployEntryPointContract() {
  entryPointAddress = await deployGeneric(
    "EntryPoint",
    []
  );
}

async function deployImplWalletFactoryContract() {
  const [signer] = await ethers.getSigners();

  implwalletFactory = await deployGeneric(
    "BitrielWalletFactory",
    [signer.address]
  );
}

async function deployWalletContract() {
  const [signer] = await ethers.getSigners();

  await deployGeneric(
    "BitrielWallet",
    [entryPointAddress, implwalletFactory]
  );

  console.log("setting implementation in wallet factoryd...");
  const ImplWalletFactory = BitrielWalletFactory__factory.connect(
    implwalletFactory,
    signer
  );

  const { hash, wait } = await ImplWalletFactory.setImplementation(entryPointAddress);
  console.log("ImplWalletFactory setImplementation Transaction Hash: ", hash);
  await wait();
}

export async function mainDeploy(): Promise<Record<string, string>> {
  const [deployer] = await ethers.getSigners();
  const deployerBalanceBefore = await deployer.getBalance();
  console.log(
    `Deployer ${deployer.address} initial balance: ${formatEther(
      deployerBalanceBefore
    )}`
  );
  console.log("=========================================");

  await deployEntryPointContract();
  await deployImplWalletFactoryContract();
  await deployWalletContract()

  console.log("=========================================");

  console.log(
    "Deployed Contracts: ",
    JSON.stringify(contractsDeployed, null, 2)
  );
  console.log("=========================================");

  const deployerBalanceAfter = await deployer.getBalance();
  console.log(
    `Deployer ${deployer.address} final balance: ${formatEther(
      deployerBalanceAfter
    )}`
  );
  console.log(
    `Funds used: ${formatEther(
      deployerBalanceBefore.sub(deployerBalanceAfter)
    )}`
  );

  return contractsDeployed;
}

if (require.main === module) {
  mainDeploy().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}