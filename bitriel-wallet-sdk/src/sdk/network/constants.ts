import { NetworkConfig } from '.';

export enum NetworkNames {
  Testnet = 'selendraTestnet',
  Mainnet = 'SelendraMainnet',
}

export const SupportedNetworks = [1953, 1961];

export const NETWORK_NAME_TO_CHAIN_ID: {
  [key: string]: number;
} = {
  [NetworkNames.Testnet]: 1953,
  [NetworkNames.Mainnet]: 1961,
};

export const onRamperAllNetworks = ['Testnet', 'Mainnet'];

export const Networks: {
  [key: string]: NetworkConfig;
} = {
  [1953]: {
    chainId: 1953,
    bundler: 'https://rpc0-testnet.selendra.org',
    contracts: {
      entryPoint: '0x4de5CB32631610BD611fF498BB153076bE454524',
      walletFactory: {
        bitriel: '0x6d669ef5933f5219E4b9F261515DedA386cA07ac',
        zeroDev: '',
        simpleAccount: '',
      },
    },
    graphqlEndpoint: '',
  },
  [1961]: {
    chainId: 1961,
    bundler: 'https://rpc0.selendra.org',
    contracts: {
      entryPoint: '',
      walletFactory: {
        bitriel: '',
        zeroDev: '',
        simpleAccount: '',
      },
    },
    graphqlEndpoint: '',
  },
};

interface ISafeConstant {
  MultiSend: Record<string, string>;
}

export const Safe: ISafeConstant = {
  MultiSend: {
    '1953': '0x4AAB658d72Df563Ce952D4B3F15AA1c9e4F835c1',
    '1961': '0x4AAB658d72Df563Ce952D4B3F15AA1c9e4F835c1',
  },
};

export const KERNEL_IMPL_ADDRESS = '0xf048AD83CB2dfd6037A43902a2A5Be04e53cd2Eb';
export const KERNEL_VALIDATOR_ADDRESS = '0xd9AB5096a832b9ce79914329DAEE236f8Eea0390';

export const CHAIN_ID_TO_NETWORK_NAME: { [key: number]: NetworkNames } = Object.entries(
  NETWORK_NAME_TO_CHAIN_ID,
).reduce(
  (result, [networkName, chainId]) => ({
    ...result,
    [chainId]: networkName,
  }),
  {},
);

export function getNetworkConfig(key: number) {
  return Networks[key];
}
