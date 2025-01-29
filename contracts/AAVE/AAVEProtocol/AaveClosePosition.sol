// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import { TokenUtils } from "../../common/utils/TokenUtils.sol";
import { ActionBase } from "../../permissions/action/ActionBase.sol";
import { AaveHelper } from "./helpers/AaveHelper.sol";
import { IPool } from "../AAVEInterfaces/IPool.sol";
import { ISwapRouter } from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { AggregatorV3Interface } from "../../interfaces/AggregatorV3Interface.sol";

contract AaveClosePosition is ActionBase, AaveHelper {
    using TokenUtils for address;

    // Захардкоженные адреса
    address constant internal WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
    address constant internal DAI = 0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1;
    address constant internal UNISWAP_ROUTER = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address constant internal ETH_USD_PRICE_FEED = 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612;
    uint24 constant internal POOL_FEE = 500; // 0.05% fee tier

    // Захардкоженные параметры
    uint8 constant internal CYCLES = 3;
    uint256 constant internal RATE_MODE = 2; // Variable rate
    uint256 constant internal MIN_HEALTH_FACTOR = 1.05e18;

    function executeActionDirect(bytes memory _callData) public payable override {
        _execute();
    }

    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subdata,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        _execute();
        return bytes32(0);
    }

    function _execute() internal {
        // DSProxy адрес - это address(this), так как выполняется delegatecall
        address dsProxy = address(this);
        // Адрес пользователя - это msg.sender
        address user = msg.sender;

        for (uint8 i = 0; i < CYCLES; i++) {
            // 1. Получаем данные о позиции
            (
                uint256 totalCollateralBase,
                uint256 totalDebtBase,
                ,
                uint256 currentLiquidationThreshold,
                ,
                uint256 healthFactor
            ) = getLendingPool(DEFAULT_AAVE_MARKET).getUserAccountData(dsProxy);

            // Если долг погашен, выводим весь оставшийся коллатерал
            if (totalDebtBase == 0) {
                if (totalCollateralBase > 0) {
                    _withdraw(
                        DEFAULT_AAVE_MARKET,
                        type(uint256).max,
                        user,
                        4, // WETH assetId
                        dsProxy
                    );
                }
                return;
            }

            require(healthFactor >= MIN_HEALTH_FACTOR, "Health factor too low");

            // 2. Рассчитываем безопасный объем вывода
            (uint256 withdrawAmount, uint256 swapAmount) = calculateSafeWithdrawAmount(
                totalCollateralBase,
                totalDebtBase,
                currentLiquidationThreshold
            );

            require(withdrawAmount > 0, "Cannot safely withdraw collateral");

            // 3. Выводим WETH
            _withdraw(
                DEFAULT_AAVE_MARKET,
                withdrawAmount,
                user,
                4, // WETH assetId
                dsProxy
            );

            // 4. Свапаем WETH в DAI
            uint256 daiAmount = _swapExactInputSingle(
                swapAmount,
                user,
                WETH,
                DAI
            );

            // 5. Погашаем DAI
            _payback(
                DEFAULT_AAVE_MARKET,
                daiAmount,
                user,
                0, // DAI assetId
                RATE_MODE,
                dsProxy
            );
        }

        // Проверяем, остался ли коллатерал после всех циклов
        (uint256 finalCollateral, uint256 finalDebt, , , , ) = 
            getLendingPool(DEFAULT_AAVE_MARKET).getUserAccountData(user);

        if (finalDebt == 0 && finalCollateral > 0) {
            _withdraw(
                DEFAULT_AAVE_MARKET,
                type(uint256).max, // Выводим максимальное количество
                user,
                4, // WETH assetId
                dsProxy
            );
        }
    }

    function calculateSafeWithdrawAmount(
        uint256 totalCollateral,
        uint256 totalDebt,
        uint256 liquidationThreshold
    ) internal view returns (uint256 withdrawAmount, uint256 swapAmount) {
        // Получаем цену ETH
        (, int256 ethPrice, , ,) = AggregatorV3Interface(ETH_USD_PRICE_FEED).latestRoundData();
        require(ethPrice > 0, "Invalid ETH price");

        // Рассчитываем максимально возможный вывод в USD
        uint256 requiredCollateralUsd = (totalDebt * MIN_HEALTH_FACTOR * 100) / liquidationThreshold;
        uint256 maxWithdrawUsd = totalCollateral > requiredCollateralUsd ? 
            totalCollateral - requiredCollateralUsd : 0;

        // Определяем сколько нужно свапнуть в USD
        uint256 swapAmountUsd = maxWithdrawUsd < totalDebt ? maxWithdrawUsd : totalDebt;

        // Конвертируем суммы в ETH
        withdrawAmount = (maxWithdrawUsd * 1e18) / uint256(ethPrice);
        swapAmount = (swapAmountUsd * 1e18) / uint256(ethPrice);
    }

    function _swapExactInputSingle(
        uint256 amountIn,
        address recipient,
        address tokenIn,
        address tokenOut
    ) internal returns (uint256 amountOut) {
        IERC20(tokenIn).approve(UNISWAP_ROUTER, amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: POOL_FEE,
                recipient: recipient,
                deadline: block.timestamp + 300,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = ISwapRouter(UNISWAP_ROUTER).exactInputSingle(params);
    }

    function actionType() public pure override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    function _withdraw(
        address _market,
        uint256 _amount,
        address _to,
        uint16 _assetId,
        address _onBehalf
    ) internal returns (uint256, bytes memory) {
        IPool lendingPool = getLendingPool(_market);
        address tokenAddr = lendingPool.getReserveAddressById(_assetId);

        if (_amount == type(uint256).max) {
            _amount = tokenAddr.getBalance(_onBehalf);
        }

        lendingPool.withdraw(tokenAddr, _amount, _to);

        bytes memory logData = abi.encode(_market, tokenAddr, _amount, _to);
        return (_amount, logData);
    }

    function _payback(
        address _market,
        uint256 _amount,
        address _from,
        uint16 _assetId,
        uint256 _rateMode,
        address _onBehalf
    ) internal returns (uint256, bytes memory) {
        IPool lendingPool = getLendingPool(_market);
        address tokenAddr = lendingPool.getReserveAddressById(_assetId);

        tokenAddr.pullTokensIfNeeded(_from, _amount);
        tokenAddr.approveToken(address(lendingPool), _amount);

        lendingPool.repay(tokenAddr, _amount, _rateMode, _onBehalf);

        bytes memory logData = abi.encode(_market, tokenAddr, _amount, _rateMode, _onBehalf);
        return (_amount, logData);
    }
} 