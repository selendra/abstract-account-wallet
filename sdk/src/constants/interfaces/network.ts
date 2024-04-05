import { NetworkNames } from "..";

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
