import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test Account Excecute", function () {
  it("should increament", async function () {
    const ACCOUNT_ADDR = "0x428588e1945452c320fcf20eb2cd5f368b41ae39"  //sender Address

    const account = await ethers.getContractAt("Account", ACCOUNT_ADDR);
    const count = await account.count()

    console.log(count)

    const accountBalance = await ethers.provider.getBalance(ACCOUNT_ADDR)

    console.log(`Sender account balance ${accountBalance}`)

    expect(count).to.equal(2);
  });
});

