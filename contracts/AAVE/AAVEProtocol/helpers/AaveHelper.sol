// SPDX-License-Identifier: MIT
//Зависимости корректны

pragma solidity ^0.8.15;

import { IL2Pool } from "../../AAVEInterfaces/IL2Pool.sol";//
import { IAaveProtocolDataProvider } from "../../AAVEInterfaces/IAaveProtocolDataProvider.sol";//
import { IPoolAddressesProvider } from "../../AAVEInterfaces/IPoolAddressesProvider.sol";//
import { ArbitrumAaveAddresses } from "./ArbitrumAaveAddresses.sol";//

/// @title Utility functions and data used in Aave actions
contract AaveHelper is ArbitrumAaveAddresses {
    
    uint16 public constant AAVE_REFERRAL_CODE = 64;

    /// @notice Returns the lending pool contract of the specified market
    function getLendingPool(address _market) internal virtual view returns (IL2Pool) {
        return IL2Pool(IPoolAddressesProvider(_market).getPool());
    }

    /// @notice Fetch the data provider for the specified market
    function getDataProvider(address _market) internal virtual view returns (IAaveProtocolDataProvider) {
        return
            IAaveProtocolDataProvider(
                IPoolAddressesProvider(_market).getPoolDataProvider()
            );
    }

    function boolToBytes(bool x) internal virtual pure returns (bytes1 r) {
       return x ? bytes1(0x01) : bytes1(0x00);
    }

    function bytesToBool(bytes1 x) internal virtual pure returns (bool r) {
        return x != bytes1(0x00);
    }
    
    function getWholeDebt(address _market, address _tokenAddr, uint _borrowType, address _debtOwner) internal virtual view returns (uint256 debt) {
        uint256 STABLE_ID = 1;
        uint256 VARIABLE_ID = 2;

        IAaveProtocolDataProvider dataProvider = getDataProvider(_market);
        (, uint256 borrowsStable, uint256 borrowsVariable, , , , , , ) =
            dataProvider.getUserReserveData(_tokenAddr, _debtOwner);

        if (_borrowType == STABLE_ID) {
            debt = borrowsStable;
        } else if (_borrowType == VARIABLE_ID) {
            debt = borrowsVariable;
        }
    }
}