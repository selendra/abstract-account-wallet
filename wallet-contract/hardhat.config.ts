import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";

require('dotenv').config()

const ownerAccount = process.env.PRIVATE_KEY || ''

import * as fs from 'fs'

const mnemonicFileName = process.env.MNEMONIC_FILE ?? `${process.env.HOME}/.secret/testnet-mnemonic.txt`
let mnemonic = 'test '.repeat(11) + 'junk'
if (fs.existsSync(mnemonicFileName)) { mnemonic = fs.readFileSync(mnemonicFileName, 'ascii') }

function getNetwork1 (url: string): { url: string, accounts: { mnemonic: string } } {
  return {
    url,
    accounts: { mnemonic }
  }
}

function getNetwork (name: string): { url: string, accounts: { mnemonic: string } } {
  return getNetwork1(`https://${name}.infura.io/v3/${process.env.INFURA_ID}`)
  // return getNetwork1(`wss://${name}.infura.io/ws/v3/${process.env.INFURA_ID}`)
}

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
	networks: {
		dev: { url: 'http://localhost:8545' },
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
		proxy: getNetwork1('http://localhost:8545')
	},
};

export default config;