// SPDX-License-Identifier: MIT
//Зависимости корректны

pragma solidity ^0.8.15;

import { IDSProxyFactory } from "../../DSProxy/interfaces/IDSProxyFactory.sol";//
import { DSProxyFactoryHelper } from "../../DSProxy/utils/DSProxyFactoryHelper.sol";//

/// @title CheckWalletType - Helper contract to check if address represents DSProxy wallet or not
contract CheckWalletType is DSProxyFactoryHelper {
    function isDSProxy(address _proxy) public view returns (bool) {
        return IDSProxyFactory(PROXY_FACTORY_ADDR).isProxy(_proxy);
    }
}