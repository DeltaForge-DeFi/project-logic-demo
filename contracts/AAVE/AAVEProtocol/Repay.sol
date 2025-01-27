// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import { IERC20 } from"../../common/interfaces/IERC20.sol";//
import { IL2Pool } from "../AAVEInterfaces/IL2Pool.sol";
import { AaveHelper } from "./helpers/AaveHelper.sol";

contract AaveRepayMini is AaveHelper {

    /// @notice Repays the specified amount of debt to Aave
    /// @param _market The Aave market address
    /// @param _token The token to repay (e.g., DAI)
    /// @param _amount The amount of token to repay
    /// @param _debtOwner The owner of the debt
    function repay(address _market, address _token, uint256 _amount, address _debtOwner) external {
        IL2Pool lendingPool = getLendingPool(_market);
        require(lendingPool != IL2Pool(address(0)), "Invalid market");

        // Approve the lending pool to spend the specified amount of tokens
        IERC20(_token).approve(address(lendingPool), _amount);

        // Perform the repayment
        lendingPool.repay(_token, _amount, 2, _debtOwner);  // Repay with variable interest (use 1 for stable)
    }
}
