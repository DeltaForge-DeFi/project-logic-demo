// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { DSAuthority } from "../../DSProxy/authority/DSAuthority.sol";

interface IExchangeRouter {
    function multicall(
        bytes[] calldata data
    ) external payable returns (bytes[] memory results);

    function sendTokens(address token, address to, uint256 amount) external;

    function createOrder(OrderParams calldata params) external;

    function sendWnt(address receiver, uint256 amount) external payable;

    function createWithdrawal(OrderParams calldata params) external;

    function cancelOrder(bytes32 key) external payable;
}

interface IReader {
    function getAccountPositions(
        address dataStore,
        address account,
        uint256 start,
        uint256 end
    ) external view returns (PositionProps[] memory);
}

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);
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

struct PositionProps {
    Addresses addresses;
    Numbers numbers;
    Flags flags;
}

struct Addresses {
    address account;
    address market;
    address collateralToken;
}

struct Numbers {
    uint256 sizeInUsd;
    uint256 sizeInTokens;
    uint256 collateralAmount;
    uint256 borrowingFactor;
    uint256 fundingFeeAmountPerSize;
    uint256 longTokenClaimableFundingAmountPerSize;
    uint256 shortTokenClaimableFundingAmountPerSize;
    uint256 increasedAtTime;
    uint256 decreasedAtTime;
}

struct Flags {
    bool isLong;
}

contract CreateShort{
    DSAuthority public authority;
    address public owner;

    struct Position {
        address market;
        uint256 sizeDeltaUsd;
        uint256 initialCollateralDeltaAmount;
        bool isActive;
    }

    struct shortParams {
        address user;
        address market;
        uint256 sizeDeltaUsd;
        uint256 initialCollateralDeltaAmount;
        IExchangeRouter exchangeRouter;
        IReader reader;
        IERC20 USDC;
        address orderVaultAddress;
        address dataStoreAddress;
        address routerAddress;
    }

    struct withdrawParams {
        address user;
        IExchangeRouter exchangeRouter;
        IReader reader;
        IERC20 USDC;
        address orderVaultAddress;
        address dataStoreAddress;
        address routerAddress;
    }

    struct readParams {
        IReader reader;
        address dataStoreAddress;
    }

    mapping(address => Position) public userPositions;

    event PositionCreated(
        address indexed user,
        address indexed market,
        uint256 sizeDeltaUsd,
        uint256 initialCollateralDeltaAmount
    );
    event PositionClosed(
        address indexed user,
        address indexed market,
        uint256 sizeDeltaUsd,
        uint256 initialCollateralDeltaAmount
    );

    event LogPositionDetails(
        address indexed user,
        uint256 sizeInUsd,
        uint256 collateralAmount
    );

    // Для nonReentrant
    uint256 _status;

    modifier nonReentrant() {
        require(_status != 1, "Reentrant call");
        _status = 1;
        _;
        _status = 0;
    }

    /**
     * @notice Creates a new short position
     * @dev Все необходимые адреса и интерфейсы, а также user, market, sizeDeltaUsd, initialCollateralDeltaAmount
     * теперь передаются через _callData
     */
    function createShort(bytes memory _callData) external payable nonReentrant {
        shortParams memory params = abi.decode(_callData, (shortParams));

        require(params.user != address(0), "user must be not 0x0");
        require(params.initialCollateralDeltaAmount > 0, "collateral must be more than 0");
        require(params.market != address(0), "market must be not 0x0");
        require(msg.value > 0, "fee must be more than 0");
        require(!userPositions[params.user].isActive, "Position already active");

        params.USDC.transferFrom( 
            params.user,
            address(this),
            params.initialCollateralDeltaAmount
        );

        params.USDC.approve(
            params.routerAddress,
            params.initialCollateralDeltaAmount
        );

        CreateOrderParamsAddresses
            memory ShortAddressParams = CreateOrderParamsAddresses({
                receiver: params.user,
                cancellationReceiver: params.user,
                callbackContract: address(0),
                uiFeeReceiver: address(0),
                market: params.market,
                initialCollateralToken: address(params.USDC),
                swapPath: new address[](0)
            });

        CreateOrderParamsNumbers
            memory ShortNumbersParams = CreateOrderParamsNumbers({
                sizeDeltaUsd: params.sizeDeltaUsd,
                initialCollateralDeltaAmount: 0,
                triggerPrice: 0,
                acceptablePrice: 0,
                executionFee: msg.value,
                callbackGasLimit: 200000,
                minOutputAmount: 0,
                validFromTime: 0
            });

        OrderParams memory createShortParams = OrderParams({
            addresses: ShortAddressParams,
            numbers: ShortNumbersParams,
            orderType: OrderType.MarketIncrease,
            decreasePositionSwapType: DecreasePositionSwapType.NoSwap,
            isLong: false,
            shouldUnwrapNativeToken: false,
            autoCancel: false,
            referralCode: bytes32(0)
        });

        bytes[] memory txData = new bytes[](3);

        txData[0] = abi.encodeWithSelector(
            IExchangeRouter.sendWnt.selector,
            params.orderVaultAddress,
            msg.value
        );
        txData[1] = abi.encodeWithSelector(
            IExchangeRouter.sendTokens.selector,
            address(params.USDC),
            params.orderVaultAddress,
            params.initialCollateralDeltaAmount
        );
        txData[2] = abi.encodeWithSelector(
            IExchangeRouter.createOrder.selector,
            createShortParams
        );

        params.exchangeRouter.multicall{value: msg.value}(txData);

        userPositions[params.user] = Position({
            market: params.market,
            sizeDeltaUsd: params.sizeDeltaUsd,
            initialCollateralDeltaAmount: params.initialCollateralDeltaAmount,
            isActive: true
        });

        emit PositionCreated(
            params.user,
            params.market,
            params.sizeDeltaUsd,
            params.initialCollateralDeltaAmount
        );
    }

    /**
     * @notice Closes an existing short position
     * @dev Все необходимые адреса передаются через _callData
     */
    function withdrawShort(
        bytes memory _callData
    ) external payable nonReentrant {
        withdrawParams memory wParams = abi.decode(_callData, (withdrawParams));
        require(wParams.user != address(0), "user must be not 0x0");
        require(msg.value > 0, "fee must be more than 0");
        require(userPositions[wParams.user].isActive, "No active position");

        PositionProps[] memory position = wParams.reader.getAccountPositions(
            wParams.dataStoreAddress,
            address(this),
            0,
            100
        );

        CreateOrderParamsAddresses
            memory ShortAddressParams = CreateOrderParamsAddresses({
                receiver: wParams.user,
                cancellationReceiver: wParams.user,
                callbackContract: address(0),
                uiFeeReceiver: address(0),
                market: position[0].addresses.market,
                initialCollateralToken: position[0].addresses.collateralToken,
                swapPath: new address[](0)
            });

        emit LogPositionDetails(
            wParams.user,
            position[0].numbers.sizeInUsd,
            position[0].numbers.collateralAmount
        );

        CreateOrderParamsNumbers
            memory ShortNumbersParams = CreateOrderParamsNumbers({
                sizeDeltaUsd: position[0].numbers.sizeInUsd,
                initialCollateralDeltaAmount: position[0]
                    .numbers
                    .collateralAmount,
                triggerPrice: 0,
                acceptablePrice: type(uint256).max,
                executionFee: msg.value,
                callbackGasLimit: 200000,
                minOutputAmount: 0,
                validFromTime: 0
            });

        OrderParams memory closeShortParams = OrderParams({
            addresses: ShortAddressParams,
            numbers: ShortNumbersParams,
            orderType: OrderType.MarketDecrease,
            decreasePositionSwapType: DecreasePositionSwapType.SwapPnlTokenToCollateralToken,
            isLong: false,
            shouldUnwrapNativeToken: true,
            autoCancel: false,
            referralCode: bytes32(0)
        });
        bytes[] memory txData = new bytes[](2);
        txData[0] = abi.encodeWithSelector(
            IExchangeRouter.sendWnt.selector,
            wParams.orderVaultAddress,
            msg.value
        );
        txData[1] = abi.encodeWithSelector(
            IExchangeRouter.createOrder.selector,
            closeShortParams
        );

        wParams.exchangeRouter.multicall{value: msg.value}(txData);

        userPositions[wParams.user].isActive = false;

        emit PositionClosed(
            wParams.user,
            position[0].addresses.market,
            position[0].numbers.sizeInUsd,
            position[0].numbers.collateralAmount
        );
    }

    function readPosition(
        bytes memory _callData
    ) external view returns (PositionProps[] memory) {
        readParams memory rParams = abi.decode(_callData, (readParams));
        PositionProps[] memory position = rParams.reader.getAccountPositions(
            rParams.dataStoreAddress,
            address(this),
            0,
            100
        );
        return position;
    }
}
