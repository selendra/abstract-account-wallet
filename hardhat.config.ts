import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";

require('dotenv').config()

const ownerAccount = process.env.PRIVATE_KEY || ''

const config: HardhatUserConfig = {
	paths: {
		artifacts: "artifacts",
		cache: "cache",
		sources: "contracts",
		
	},
	solidity: {
		compilers: [
		  {
			version: "0.8.24",
			settings: {
			  optimizer: { enabled: true, runs: 800 },
			  viaIR: true,
			},
		  },
		],
	  },
	defaultNetwork: "local",
	networks: {
		selendra: {
		  url: "https://rpc0.selendra.org",
		  chainId: 1961,
		  accounts: [ownerAccount],
		},
		testnet: {
		  url: "https://rpc0-testnet.selendra.org",
		  chainId: 1953,
		  accounts: [ownerAccount],
		},
		local:{
		  url: "http://127.0.0.1:8545",
		  chainId: 1337,
		  accounts: ["0x477920740e2083ab70e742147833ecb4eb4fed494513be276528620983d65057", "0x1a6e0d43e1bce6d016899c20e9a075f1f6df364ffe3bf76380a1b1e210c475fe"],
		}
	},
};

export default config;