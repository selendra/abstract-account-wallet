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
		  accounts: ["0xcc93b4e455ffa72949ab9fc84bc9e3f380b51b5887e75113402a4a69e77d6cea", "0xebfc4c6f5e113087b3407bf6b9a521bed5061467433389e6b6edb7eecd1acea9"],
		}
	},
};

export default config;