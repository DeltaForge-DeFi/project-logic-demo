// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { MockERC20 } from "./MockERC20.sol";

contract MockUniswapSwap {
    event Swapped(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    struct Params {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
        bool pullTokens;
    }

    function executeActionDirect(bytes memory _callData) external {
        Params memory params = abi.decode(_callData, (Params));

        IERC20(params.tokenIn).transferFrom(msg.sender, address(this), params.amountIn);
        uint256 amountOut = (params.amountIn * 2000) / 1e12;
        
        MockERC20(params.tokenOut).mint(params.recipient, amountOut);

        emit Swapped(params.tokenIn, params.tokenOut, params.amountIn, amountOut);
    }

    // Вспомогательная функция для установки баланса USDC в тестах
    function setBalance(address token, uint256 amount) external {
        // Предполагаем, что токен - это MockERC20 с функцией mint
        IERC20(token).transfer(address(this), amount);
    }
}
