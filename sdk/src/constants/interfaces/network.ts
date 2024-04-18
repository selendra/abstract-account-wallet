export enum NetworkNames {
  Selendra = "selendra",
  SelendraTestnet = "selendraTestnet",
  LocalDev = "LocalDev",
}

export interface Network {
  name: NetworkNames;
  chainId: number;
}

export interface NetworkConfig {
  chainId: number;
  provider: string;
  bundler: string;
  contracts: {
    entryPoint: string;
    walletFactory: {
      simpleAccount: string;
    };
    paymentmaster: string | null;
  };
}

