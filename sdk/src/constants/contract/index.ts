import { ethers } from "ethers";
import { Contracts } from "./constant";

export * from "./constant";

export const Account = new ethers.ContractFactory(Contracts.Account.abi, Contracts.Account.bytecode);
export const AccountFactory = new ethers.ContractFactory(Contracts.AccountFactory.abi, Contracts.AccountFactory.bytecode);
