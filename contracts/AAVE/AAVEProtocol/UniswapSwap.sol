// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import { TokenUtils } from "../../common/utils/TokenUtils.sol";
import { ActionBase } from "../../permissions/action/ActionBase.sol";
import { ISwapRouter } from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import { TransferHelper } from "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import { AaveHelper } from "./helpers/AaveHelper.sol";//

contract UniswapSwap is ActionBase, AaveHelper {
    using TokenUtils for address;
    
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

    function executeActionDirect(bytes memory _callData) public payable override {
        Params memory params = parseInputs(_callData);
        _executeSwap(params);
    }

    function _executeSwap(Params memory params) internal {
        // Если нужно получить токены от пользователя
        if (params.pullTokens) {
            params.tokenIn.pullTokensIfNeeded(msg.sender, params.amountIn);
        }

        ISwapRouter swapRouter = ISwapRouter(SWAP_ROUTER);

        // Апрув токенов для роутера
        params.tokenIn.approveToken(address(swapRouter), params.amountIn);

        ISwapRouter.ExactInputSingleParams memory swapParams = 
            ISwapRouter.ExactInputSingleParams({
                tokenIn: params.tokenIn,
                tokenOut: params.tokenOut,
                fee: params.fee,
                recipient: params.recipient,
                deadline: block.timestamp + 300,
                amountIn: params.amountIn,
                amountOutMinimum: params.amountOutMinimum,
                sqrtPriceLimitX96: params.sqrtPriceLimitX96
            });

        // Выполняем своп
        uint256 amountOut = swapRouter.exactInputSingle(swapParams);
        
        emit ActionEvent(
            "UniswapSwap",
            abi.encode(
                params.tokenIn,
                params.tokenOut,
                params.amountIn,
                amountOut
            )
        );
    }

    function parseInputs(bytes memory _callData) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }

    function actionType() public pure override returns (uint8) {
        return 1;
    }

    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable override returns (bytes32) {
        Params memory params = parseInputs(_callData);
        _executeSwap(params);
        return bytes32(0);
    }
}