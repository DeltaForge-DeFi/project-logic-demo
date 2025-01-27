// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import { IL2Pool } from "../AAVEInterfaces/IL2Pool.sol";
import { AaveHelper } from "./helpers/AaveHelper.sol";
import { IERC20 } from"../../common/interfaces/IERC20.sol";//

contract AaveWithdrawMini is AaveHelper {

    /// @notice Withdraws specified amount of tokens from Aave
    /// @param _market The Aave market address
    /// @param _token The token to withdraw (e.g., DAI)
    /// @param _amount The amount of token to withdraw
    /// @param _recipient The recipient address of withdrawn tokens
    function withdraw(address _market, address _token, uint256 _amount, address _recipient) external {
        IL2Pool lendingPool = getLendingPool(_market);
        require(lendingPool != IL2Pool(address(0)), "Invalid market");

        // Perform the withdrawal from Aave
        lendingPool.withdraw(_token, _amount, _recipient);
    }
}
