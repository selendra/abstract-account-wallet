// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./Account.sol";

contract AccountFactory {
    // A function to create a new Account contract instance with an assigned owner
    function createAccount(address owner) external returns (address) {
        Account acc = new Account(owner);
        return address(acc); // Returns the address of the newly created Account contract
    }
}