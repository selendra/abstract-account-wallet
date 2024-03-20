import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test Account Excecute", function () {
  it("should increament", async function () {
    const ACCOUNT_ADDR = "0x9158230b4eA5EC3CffB5fAc9f292E80e62d112dC"  //sender Address
    const account = await ethers.getContractAt("Account", ACCOUNT_ADDR)
    const count = await account.count()

    expect(count).to.equal(1);
  });
});