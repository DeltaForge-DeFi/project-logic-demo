// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IBeacon.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Beacon is IBeacon, Ownable {
    address private immutable implementationAddress;

    constructor(address _implementation) {
        require(_implementation != address(0), "Implementation cannot be zero address");
        implementationAddress = _implementation;
    }

    function implementation() external view override returns (address) {
        return implementationAddress;
    }
}
