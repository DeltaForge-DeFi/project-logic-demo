// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import { TokenUtils } from "../../common/utils/TokenUtils.sol";
import { ActionBase } from "../../permissions/action/ActionBase.sol";
import { AaveHelper } from "./helpers/AaveHelper.sol";
import { IPool } from "../AAVEInterfaces/IPool.sol";
import { ISwapRouter } from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { AggregatorV3Interface } from "../../interfaces/AggregatorV3Interface.sol";

contract AaveOpenPosition is ActionBase, AaveHelper {
    using TokenUtils for address;

    // Захардкоженные адреса токенов и контрактов
    address constant internal WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
    address constant internal DAI = 0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1;
    address constant internal USDC = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;
    address constant internal UNISWAP_ROUTER = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address constant internal ETH_USD_PRICE_FEED = 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612;
    uint24 constant internal POOL_FEE = 500; // 0.05% fee tier

    struct OpenPositionParams {
        uint256 initialSupplyAmount;  // Сумма начального депозита в USDC
        uint256 borrowPercent;        // Процент от депозита для займа (например, 50 = 50%)
        uint8 cycles;                 // Количество циклов
    }

    function getEthPrice() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(ETH_USD_PRICE_FEED);
        (
            /* uint80 roundID */,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        
        require(price > 0, "Invalid ETH price");
        return uint256(price);
    }

    function calculateBorrowAmount(uint256 ethAmount) internal view returns (uint256) {
        // Получаем цену ETH в USD (с 8 десятичными знаками)
        uint256 ethPrice = getEthPrice();
        
        // Конвертируем ethAmount в USD
        // ethAmount (18 decimals) * ethPrice (8 decimals) = usdValue (26 decimals)
        uint256 usdValue = (ethAmount * ethPrice) / 1e8;
        
        return usdValue;
    }

    function executeActionDirect(bytes memory _callData) public payable override {
        OpenPositionParams memory params = abi.decode(_callData, (OpenPositionParams));
        _execute(params);
    }
    

    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subdata,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        OpenPositionParams memory params = abi.decode(_callData, (OpenPositionParams));
        _execute(params);
        return bytes32(0);
    }

    function _execute(OpenPositionParams memory params) internal {
        require(params.borrowPercent <= 100, "Borrow percent must be <= 100");
        require(params.cycles > 0, "Cycles must be > 0");
        require(params.initialSupplyAmount > 0, "Supply amount must be > 0");

        // DSProxy адрес - это address(this), так как выполняется delegatecall
        address dsProxy = address(this);
        // Адрес пользователя - это msg.sender
        address user = msg.sender;

       IERC20(USDC).transferFrom(user, address(this), params.initialSupplyAmount);

       uint256 amountOutForFirstSupply = _swapExactInputSingle(IERC20(USDC).balanceOf(address(this)), USDC, WETH);

        // Начальный депозит WETH
        _supply(
            DEFAULT_AAVE_MARKET,
            amountOutForFirstSupply,
            dsProxy,           // от кого токены
            4,             // WETH assetId
            dsProxy        // на чье имя депозит
        );

        // Рассчитываем сумму займа в USD на основе стоимости WETH
        uint256 borrowAmount = (params.initialSupplyAmount * params.borrowPercent) / 100;

        // Выполняем циклы borrow-swap-supply
        for (uint8 i = 0; i < params.cycles; i++) {
            // 1. Borrow DAI (1 DAI = 1 USD)
            _borrow(
                DEFAULT_AAVE_MARKET,
                0, // DAI assetId
                borrowAmount,
                2, // Variable rate
                dsProxy,
                dsProxy
            );

            // 2. Swap DAI to WETH
            uint256 amountOut = _swapExactInputSingle(borrowAmount, DAI, WETH);

            // 3. Supply полученный WETH
            _supply(
                DEFAULT_AAVE_MARKET,
                amountOut,
                dsProxy,
                4, // WETH assetId
                dsProxy
            );

            borrowAmount = (borrowAmount * params.borrowPercent) / 100;
        }
    }

    function _swapExactInputSingle(uint256 amountIn, address assetIn, address assetOut) internal returns (uint256 amountOut) {
        // Апрув DAI для роутера
        IERC20(assetIn).approve(UNISWAP_ROUTER, amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: assetIn,
                tokenOut: assetOut,
                fee: POOL_FEE,
                recipient: address(this),
                deadline: block.timestamp + 300,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = ISwapRouter(UNISWAP_ROUTER).exactInputSingle(params);
    }

    function _supply(
        address _market,
        uint256 _amount,
        address _from,
        uint16 _assetId,
        address _onBehalf
    ) internal returns (uint256, bytes memory) {
        IPool lendingPool = getLendingPool(_market);
        address tokenAddr = lendingPool.getReserveAddressById(_assetId);

        if (_amount == type(uint256).max) {
            _amount = tokenAddr.getBalance(_from);
        }

        if (_onBehalf == address(0)) {
            _onBehalf = address(this);
        }

        tokenAddr.pullTokensIfNeeded(_from, _amount);
        tokenAddr.approveToken(address(lendingPool), _amount);
        lendingPool.supply(tokenAddr, _amount, _onBehalf, AAVE_REFERRAL_CODE);

        bytes memory logData = abi.encode(
            _market,
            tokenAddr,
            _amount,
            _from,
            _onBehalf
        );
        return (_amount, logData);
    }

    function _borrow(
        address _market,
        uint16 _assetId,
        uint256 _amount,
        uint256 _rateMode,
        address _to,
        address _onBehalf
    ) internal returns (uint256, bytes memory) {
        IPool lendingPool = getLendingPool(_market);
        address tokenAddr = lendingPool.getReserveAddressById(_assetId);

        if (_onBehalf == address(0)) {
            _onBehalf = address(this);
        }

        lendingPool.borrow(tokenAddr, _amount, _rateMode, AAVE_REFERRAL_CODE, _onBehalf);

        bytes memory logData = abi.encode(_market, tokenAddr, _amount, _rateMode, _to, _onBehalf);
        return (_amount, logData);
    }

    function actionType() public pure override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }
}
