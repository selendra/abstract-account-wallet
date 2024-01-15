import { ChainId } from "../../core-types";
import {
  EntryPointAddresses,
  BiconomyFactories,
  BiconomyImplementations,
  EntryPointAddressesByVersion,
  BiconomyFactoriesByVersion,
  BiconomyImplementationsByVersion,
} from "./Types";
import 'dotenv/config'

// will always be latest entrypoint address
export const DEFAULT_ENTRYPOINT_ADDRESS = process.env[`ENTRY_POINT_ADDRESS`]!;
export const ENTRYPOINT_ADDRESS_V1_0_0 = process.env[`ENTRY_POINT_ADDRESS_V1_0_0`] || process.env[`ENTRY_POINT_ADDRESS`] ;

export const ENTRYPOINT_ADDRESSES: EntryPointAddresses = {
    ENTRYPOINT_ADDRESS_V1_0_0: "V1_0_0",
};

// will always be latest factory address
export const DEFAULT_SMART_WALLET_FACTORY_ADDRESS = process.env[`SMART_WALLET_FACTORY_ADDRESS`]!;
export const DEFAULT_FALLBACK_HANDLER_ADDRESS = process.env[`SMART_WALLET_FACTORY_ADDRESS`]!;
export const SMART_WALLET_FACTORY_ADDRESS_V1_0_0 = process.env[`SMART_WALLET_FACTORY_ADDRESS_V1_0_0`] || process.env[`SMART_WALLET_FACTORY_ADDRESS`] ;

export const SMART_WALLET_FACTORY_ADDRESSES: BiconomyFactories = {
    SMART_WALLET_FACTORY_ADDRESS_V1_0_0: "V1_0_0",
};

// will always be latest implementation address
export const DEFAULT_SMART_WALLET_IMPLEMENTATION_ADDRESS = process.env[`SMART_WALLET_IMPLEMENTATION_ADDRESS`]!;
export const SMART_WALLET_IMPLEMENTATION_ADDRESS_V1_0_0 = process.env[`SMART_WALLET_IMPLEMENTATION_ADDRESS_V1_0_0`] || process.env[`SMART_WALLET_IMPLEMENTATION_ADDRESS`] ;

export const SMART_WALLET_IMPLEMENTATION_ADDRESSES: BiconomyImplementations = {
   SMART_WALLET_IMPLEMENTATION_ADDRESS_V1_0_0: "V1_0_0",
};

export const ENTRYPOINT_ADDRESSES_BY_VERSION: EntryPointAddressesByVersion = {
  V0_0_5: "0x27a4db290b89ae3373ce4313cbeae72112ae7da9",
  V0_0_6: "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
};

export const SMART_WALLET_FACTORY_ADDRESSES_BY_VERSION: BiconomyFactoriesByVersion = Object.fromEntries(
  Object.entries(SMART_WALLET_FACTORY_ADDRESSES).map(([k, v]) => [v, k]),
);

export const SMART_WALLET_IMPLEMENTATION_ADDRESSES_BY_VERSION: BiconomyImplementationsByVersion = Object.fromEntries(
  Object.entries(SMART_WALLET_IMPLEMENTATION_ADDRESSES).map(([k, v]) => [v, k]),
);

export const EIP1559_UNSUPPORTED_NETWORKS: Array<ChainId> = [1953, 1961];

export const PROXY_CREATION_CODE =
  "0x6080346100aa57601f61012038819003918201601f19168301916001600160401b038311848410176100af578084926020946040528339810103126100aa57516001600160a01b0381168082036100aa5715610065573055604051605a90816100c68239f35b60405162461bcd60e51b815260206004820152601e60248201527f496e76616c696420696d706c656d656e746174696f6e206164647265737300006044820152606490fd5b600080fd5b634e487b7160e01b600052604160045260246000fdfe608060405230546000808092368280378136915af43d82803e156020573d90f35b3d90fdfea2646970667358221220a03b18dce0be0b4c9afe58a9eb85c35205e2cf087da098bbf1d23945bf89496064736f6c63430008110033";

export const ADDRESS_RESOLVER_ADDRESS = process.env[`ADDRESS_RESOLVER_ADDRESS`]!;

export const DefaultGasLimit = {
  callGasLimit: 800000,
  verificationGasLimit: 1000000,
  preVerificationGas: 100000,
};