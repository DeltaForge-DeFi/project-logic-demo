// SPDX-License-Identifier: MIT
//зависимости корректны
pragma solidity ^0.8.15;

import { SafeERC20 } from "../../common/utils/SafeERC20.sol";//
import { IERC20 } from "../../common/interfaces/IERC20.sol";//
import { AdminData } from "./AdminData.sol";//
import { AuthHelper } from "./helpers/AuthHelper.sol";//

/// @title AdminAuth Handles owner/admin privileges over smart contracts
contract AdminAuth is AuthHelper {
    using SafeERC20 for IERC20;

    AdminData public constant adminData = AdminData(ADMIN_DATA_ADDR);

    error SenderNotOwner();
    error SenderNotAdmin();

    modifier onlyOwner() {
        if (adminData.owner() != msg.sender){
            revert SenderNotOwner();
        }
        _;
    }

    modifier onlyAdmin() {
        if (adminData.admin() != msg.sender){
            revert SenderNotAdmin();
        }
        _;
    }

    /// @notice withdraw stuck funds
    function withdrawStuckFunds(address _token, address _receiver, uint256 _amount) public onlyOwner {
        if (_token == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
            payable(_receiver).transfer(_amount);
        } else {
            IERC20(_token).safeTransfer(_receiver, _amount);
        }
    }

    /// @notice Destroy the contract
    /// @dev Deprecated method, selfdestruct will soon just send eth
    function kill() public onlyAdmin {
        selfdestruct(payable(msg.sender));
    }
}
