import { ethers } from "ethers";
import AccountContract from "../../../../wallet-contract/artifacts/contracts/Account.sol/Account.json";
import AccountFactoryContract from "../../../../wallet-contract/artifacts/contracts/AccountFactory.sol/AccountFactory.json";
import PaymasterContract from "../../../../wallet-contract/artifacts/contracts/Paymaster.sol/Paymaster.json";
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