// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./Account.sol";

contract AccountFactory {
    function createAccount(address owner) external returns(address){
        Account acc = new Account(owner);
        return address(acc);
    }
}