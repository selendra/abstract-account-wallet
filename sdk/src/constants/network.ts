import { NetworkConfig, NetworkNames } from ".";

export const SupportedNetworks = [1961, 1953, 1337];

export const NETWORK_NAME_TO_CHAIN_ID: {
  [key: string]: number;
} = {
  [NetworkNames.Selendra]: 1961,
  [NetworkNames.SelendraTestnet]: 1953,
  [NetworkNames.LocalDev]: 1337,
};

export const Networks: {
  [key: string]: NetworkConfig;
} = {
  [1961]: {
    chainId: 1961,
    provider: "",
    bundler: "",
    contracts: {
      entryPoint: "",
      walletFactory: {
        simpleAccount: "",
      },
      paymentmaster: null,
    },
  },
  [1953]: {
    chainId: 1953,
    provider: "",
    bundler: "",
    contracts: {
      entryPoint: "",
      walletFactory: {
        simpleAccount: "",
      },
      paymentmaster: null,
    },
  },
  [1337]: {
    chainId: 1337,
    provider: "http://127.0.0.1:8545",
    bundler: "http://127.0.0.1:3000",
    contracts: {
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      walletFactory: {
        simpleAccount: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      },
      paymentmaster: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    },
  },
};

export const CHAIN_ID_TO_NETWORK_NAME: { [key: number]: NetworkNames } =
  Object.entries(NETWORK_NAME_TO_CHAIN_ID).reduce(
    (result, [networkName, chainId]) => ({
      ...result,
      [chainId]: networkName,
    }),
    {}
  );

export function getNetworkConfig(key: number) {
  return Networks[key];
}
