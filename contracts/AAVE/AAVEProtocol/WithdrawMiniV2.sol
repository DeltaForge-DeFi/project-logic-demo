// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import { IL2Pool } from "../AAVEInterfaces/IL2Pool.sol";
import { IAaveProtocolDataProvider } from "../AAVEInterfaces/IAaveProtocolDataProvider.sol";
import { IPoolAddressesProvider } from "../AAVEInterfaces/IPoolAddressesProvider.sol";
import { AaveHelper } from "./helpers/AaveHelper.sol";
import { IERC20 } from "../../common/interfaces/IERC20.sol";

/// @title Enhanced Aave Universal Withdraw Contract
/// @notice Contract for withdrawing ERC20 tokens and managing interactions with Aave
contract WithdrawMiniV2 is AaveHelper {
    address public owner;

    event Withdraw(address indexed token, address indexed to, uint256 amount);
    event RepayDebt(address indexed token, uint256 amount, uint256 interestRateMode);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Withdraws any ERC20 token from the Aave pool
    /// @param _market Address of the Aave market
    /// @param _token Address of the ERC20 token to withdraw
    /// @param _amount Amount to withdraw
    /// @param _to Address to receive the withdrawn tokens
    function withdrawERC20(
        address _market,
        address _token,
        uint256 _amount,
        address _to
    ) external onlyOwner {
        // Get the Aave pool
        IL2Pool pool = getLendingPool(_market);

        // Call Aave's withdraw method
        uint256 withdrawnAmount = pool.withdraw(_token, _amount, _to);

        emit Withdraw(_token, _to, withdrawnAmount);
    }

    /// @notice Repays debt for a specific token
    /// @param _market Address of the Aave market
    /// @param _token Address of the token to repay
    /// @param _amount Amount to repay
    /// @param _interestRateMode Interest rate mode (1 for stable, 2 for variable)
    function repayDebt(
        address _market,
        address _token,
        uint256 _amount,
        uint256 _interestRateMode
    ) external onlyOwner {
        // Get the Aave pool
        IL2Pool pool = getLendingPool(_market);

        // Approve the pool to use the token
        IERC20(_token).approve(address(pool), _amount);

        // Repay the debt
        uint256 repaidAmount = pool.repay(_token, _amount, _interestRateMode, address(this));

        emit RepayDebt(_token, repaidAmount, _interestRateMode);
    }

    /// @notice Fetches the total debt for a user in a specific token
    /// @param _market Address of the Aave market
    /// @param _token Address of the token
    /// @param _user Address of the user
    /// @return stableDebt Amount of stable debt
    /// @return variableDebt Amount of variable debt
    function getUserDebt(
        address _market,
        address _token,
        address _user
    ) external view returns (uint256 stableDebt, uint256 variableDebt) {
        IAaveProtocolDataProvider dataProvider = getDataProvider(_market);
        (, stableDebt, variableDebt, , , , , , ) = dataProvider.getUserReserveData(_token, _user);
    }

    /// @notice Recover ERC20 tokens accidentally sent to this contract
    /// @param _token Address of the ERC20 token
    /// @param _amount Amount of tokens to recover
    function recoverERC20(address _token, uint256 _amount) external onlyOwner {
        require(IERC20(_token).transfer(owner, _amount), "Transfer failed");
    }
}
