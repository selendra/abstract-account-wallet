// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./Account.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract AccountFactory {
    // A function to create a new Account contract instance with an assigned owner
    function createAccount(address owner) external returns (address) {
        // Account acc = new Account(owner);
        // return address(acc); // Returns the address of the newly created Account contract
        bytes32 salt = bytes32(uint256(uint160(owner)));
        bytes memory creationCode = type(Account).creationCode;
        bytes memory bytecode = abi.encodePacked(creationCode, abi.encode(owner));

        address addr = Create2.computeAddress(salt, keccak256(bytecode));
        uint256 codeSize = addr.code.length;
        if (codeSize > 0) {
            return addr;
        }

        return Create2.deploy(0, salt, bytecode);
    }
}