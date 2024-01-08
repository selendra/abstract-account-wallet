
import { ethers, run } from "hardhat";
import { formatEther } from "ethers/lib/utils";

const smartAccountFactoryOwnerAddress =
  process.env[`SMART_ACCOUNT_FACTORY_OWNER_ADDRESS}`]!;
const paymasterOwnerAddress =
  process.env[`PAYMASTER_OWNER_ADDRESS`]!;
const verifyingSigner =
  process.env[`PAYMASTER_SIGNER_ADDRESS`]!;
const DEPLOYER_CONTRACT_ADDRESS =
  process.env[`DEPLOYER_CONTRACT_ADDRESS`]!;

const contractsDeployed: Record<string, string> = {};

export async function deployGeneric(
  contractName: string,
  constructorArguments: any
) {
  const contractFactory = await ethers.getContractFactory(contractName);
  const contract = await contractFactory.deploy(constructorArguments);
  await contract.deployed();
  contractsDeployed[contractName] = contract.address;

  console.log(
    `${contractName} is deployed with address ${contract.address}`
  );

  return contract.address;
}

async function deployEntryPointContract() {
  await deployGeneric(
    "EntryPoint",
    []
  );
}

async function deployBaseWalletImpContract(entryPointAddress: string){
  await deployGeneric(
    "SmartAccount",
    entryPointAddress
  );
}

export async function mainDeploy(): Promise<Record<string, string>> {
  // verifyDeploymentConfig();

  console.log("=========================================");
  console.log(
    "Smart Account Factory Owner Address: ",
    smartAccountFactoryOwnerAddress
  );
  console.log("Paymaster Owner Address: ", paymasterOwnerAddress);
  console.log("Verifying Signer Address: ", verifyingSigner);
  console.log("Deployer Contract Address: ", DEPLOYER_CONTRACT_ADDRESS);

  const [deployer] = await ethers.getSigners();
  const deployerBalanceBefore = await deployer.getBalance();
  console.log(
    `Deployer ${deployer.address} initial balance: ${formatEther(
      deployerBalanceBefore
    )}`
  );
  console.log("=========================================");

  await deployEntryPointContract();
  await deployBaseWalletImpContract(contractsDeployed["EntryPoint"])
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