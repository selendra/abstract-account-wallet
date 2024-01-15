import { ChainId } from "../core-types";

export const NODE_CLIENT_URL = "http://127.0.0.1/v1";

// eslint-disable-next-line no-unused-vars
export const RPC_PROVIDER_URLS: { [key in ChainId]?: string } = {
  [ChainId.SELENDRA_MAINNET]: "https://rpc0.selendra.org",
  [ChainId.SELENDRA_TESTNET]: "https://rpc0-testnet.selendra.org",
}