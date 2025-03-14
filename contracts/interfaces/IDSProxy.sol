// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDSProxy {
    function execute(address _target, bytes memory _data) external payable returns (bytes32);
}
