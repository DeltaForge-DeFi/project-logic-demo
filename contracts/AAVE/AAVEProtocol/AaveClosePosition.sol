// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import { TokenUtils } from "../../common/utils/TokenUtils.sol";
import { ActionBase } from "../../permissions/action/ActionBase.sol";
import { AaveHelper } from "./helpers/AaveHelper.sol";
import { IPool } from "../AAVEInterfaces/IPool.sol";
import { ISwapRouter } from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import { IERC20Metadata } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import { AggregatorV3Interface } from "../../interfaces/AggregatorV3Interface.sol";

contract AaveClosePosition is ActionBase, AaveHelper {
    using TokenUtils for address;

    // Захардкоженные адреса
    address constant internal WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
    address constant internal DAI = 0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1;
    address constant internal UNISWAP_ROUTER = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address constant internal ETH_USD_PRICE_FEED = 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612;
    uint24 constant internal POOL_FEE = 500; // 0.05% fee tier
    uint8 constant internal HF_DECIMALS = 18;
    uint8 constant internal LT_DECIMALS = 4;
    
    // Захардкоженные параметры
    uint8 constant internal CYCLES = 7;
    uint256 constant internal RATE_MODE = 2; // Variable rate
    uint256 constant internal MIN_HEALTH_FACTOR = 1.05e18;

    function executeActionDirect(bytes memory _callData) public payable override {
        _execute();
        IERC20Metadata(WETH).transfer(msg.sender, IERC20Metadata(WETH).balanceOf(address(this)));
        IERC20Metadata(DAI).transfer(msg.sender, IERC20Metadata(DAI).balanceOf(address(this)));
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

        for (uint8 i; i < CYCLES; i++) {
            // 1. Получаем данные о позиции
            (
                uint256 totalCollateralBase, //в usd decimals - 8
                uint256 totalDebtBase, //в usd decimals - 8
                ,
                uint256 currentLiquidationThreshold, // decimals - 4
                ,
                uint256 healthFactor // decimals - 18
            ) = getLendingPool(DEFAULT_AAVE_MARKET).getUserAccountData(dsProxy);

            if (totalCollateralBase == 0) {
                return;
            }

            require(healthFactor >= MIN_HEALTH_FACTOR, "Health factor too low");

            // Если долг погашен, выводим весь оставшийся коллатерал
            if (totalDebtBase == 0) {
                if (totalCollateralBase > 0) {
                    _withdraw(
                        DEFAULT_AAVE_MARKET,
                        type(uint256).max,
                        dsProxy,
                        4, // WETH assetId
                        dsProxy
                    );
                }
                return;
            }

            // 2. Рассчитываем безопасный объем вывода
            (uint256 withdrawAmount) = calculateSafeWithdrawAmount(
                totalCollateralBase,
                totalDebtBase,
                currentLiquidationThreshold
                );

            require(withdrawAmount > 0, "Cannot safely withdraw collateral");

            // 3. Выводим WETH
            _withdraw(
                DEFAULT_AAVE_MARKET,
                withdrawAmount,
                dsProxy,
                4, // WETH assetId
                dsProxy
            );

            // 4. Свапаем WETH в DAI
            uint256 daiAmount = _swapExactInputSingle(
                withdrawAmount,
                dsProxy,
                WETH,
                DAI
            );

            // 5. Погашаем DAI
            _payback(
                DEFAULT_AAVE_MARKET,
                daiAmount,
                dsProxy,
                0, // DAI assetId
                RATE_MODE,
                dsProxy
            );
        }
    }

    function calculateBaseToToken(uint256 _amount, address _token) internal view returns (uint256) {
        (, int256 ethPrice, , ,) = AggregatorV3Interface(ETH_USD_PRICE_FEED).latestRoundData();
        require(ethPrice > 0, "Invalid ETH price");

        uint256 tokenDecimals = uint256(IERC20Metadata(_token).decimals());
        uint256 ethPriceUint = uint256(ethPrice);
        
        uint256 amountInTokenDecimals = _amount * (10**tokenDecimals);
        
        return amountInTokenDecimals / ethPriceUint ;
    }

    function calculateSafeWithdrawAmount(
        uint256 totalCollateral,
        uint256 totalDebt,
        uint256 liquidationThreshold
    ) public view returns (uint256 withdrawAmount) {

        (, int256 ethPrice, , ,) = AggregatorV3Interface(ETH_USD_PRICE_FEED).latestRoundData();
        require(ethPrice > 0, "Invalid ETH price");

        uint256 maxToWithdrawUsd = totalCollateral - (MIN_HEALTH_FACTOR * totalDebt * 10 ** LT_DECIMALS) / liquidationThreshold / 10 ** HF_DECIMALS;
        uint256 maxToWithdraw = calculateBaseToToken(maxToWithdrawUsd, WETH);
        withdrawAmount = maxToWithdraw;
    }

    function _swapExactInputSingle(
        uint256 amountIn,
        address recipient,
        address tokenIn,
        address tokenOut
    ) internal returns (uint256 amountOut) {
        IERC20Metadata(tokenIn).approve(UNISWAP_ROUTER, amountIn);

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