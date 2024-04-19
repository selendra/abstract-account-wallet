import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test Account Excecute", function () {
  it("should increament", async function () {
    const ACCOUNT_ADDR = "0xc09d08a44a18149e93cb7863a3899f9907661951"  //sender Address

    const account = await ethers.getContractAt("LightAccount", ACCOUNT_ADDR);
    const count = await account.count()

    console.log(count)

    // const accountBalance = await ethers.provider.getBalance(ACCOUNT_ADDR)

    // console.log(`Sender account balance ${accountBalance}`)

    // expect(count).to.equal(2);
  });
});

