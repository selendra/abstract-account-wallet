import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test Account Excecute", function () {
  it("should increament", async function () {
    const ACCOUNT_ADDR = "0x297d33bcc3d5a5f8e978eb53fec4d316f51149b7"  //sender Address
    const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    const PM_ADRRES = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

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

    expect(count).to.equal(2);
  });
});

