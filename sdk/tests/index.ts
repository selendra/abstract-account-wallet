import { ethers } from "ethers"
import { KeyWalletProvider, SDK } from "../src"

const randomWallet = ethers.Wallet.createRandom();
let privateKey = randomWallet.privateKey
privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

const wallet = new KeyWalletProvider(privateKey);
const sdk = new SDK(wallet, 1337);

(async () => {
    try {
        await sdk.getUserOperationByHash();
    } catch (e) {
        // Deal with the fact the chain failed
    }
    // `text` is not available here
})();