import { ChainId } from "../../core-types";
import 'dotenv/config'

// eslint-disable-next-line no-unused-vars
export const UserOpReceiptIntervals: { [key in ChainId]?: number } = {
  [ChainId.SELENDRA_MAINNET]: 10000,
  [ChainId.SELENDRA_TESTNET]: 2000,
};

// Note: Reduced by 1/10th.. can reduce more
export const UserOpWaitForTxHashIntervals: { [key in ChainId]?: number } = {
  [ChainId.SELENDRA_MAINNET]: 1000,
  [ChainId.SELENDRA_TESTNET]: 500,
};

export const UserOpReceiptMaxDurationIntervals: { [key in ChainId]?: number } = {
    [ChainId.SELENDRA_MAINNET]: 300000,
    [ChainId.SELENDRA_TESTNET]: 50000,
}

export const UserOpWaitForTxHashMaxDurationIntervals: { [key in ChainId]?: number } = {
    [ChainId.SELENDRA_MAINNET]: 20000,
    [ChainId.SELENDRA_TESTNET]: 20000,
}

export const DEFAULT_ENTRYPOINT_ADDRESS =
  process.env[`ENTRY_POINT_ADDRESS`]!;