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
	defaultNetwork: "localhost",
	networks: {
		localhost: { 
			url: 'http://localhost:8545',
			accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", ownerAccount]
		},
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
	},
};

export default config;

