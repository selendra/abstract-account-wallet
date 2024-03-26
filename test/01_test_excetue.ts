import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test Account Excecute", function () {
  it("should increament", async function () {
    const ACCOUNT_ADDR = "0x892fbc8659c71b2D380E75DA1B5eDeCf60f90b33"  //sender Address
    const EP_ADDRESS = "0xD23CdCc1f73bF885120aD958854aBD731775503e";
    const PM_ADRRES = "0xAD4fBD60304b8cfC47F1dc1f045c08Dd1598d63B";

    const account = await ethers.getContractAt("Account", ACCOUNT_ADDR)
    const entryPoint = await ethers.getContractAt("EntryPoint", EP_ADDRESS);
    const count = await account.count()

    console.log(count)

    const accountBalance = await ethers.provider.getBalance(ACCOUNT_ADDR)
    const entryPointBalance = await entryPoint.balanceOf(ACCOUNT_ADDR)
    const paymentBalance = await entryPoint.balanceOf(PM_ADRRES)

    console.log(`Sender account balance ${accountBalance}`)
    console.log(`Balance on entryPoint address ${entryPointBalance}`)
    console.log(`Balance on paymaster address ${paymentBalance}`)

    expect(count).to.equal(1);
  });
});

