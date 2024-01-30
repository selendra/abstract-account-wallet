import { StateStorage } from './state';

export interface PaymasterApi {
  url: string;
  context?: any;
}

export enum Factory {
  ZERO_DEV = 'zeroDev',
  BITRIEL = 'bitriel',
  SIMPLE_ACCOUNT = 'simpleAccount',
}

export interface SdkOptions {
  chainId: number;
  stateStorage?: StateStorage;
  bundlerRpcUrl?: string;
  rpcProviderUrl?: string;
  graphqlEndpoint?: string;
  projectKey?: string;
  factoryWallet?: Factory;
  walletFactoryAddress?: string;
  entryPointAddress?: string;
  accountAddress?: string;
  index?: number;
}

export enum graphqlEndpoints {
  QA = 'qa-bitriel.selendra.org',
  PROD = 'bitriel.selendra.org',
}
