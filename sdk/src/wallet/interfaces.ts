import { BytesLike, Wallet } from 'ethers';
import { NetworkNames } from '../constants';

export interface WalletProvider {
  readonly type?: string;
  readonly wallet?: Wallet;
  readonly address: string;
  readonly networkName?: NetworkNames;

  signMessage(message: BytesLike): Promise<string>;
}

export type WalletProviderLike = WalletProvider;