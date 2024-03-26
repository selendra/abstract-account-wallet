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
		  accounts: ["0x72a17daafae48f6ce5e3cad3e322a2a23c957af0fae555cdf890729fb08e4ed1", "0x29c04936d44dda2950d5e79b4ff74ea5af690f299ab89b026da3f77bb9392100"],
		}
	},
};

export default config;