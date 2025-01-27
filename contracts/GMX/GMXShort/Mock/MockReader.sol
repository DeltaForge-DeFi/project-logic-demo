// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReader {
    function getAccountPositions(
        address /* dataStore */,
        address account,
        uint256 /* start */,
        uint256 /* end */
    ) external view returns (PositionProps[] memory);
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

contract MockReader is IReader {
    address public marketAddress;

    constructor(address _marketAddress) {
        marketAddress = _marketAddress;
    }

    function getAccountPositions(
        address /* dataStore */,
        address account,
        uint256 /* start */,
        uint256 /* end */
    ) external view override returns (PositionProps[] memory) {
        PositionProps[] memory positions = new PositionProps[](1);
        positions[0] = PositionProps({
            addresses: Addresses({
                account: account,
                market: marketAddress,
                collateralToken: address(0)
            }),
            numbers: Numbers({
                sizeInUsd: 1000 * 10**18,
                sizeInTokens: 100 * 10**18,
                collateralAmount: 100 * 10**18,
                borrowingFactor: 0,
                fundingFeeAmountPerSize: 0,
                longTokenClaimableFundingAmountPerSize: 0,
                shortTokenClaimableFundingAmountPerSize: 0,
                increasedAtTime: block.timestamp,
                decreasedAtTime: 0
            }),
            flags: Flags({
                isLong: false
            })
        });
        return positions;
    }
}