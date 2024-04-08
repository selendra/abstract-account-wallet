import { ethers } from "ethers";
import { FactoryType, getNetworkConfig } from "../constants";
import { Exception } from "../errorHandler";
import { WalletProviderLike } from "../wallet";

export class sdk {
  readonly bundlerUrl: string;
  readonly providerUrl: string;
  readonly entryPoint: string;
  readonly walletFactory: string;
  readonly paymaster: string;

  constructor(
    walletProvider: WalletProviderLike,
    chainId: number,
    factory: FactoryType
  ) {
    const networkConfig = getNetworkConfig(chainId);
    if (!networkConfig) throw new Exception("network not found");

    if (networkConfig.bundler == "")
      throw new Exception("No bundler url provided");
    this.bundlerUrl = networkConfig.bundler;

    if (networkConfig.provider == "")
      throw new Exception("No provider url provided");
    this.providerUrl = networkConfig.provider;

    if ((networkConfig.contracts.entryPoint = ""))
      throw new Exception("No entryPoint address provided");
    this.entryPoint = networkConfig.contracts.entryPoint;

    if (factory == FactoryType.SIMPLE_ACCOUNT) {
      if ((networkConfig.contracts.walletFactory.simpleAccount = ""))
        throw new Exception("No entryPoint address provided");
      this.walletFactory = networkConfig.contracts.walletFactory.simpleAccount;
    } else {
      this.walletFactory = "";
    }

    this.paymaster = networkConfig.contracts.paymentmaster
      ? networkConfig.contracts.paymentmaster
      : "";
  }

  async provider() {
    return new ethers.JsonRpcProvider(this.providerUrl);
  }

  async bundler() {
    return new ethers.JsonRpcProvider(this.bundlerUrl);
  }

  // async getInitCode() {
  //   let initCode =
  //     this.walletFactory +
  //     AccountFactory.interface
  //       .encodeFunctionData("createAccount", [address0])
  //       .slice(2); // Deposit funds to the sender account to cover transaction fees

  //   let sender: string = "";
  //   try {
  //     await entryPoint.getSenderAddress(initCode);
  //   } catch (ex: any) {
  //     sender = "0x" + ex.data.slice(-40);
  //     console.log(sender);
  //   }

  //   // check if acount have been create
  //   const senderIsDeploy = await ethers.provider.getCode(sender);
  //   if (senderIsDeploy !== "0x") {
  //     initCode = "0x";
  //   }
  // }
}
