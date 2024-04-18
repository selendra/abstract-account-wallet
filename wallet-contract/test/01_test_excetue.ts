import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test Account Excecute", function () {
  it("should increament", async function () {
    const ACCOUNT_ADDR = "0x297d33bcc3d5a5f8e978eb53fec4d316f51149b7"  //sender Address

    const account = await ethers.getContractAt("Account", ACCOUNT_ADDR);
    const count = await account.count()

    console.log(count)

    // const accountBalance = await ethers.provider.getBalance(ACCOUNT_ADDR)

    // console.log(`Sender account balance ${accountBalance}`)

    // expect(count).to.equal(2);
  });
});

