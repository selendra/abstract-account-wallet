import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test Account Excecute", function () {
  it("should increament", async function () {
    const ACCOUNT_ADDR = "0xb92462fbf78e9691463660f210849f6f25b90e85"  //sender Address

    const account = await ethers.getContractAt("Account", ACCOUNT_ADDR);
    const count = await account.count()

    console.log(count)

    // const accountBalance = await ethers.provider.getBalance(ACCOUNT_ADDR)

    // console.log(`Sender account balance ${accountBalance}`)

    // expect(count).to.equal(2);
  });
});

