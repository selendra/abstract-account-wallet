import { ethers } from "hardhat";

const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = "0x44713398737Aee72569C11597CC73F38Ed235b22";
const ENTRYPOINT_ADDRESS = "0xd37596Cf9c9880E45F8836c51E648A52aEB2cA70";

async function main() {
	const [owner] = await ethers.getSigners();
    const ownerAddress = await owner.getAddress();

	const entrypoint = await ethers.getContractAt('EntryPoint', ENTRYPOINT_ADDRESS);
    const AccountFactory = await ethers.getContractFactory("AccountFactory");
    const Account = await ethers.getContractFactory("Account");

    // for Sender account have to calculate befor send
    // CREATE: (sender + nonce)
    // CREATE2: (oxFF + sender + bytecode + salt)
    const sender = ethers.getCreateAddress({
        from: FACTORY_ADDRESS,
        nonce: FACTORY_NONCE
    });

    const nonce = await entrypoint.getNonce(sender, 0);

    // the initCode value from a UserOp. contains 20 bytes of factory address, followed by calldata  (core/SenderCreator.sol)
    const initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [ownerAddress]).slice(2);

    const callData = Account.interface.encodeFunctionData("execute")

     // Avoid revert AA21 didn't pay prefund when don`t have paymentmaster (use depositTo from core/StakeManager.sol)
    let result = await entrypoint.depositTo(sender, { 	
        value: ethers.parseEther("1"),
    });

    const userop = {
        sender, // smart account address
        nonce,
        initCode,
        callData,
        callGasLimit: 300000,
        verificationGasLimit:200000,
        preVerificationGas:50000,
        maxFeePerGas: ethers.parseUnits("10", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("5", "gwei"),
        paymasterAndData: "0x",
        signature: "0x"
    };

    // Avoid revert AA21 didn't pay prefund when don`t have paymentmaster (use depositTo from core/StakeManager.sol)
    // await entrypoint.depositTo(sender, {
    //     value: ethers.parseEther("2")
    // });


    // const tx = await entrypoint.handleOps([userop], ownerAddress)
    // const result = await tx.await()
    
    console.log(result)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});