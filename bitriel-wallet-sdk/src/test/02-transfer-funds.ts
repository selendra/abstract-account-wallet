import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { BitrielSdk } from '../sdk';
import { printOp } from '../sdk/common/OperationUtils';
import { sleep } from '../sdk/common';

dotenv.config();

const recipient = '0x80a1874E1046B1cc5deFdf4D3153838B72fF94Ac'; // recipient wallet address
const value = '0.00001'; // transfer value

async function main() {
  // initializating sdk...
  const bitrielSdk = new BitrielSdk(
    { privateKey: process.env.WALLET_PRIVATE_KEY },
    { chainId: Number(process.env.CHAIN_ID) },
  );

  console.log('address: ', bitrielSdk.state.EOAAddress);

  // get address of BitrielWallet...
  const address: string = await bitrielSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `BitrielWallet address: ${address}`);

  // clear the transaction batch
  await bitrielSdk.clearUserOpsFromBatch();

  // add transactions to the batch
  const transactionBatch = await bitrielSdk.addUserOpsToBatch({ to: recipient, value: ethers.utils.parseEther(value) });
  console.log('transactions: ', transactionBatch);

  // get balance of the account address
  const balance = await bitrielSdk.getNativeBalance();

  console.log('balances: ', balance);

  // estimate transactions added to the batch and get the fee data for the UserOp
  const op = await bitrielSdk.estimate();
  console.log(`Estimate UserOp: ${await printOp(op)}`);

  //   // sign the UserOp and sending to the bundler...
  //   const uoHash = await bitrielSdk.send(op);
  //   console.log(`UserOpHash: ${uoHash}`);

  //   // get transaction hash...
  //   console.log('Waiting for transaction...');
  //   let userOpsReceipt = null;
  //   const timeout = Date.now() + 60000; // 1 minute timeout
  //   while((userOpsReceipt == null) && (Date.now() < timeout)) {
  //     await sleep(2);
  //     userOpsReceipt = await bitrielSdk.getUserOpReceipt(uoHash);
  //   }
  //   console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
