import { BigNumberish, BytesLike } from "ethers";

export type SmartAccountVersion = "1.0.0";

export type UserOperation = {
  sender: string;
  nonce: BigNumberish;
  initCode: BytesLike;
  callData: BytesLike;
  callGasLimit: BigNumberish;
  verificationGasLimit: BigNumberish;
  preVerificationGas: BigNumberish;
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
  paymasterAndData: BytesLike;
  signature: BytesLike;
};

export type Transaction = {
  to: string;
  value?: BigNumberish;
  data?: string;
};

export enum ChainId {
    SELENDRA_MAINNET = 1961,
    SELENDRA_TESTNET = 1953,
}

export enum SmartAccountType {
  BICONOMY,
}