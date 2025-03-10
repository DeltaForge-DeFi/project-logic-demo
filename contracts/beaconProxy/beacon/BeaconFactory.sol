// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ImmutableBeaconProxy.sol";

contract ProxyFactory {
    address public immutable beacon;
    address public immutable admin;
    mapping(address => address[]) public userProxies;

    event ProxyCreated(address indexed user, address proxy);

    constructor(address _beacon, address _admin) {
        require(_beacon != address(0), "Beacon cannot be zero address");
        require(_admin != address(0), "Admin cannot be zero address");
        beacon = _beacon;
        admin = _admin;
    }

    function createProxy() external returns (address) {
        ImmutableBeaconProxy proxy = new ImmutableBeaconProxy(beacon, msg.sender, admin);
        userProxies[msg.sender].push(address(proxy));
        emit ProxyCreated(msg.sender, address(proxy));
        return address(proxy);
    }

    function getUserProxies(address user) external view returns (address[] memory) {
        return userProxies[user];
    }
}
