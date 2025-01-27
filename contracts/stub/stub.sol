// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWETH {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract TestStub {
    address public owner;

    struct DepositParams {
        address wethAddress;
        uint256 amount;
    }

    struct WithdrawParams {
        address wethAddress;
    }

    function deposit(bytes calldata paramsBytes) external {
        DepositParams memory params = abi.decode(paramsBytes, (DepositParams));
        IWETH(params.wethAddress).transferFrom(msg.sender, address(this), params.amount);
    }

    function withdraw(bytes calldata paramsBytes) external {
        WithdrawParams memory params = abi.decode(paramsBytes, (WithdrawParams));
        uint256 balance = IWETH(params.wethAddress).balanceOf(address(this));
        IWETH(params.wethAddress).transfer(msg.sender, balance);
    }
}
