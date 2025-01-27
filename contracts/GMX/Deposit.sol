// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
}

contract Deposit {
    address public depositVault;
    IERC20 public token;

    event DepositMade(address indexed user, uint256 amount);

    constructor(address _tokenAddress, address _depositVault) {
        token = IERC20(_tokenAddress);
        depositVault = _depositVault;
    }

    function makeDeposit(uint256 amount) external {
        require(token.balanceOf(msg.sender) >= amount, "Insufficient token balance");
        require(token.allowance(msg.sender, address(this)) >= amount, "Allowance not set");

        require(token.transferFrom(msg.sender, depositVault, amount), "Token transfer failed");

        emit DepositMade(msg.sender, amount);
    }
}