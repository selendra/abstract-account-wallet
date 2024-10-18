# abstract-account-wallet

- Deploy **entrypoint** , **LightAccount** and **SimplePaymantMaster** *(PaymantMaster contract for testing only)*
  ```sh
  npx hardhat run scripts/01.deploy.ts
  ```
- Deposit balance to PaymentMaster contract for cover transaction fees

  ```sh
  npx hardhat run scripts/02.deposit.ts
  ```

- Excute sample transaction from aa-account

  ```sh
  npx hardhat run scripts/03.excecute.ts
  ```

  > **note**: aa-account balance is 0 transfer first for testing

## Sample Knowlegde

- User operation data

  ```sh
    sender: string;  // aa-account, create from signer-account combine with salt
    nonce: string; // execute contract nonce or index
    initCode: string; // the initCode by combining the factory address with encoded createAccount function, if exit aa-account allready create is must be "0x"
    callData: string; // encode contract call function
    callGasLimit: string;
    verificationGasLimit: string;
    preVerificationGas: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    paymasterAndData: string; // paymaster contract data and address, can be any address that want to pay for you
    signature: string; // call operation signature that sign with signer-account
  ```

- random salt 

  ```sh
    import { randomBytes } from "crypto";

    const salt = "0x" + randomBytes(32).toString("hex");
  ```

- int-code

  ```sh
    import { ethers } from "ethers";
    import AccountFactory from "../artifacts/contracts/LightAccountFactory.sol/LightAccountFactory.json";

    const entrypoint = ethers.Contract(
        entryPoint,
        Contracts.EntryPoint.abi,
        signer,
    ) as any


    let initCode =
        FACTORY_ADDRESS +
        AccountFactory.interface
        .encodeFunctionData("createAccount", [signer.address, salt])
        .slice(2);

    let sender: string = "";
    try {
        await entryPoint.getSenderAddress(initCode);
    } catch (ex: any) {
        sender = "0x" + ex.data.slice(-40);
        console.log(sender);
    }

    // check if acount have been create
    const senderIsDeploy = await ethers.provider.getCode(sender);
    if (senderIsDeploy !== "0x") {
        initCode = "0x";
    }

  ```

- Call Data: encode call data function 'execute' for LightAccount
    ```sh
      import Account from "../artifacts/contracts/LightAccount.sol/LightAccount.json";

      const encodeData = (target: string, value: BigNumberish, data: string) => {
        return Account.interface.encodeFunctionData('execute', [target, value, data])
      }
    ```
  - target: account address or contract address
  - value: amount of value to transfer, 0 if you want to excute function not transfer balance
  - data: '0x' for transfer balance, or encode other contract function to execute
    ```sh
       async function encodeAnyContractFuntion(contractAbi: any): Promise<string> {
          const Data = contractAbi.interface.encodeFunctionData('function', [value])
          return Data
        }
    ```
- EstimateUserOperationGas: Execute the user operation via the EntryPoint contract, passing the userOp and the fee receiver address
    > **signature**: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c"
    ```sh
      const nonce = "0x" + (await entryPoint.getNonce(sender, 0)).toString(16);
      const bundlerProvider = new ether.JsonRpcProvider("http://127.0.0.1:3000");
      
      const userOp: any = {
          sender,
          nonce,
          initCode,
          callData,
          paymasterAndData: PM_ADRRES,
          signature,
        };

      const { preVerificationGas, verificationGasLimit, callGasLimit } =
      await bundlerProvider.send("eth_estimateUserOperationGas", [
        userOp,
        ENTRYPIONT_ADDRESS,
      ]);
    ```

    > **note**: Bundler Provider and Chain Provider are different

- Sign Signature for execute: Copying and reusing a signature for a different message will not work
  ```sh
    const { maxFeePerGas, maxPriorityFeePerGas } = await ethers.provider.getFeeData();

    userOp.callGasLimit = callGasLimit;
    userOp.verificationGasLimit = verificationGasLimit;
    userOp.preVerificationGas = preVerificationGas;
    userOp.maxFeePerGas = "0x" + maxFeePerGas?.toString(16);
    userOp.maxPriorityFeePerGas = "0x" + maxPriorityFeePerGas?.toString(16);

    const userOpHash = await entryPoint.getUserOpHash(userOp);
    userOp.signature = (await (signer0.signMessage(ethers.getBytes(userOpHash)))).toString();
  ```

- sendUserOperation to Bundler:
  ```sh
    const opHash = await bundlerProvider.send("eth_sendUserOperation", [
        userOp,
        ENTRYPIONT_ADDRESS,
      ]);

      setTimeout(async () => {
      const { transactionHash } = await bundlerProvider.send(
        "eth_getUserOperationByHash",
        [opHash]
      );

      console.log(transactionHash);
    }, 8000);
  ```
