// SPDX-License-Identifier: MIT
//Зависимости корректны

pragma solidity ^0.8.15;

interface IDSProxyFactory {
    function isProxy(address _proxy) external view returns (bool);
}
