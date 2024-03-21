import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test Account Excecute", function () {
  it("should increament", async function () {
    const ACCOUNT_ADDR = "0xED361CbFFfb16e113bE1F62a563a33208ef06CF7"  //sender Address
    const EP_ADDRESS = "0x553F411e4920B8BB03C473B61124a76f9Fe157cb";
    const PM_ADRRES = "0xd2ce5cfBa6c1f039f2AcbD87260d22A23a8790E6";

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

    // expect(count).to.equal(1);
  });
});