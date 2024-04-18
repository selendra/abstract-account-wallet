import { ethers } from "ethers";
import AccountContract from "../../../../wallet-contract/artifacts/contracts/LightAccount.sol/LightAccount.json";
import AccountFactoryContract from "../../../../wallet-contract/artifacts/contracts/LightAccountFactory.sol/LightAccountFactory.json";
import PaymasterContract from "../../../../wallet-contract/artifacts/contracts/payments/Paymaster.sol/Paymaster.json";
import EntryPointContract from "@account-abstraction/contracts/artifacts/EntryPoint.json";

export const Contracts = {
    Account: AccountContract,
    AccountFactory: AccountFactoryContract,
    Paymaster: PaymasterContract,
    EntryPoint: EntryPointContract
}

export const getEntryPoint = (entryPoint: string, signer: any) => {
    return new ethers.Contract(
        entryPoint,
        Contracts.EntryPoint.abi,
        signer,
    ) as any
};