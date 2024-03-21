// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";

contract Account is IAccount {
    uint256 public count;
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function validateUserOp(UserOperation calldata , bytes32, uint256) 
        external
        pure
        returns (uint256 validationData)
    {
        return 0;  // without validate for testing
    }

    // Time to count up!
    function increment() external {
        count++;
    }
}
