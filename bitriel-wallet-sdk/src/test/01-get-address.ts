import { BitrielSdk } from '../sdk';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  // initializating sdk...
  const bitrielSdk = new BitrielSdk(
    { privateKey: process.env.WALLET_PRIVATE_KEY },
    { chainId: Number(process.env.CHAIN_ID) },
  );

  // get EtherspotWallet address...
  const address: string = await bitrielSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `BitrielWallet address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
