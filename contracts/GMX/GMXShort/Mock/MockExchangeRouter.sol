// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IExchangeRouter {
    function multicall(bytes[] calldata data) external payable returns (bytes[] memory results);
    function sendTokens(address token, address to, uint256 amount) external;
    function createOrder(OrderParams calldata params) external;
    function sendWnt(address receiver, uint256 amount) external payable;
}

struct OrderParams {
    CreateOrderParamsAddresses addresses;
    CreateOrderParamsNumbers numbers;
    OrderType orderType;
    DecreasePositionSwapType decreasePositionSwapType;
    bool isLong;
    bool shouldUnwrapNativeToken;
    bool autoCancel;
    bytes32 referralCode;
}

struct CreateOrderParamsAddresses {
    address receiver;
    address cancellationReceiver;
    address callbackContract;
    address uiFeeReceiver;
    address market;
    address initialCollateralToken;
    address[] swapPath;
}

struct CreateOrderParamsNumbers {
    uint256 sizeDeltaUsd;
    uint256 initialCollateralDeltaAmount;
    uint256 triggerPrice;
    uint256 acceptablePrice;
    uint256 executionFee;
    uint256 callbackGasLimit;
    uint256 minOutputAmount;
    uint256 validFromTime;
}

enum DecreasePositionSwapType {
    NoSwap,
    SwapPnlTokenToCollateralToken,
    SwapCollateralTokenToPnlToken
}

enum OrderType {
    MarketSwap,
    LimitSwap,
    MarketIncrease,
    LimitIncrease,
    MarketDecrease,
    LimitDecrease,
    StopLossDecrease,
    Liquidation,
    StopIncrease
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract MockExchangeRouter is IExchangeRouter {
    address public createShortAddress;

    function setCreateShortAddress(address _createShortAddress) external {
        createShortAddress = _createShortAddress;
    }

    function multicall(bytes[] calldata data) external payable override returns (bytes[] memory results) {
        results = new bytes[](data.length);
        for (uint i = 0; i < data.length; i++) {
            results[i] = data[i];
        }
    }

    function sendTokens(address token, address to, uint256 amount) external override {
        require(amount > 0, "sendTokens must be more than 0");
        IERC20(token).transfer(to, amount);
    }

    function sendWnt(address receiver, uint256 amount) external payable override {
    require(msg.value <= amount, "Insufficient WNT amount");
}

    function createOrder(OrderParams calldata params) external override {

        // When closing the position (in withdrawShort), the contract expects this to run and try to return collateral
        // Attempt to transferFrom the createShort contract to the user.
        // If createShortAddress doesn't have enough tokens, MockERC20.transferFrom() will revert with "Insufficient contract balance".
        
        if (params.numbers.initialCollateralDeltaAmount > 0) {
            bool success = IERC20(params.addresses.initialCollateralToken).transferFrom(
                createShortAddress,
                params.addresses.receiver,
                params.numbers.initialCollateralDeltaAmount
            );
            require(success, "Router: transfer failed");
        }
    }
}
