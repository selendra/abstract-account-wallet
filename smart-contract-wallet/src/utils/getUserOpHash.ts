// Import necessary modules from ethers and userop
import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import { Constants, IUserOperation } from "userop";
import { TESTNET_ID } from "./constants";

// Define an asynchronous function to get the user operation hash
export default async function getUserOpHash(userOp: IUserOperation) {
  // Encode all the userOp parameters except for the signatures
  const encodedUserOp = defaultAbiCoder.encode(
    [
      "address",
      "uint256",
      "bytes32",
      "bytes32",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "bytes32",
    ],
    [
      userOp.sender,
      userOp.nonce,
      keccak256(userOp.initCode),
      keccak256(userOp.callData),
      userOp.callGasLimit,
      userOp.verificationGasLimit,
      userOp.preVerificationGas,
      userOp.maxFeePerGas,
      userOp.maxPriorityFeePerGas,
      keccak256(userOp.paymasterAndData),
    ]
  );

  // Encode the keccak256 hash with the address of the entry point contract and chainID
  const encodedUserOpWithChainIdAndEntryPoint = defaultAbiCoder.encode(
    ["bytes32", "address", "uint256"],
    [keccak256(encodedUserOp), Constants.ERC4337.EntryPoint, TESTNET_ID]
  );

  // Return the keccak256 hash of the whole thing encoded
  return keccak256(encodedUserOpWithChainIdAndEntryPoint);
}
