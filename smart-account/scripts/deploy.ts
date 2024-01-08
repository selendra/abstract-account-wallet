
import { ethers, run } from "hardhat";
import { formatEther } from "ethers/lib/utils";
import { EntryPoint__factory, SmartAccountFactory__factory } from "../typechain";
import { DEPLOYMENT_GAS_PRICES, factoryStakeConfig } from "./config";

const smartAccountFactoryOwnerAddress =
  process.env[`SMART_ACCOUNT_FACTORY_OWNER_ADDRESS`]!;
const paymasterOwnerAddress =
  process.env[`PAYMASTER_OWNER_ADDRESS`]!;
const verifyingSigner =
  process.env[`PAYMASTER_SIGNER_ADDRESS`]!;
const DEPLOYER_CONTRACT_ADDRESS =
  process.env[`DEPLOYER_CONTRACT_ADDRESS`]!;

const provider = ethers.provider;
const contractsDeployed: Record<string, string> = {};

let entryPointAddress = "";
let baseImpAddress = "";

export async function deployGeneric(
  contractName: string,
  constructorArguments: any[]
) {
  const contractFactory = await ethers.getContractFactory(contractName);
  const contract = await contractFactory.deploy(...constructorArguments);
  await contract.deployed();
  contractsDeployed[contractName] = contract.address;

  console.log(
    `${contractName} is deployed with address ${contract.address}`
  );

  return contract.address;
}

async function deployEntryPointContract() {
  entryPointAddress = await deployGeneric(
    "EntryPoint",
    []
  );
}

async function deployBaseWalletImpContract(){
  baseImpAddress = await deployGeneric(
    "SmartAccount",
    [entryPointAddress]
  );
}

async function deployWalletFactoryContract() {
  const [signer] = await ethers.getSigners();
  const chainId = (await provider.getNetwork()).chainId;

  const gasPriceConfig = DEPLOYMENT_GAS_PRICES[chainId];
  const { unstakeDelayInSec, stakeInWei } = factoryStakeConfig[chainId];

  const smartAccountFactoryAddress = await deployGeneric(
    "SmartAccountFactory",
    [baseImpAddress, signer.address]
  );

  console.log("Checking if Factory is staked...");
  const entrypoint = EntryPoint__factory.connect(entryPointAddress, signer);
  let stake = await entrypoint.getDepositInfo(smartAccountFactoryAddress);
  console.log("Current Factory Stake: ", JSON.stringify(stake, null, 2));
  if (stake.staked) {
    console.log("Factory already staked");
    return;
  }

  console.log("Staking Wallet Factory...");
  const smartAccountFactory = SmartAccountFactory__factory.connect(
    smartAccountFactoryAddress,
    signer
  );

  const contractOwner = await smartAccountFactory.owner();

  if (contractOwner === signer.address) {
    const { hash, wait } = await smartAccountFactory.addStake(
      entryPointAddress,
      unstakeDelayInSec,
      {
        value: stakeInWei,
        ...gasPriceConfig,
      }
    );
    console.log("SmartAccountFactory Stake Transaction Hash: ", hash);
    await wait();
  } else {
    console.log("Factory is not owned by signer, skipping staking...");
  }

  stake = await entrypoint.getDepositInfo(smartAccountFactoryAddress);
  console.log("Updated Factory Stake: ", JSON.stringify(stake, null, 2));

  if (contractOwner !== smartAccountFactoryOwnerAddress) {
    console.log("Transferring Ownership of SmartAccountFactory...");
    const { hash, wait } = await smartAccountFactory.transferOwnership(
      smartAccountFactoryOwnerAddress,
      {
        ...gasPriceConfig,
      }
    );
    console.log(
      "SmartAccountFactory Transfer Ownership Transaction Hash: ",
      hash
    );
    await wait();
  }

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
  await deployBaseWalletImpContract()
  await deployWalletFactoryContract()
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