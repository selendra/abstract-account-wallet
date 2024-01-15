
import { ethers } from "hardhat";
import { formatEther, isAddress } from "ethers/lib/utils";
import { EntryPoint__factory, SmartAccountFactory__factory, VerifyingSingletonPaymaster__factory } from "../typechain";
import { DEPLOYMENT_GAS_PRICES, factoryStakeConfig, paymasterStakeConfig } from "./config";

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

async function deployVerifySingeltonPaymaster() {
  const [signer] = await ethers.getSigners();
  const chainId = (await provider.getNetwork()).chainId;
  const gasPriceConfig = DEPLOYMENT_GAS_PRICES[chainId];

  const paymasterAddress = await deployGeneric(
    "VerifyingPaymaster",
    [entryPointAddress, verifyingSigner]
  );

  console.log("Checking if VerifyingPaymaster is staked...");
  const { unstakeDelayInSec, stakeInWei } = paymasterStakeConfig[chainId];
  const entrypoint = EntryPoint__factory.connect(entryPointAddress, signer);
  let stake = await entrypoint.getDepositInfo(paymasterAddress);
  console.log("Current Paymaster Stake: ", JSON.stringify(stake, null, 2));
  if (stake.staked) {
    console.log("Paymaster already staked");
    return;
  }

  console.log("Staking Paymaster...");
  const paymaster = VerifyingSingletonPaymaster__factory.connect(
    paymasterAddress,
    signer
  );

  const contractOwner = await paymaster.owner();

  if (contractOwner === signer.address) {
    const { hash, wait } = await paymaster.addStake(unstakeDelayInSec, {
      value: stakeInWei,
      ...gasPriceConfig,
    });
    console.log("Paymaster Stake Transaction Hash: ", hash);
    await wait();
  } else {
    console.log("Paymaster is not owned by signer, skipping staking...");
  }

  stake = await entrypoint.getDepositInfo(paymasterAddress);
  console.log("Updated Paymaster Stake: ", JSON.stringify(stake, null, 2));

  if (contractOwner !== paymasterOwnerAddress) {
    console.log("Transferring Ownership of VerifyingPaymaster...");
    const { hash, wait } = await paymaster.transferOwnership(
      paymasterOwnerAddress,
      {
        ...gasPriceConfig,
      }
    );
    console.log("Paymaster Transfer Ownership Transaction Hash: ", hash);
    await wait();
  }
}

async function deployErc20SessionValidationModule() {
  await deployGeneric(
    "ERC20SessionValidationModule",
    []
  );
}

async function deploySmartContractOwnershipRegistryModule() {
  await deployGeneric(
    "SmartContractOwnershipRegistryModule",
    []
  );
}

async function deployEcdsaOwnershipRegistryModule() {
  await deployGeneric(
    "EcdsaOwnershipRegistryModule",
    []
  );
}

async function deploySessionKeyManagerModule() {
  await deployGeneric(
    "SessionKeyManagerModule",
    []
  );
}

const verifyDeploymentConfig = () => {
  if (!isAddress(smartAccountFactoryOwnerAddress)) {
    throw new Error("Invalid Smart Account Factory Owner Address");
  }

  if (!isAddress(paymasterOwnerAddress)) {
    throw new Error("Invalid Paymaster Owner Address");
  }

  if (!isAddress(verifyingSigner)) {
    throw new Error("Invalid Verifying Signer Address");
  }

  if (!isAddress(DEPLOYER_CONTRACT_ADDRESS)) {
    throw new Error("Invalid Deployer Contract Address");
  }
};


export async function mainDeploy(): Promise<Record<string, string>> {
  verifyDeploymentConfig();

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
  await deployVerifySingeltonPaymaster()
  await deployErc20SessionValidationModule()
  await deploySmartContractOwnershipRegistryModule()
  await deployEcdsaOwnershipRegistryModule()
  await deploySessionKeyManagerModule()

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