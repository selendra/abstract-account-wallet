// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "../account-abstraction/interfaces/UserOperation.sol";
import "../interfaces/IWhitelist.sol";

interface IBitrielPaymaster is IWhitelist {
    enum PostOpMode {
        opSucceeded,
        opReverted,
        postOpReverted
    }

    event SponsorSuccessful(address paymaster, address sender);

    function depositFunds() external payable;

    function withdrawFunds(address payable _sponsor, uint256 _amount) external;

    function getSponsorBalance(
        address _sponsor
    ) external view returns (uint256);

    function addStake(uint32 unstakeDelaySec) external payable;

    function unlockStake() external;

    function withdrawStake(address payable withdrawAddress) external;

    function getDeposit() external view returns (uint256);

    function validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) external returns (bytes memory context, uint256 validationData);

    function parsePaymasterAndData(
        bytes calldata paymasterAndData
    )
        external
        pure
        returns (
            uint48 validUntil,
            uint48 validAfter,
            bytes calldata signature
        );

    function postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) external;

    function getHash(
        UserOperation calldata userOp,
        uint48 validUntil,
        uint48 validAfter
    ) external view returns (bytes32);
}
