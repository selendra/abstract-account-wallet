import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";

require('dotenv').config()

const ownerAccount = process.env.PRIVATE_KEY || '0xc57ce1f4b3c390da493e6cf5d1763344fa49347a26db142c2d307eeda0293a1e'

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
			  optimizer: { enabled: true, runs: 10000 },
			  viaIR: true,
			},
		  },
		],
	  },
	defaultNetwork: "selendra",
	networks: {
		localhost: { 
			url: 'http://127.0.0.1:14337/rpc',
			accounts: ["0xc57ce1f4b3c390da493e6cf5d1763344fa49347a26db142c2d307eeda0293a1e", ownerAccount]
		},
		selendra: {
		  url: "https://rpc.selendra.org",
		  chainId: 1961,
		  accounts: [ownerAccount],
		},
		testnet: {
		  url: "https://rpc-testnet.selendra.org",
		  chainId: 1953,
		  accounts: [ownerAccount],
		},
	},
};

export default config;

