import { ModuleVersion } from "./Types";
import 'dotenv/config'

export const DEFAULT_MODULE_VERSION: ModuleVersion = "V1_0_0";

export const DEFAULT_ENTRYPOINT_ADDRESS = process.env[`ENTRY_POINT_ADDRESS`]!;

export const ENTRYPOINT_ADDRESSES_BY_VERSION = {
  V1_0_0: process.env[`ENTRY_POINT_ADDRESS`]!
};

// Note: we could append these defaults with ADDRESS suffix
export const DEFAULT_ECDSA_OWNERSHIP_MODULE = process.env[`ENTRY_POINT_ADDRESS`]!;

export const ECDSA_OWNERSHIP_MODULE_ADDRESSES_BY_VERSION = {
  V1_0_0: process.env[`ENTRY_POINT_ADDRESS`]!,
};

export const DEFAULT_SESSION_KEY_MANAGER_MODULE = process.env[`SESSION_KEY_MANAGER_MODULE`]!;

export const SESSION_MANAGER_MODULE_ADDRESSES_BY_VERSION = {
  V1_0_0: process.env[`SESSION_KEY_MANAGER_MODULE`]!,
};

// similarly others here or in module / signer classes
// Mapping / Reverse mapping of version -> module address can be kept here

export const ERC20_ABI = [
  "function transfer(address to, uint256 value) external returns (bool)",
  "function transferFrom(address from, address to, uint256 value) external returns (bool)",
  "function approve(address spender, uint256 value) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)",
];