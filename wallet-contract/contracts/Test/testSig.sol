// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract TestSig  {
    constructor(bytes memory sig){
        address recover = ECDSA.recover(ECDSA.toEthSignedMessageHash(keccak256("validate")), sig);
        console.log(recover);
    }
}