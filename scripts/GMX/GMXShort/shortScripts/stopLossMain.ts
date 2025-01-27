import { ethers } from 'ethers';
import ExchangeRouterJson from '../../../../source/GMX/deploymentsGMX/arbitrum/ExchangeRouter.json';
import OrderVaultJson from '../../../../source/GMX/deploymentsGMX/arbitrum/OrderVault.json';
import Reader from "../../../../source/GMX/deploymentsGMX/arbitrum/Reader.json"
import dataStore from "../../../../source/GMX/deploymentsGMX/arbitrum/DataStore.json"
import dotenv from 'dotenv';

dotenv.config();

interface PositionInfo {
    addresses: {
      account: string;
      market: string;
      collateralToken: string;
    };
    numbers: {
      sizeInUsd: bigint;
      sizeInTokens: bigint;
      collateralAmount: bigint;
      borrowingFactor: bigint;
      fundingFeeAmountPerSize: bigint;
      longTokenClaimableFundingAmountPerSize: bigint;
      shortTokenClaimableFundingAmountPerSize: bigint;
      increasedAtTime: bigint;
      decreasedAtTime: bigint;
    };
    flags: {
      isLong: boolean;
    };
  }

const EXCHANGE_ROUTER_ADDRESS = ExchangeRouterJson.address; 
const EXCHANGE_ROUTER_ABI = ExchangeRouterJson.abi;

const READER_ADDRESS = Reader.address;
const READER_ABI = Reader.abi;

const DATA_STORE_ADDRESS = dataStore.address;

const ORDER_VAULT_ADDRESS = OrderVaultJson.address;

const USDC_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // USDC

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_ARBITRUM_URL);

  const privateKey = process.env.PRIVATE_KEY_ARBITRUM || '';
  const wallet = new ethers.Wallet(privateKey, provider);
  const exchangeRouterWallet = new ethers.Contract(EXCHANGE_ROUTER_ADDRESS, EXCHANGE_ROUTER_ABI, wallet);

  // balances
  const usdcAbi = ['function balanceOf(address owner) view returns (uint256)'];
  const usdcContract = new ethers.Contract(USDC_ADDRESS, usdcAbi, wallet);
  const usdcBalance = await usdcContract.balanceOf(wallet.address);
  console.log(`USDC Balance: ${ethers.formatUnits(usdcBalance, 6)} USDC`);

  const avaxBalance = await provider.getBalance(wallet.address);
  console.log(`AVAX Balance: ${ethers.formatUnits(avaxBalance, 18)} ETH`);

  const readerContract = new ethers.Contract(READER_ADDRESS, READER_ABI, provider);
  const positions = await readerContract.getAccountPositions(DATA_STORE_ADDRESS, wallet.address, 0, 100);
  let positionInfo = {} as PositionInfo;
  positions.forEach((position: any) => {
    // Position
    positionInfo["addresses"] = {
        account: position.addresses.account,
        market: position.addresses.market,
        collateralToken: position.addresses.collateralToken
      };
  
    positionInfo["numbers"] = {
        sizeInUsd: position.numbers.sizeInUsd,
        sizeInTokens: position.numbers.sizeInTokens,
        collateralAmount: position.numbers.collateralAmount,
        borrowingFactor: position.numbers.borrowingFactor,
        fundingFeeAmountPerSize: position.numbers.fundingFeeAmountPerSize,
        longTokenClaimableFundingAmountPerSize: position.numbers.longTokenClaimableFundingAmountPerSize,
        shortTokenClaimableFundingAmountPerSize: position.numbers.shortTokenClaimableFundingAmountPerSize,
        increasedAtTime: position.numbers.increasedAtTime,
        decreasedAtTime: position.numbers.decreasedAtTime
      };
  
      positionInfo["flags"] = {
        isLong: position.flags.isLong
      };
  });
  

  const withdrawOrderParams = {
    addresses: {
      receiver: positionInfo.addresses.account,
      cancellationReceiver: positionInfo.addresses.account,
      callbackContract: ethers.ZeroAddress,
      uiFeeReceiver: ethers.ZeroAddress,
      market: positionInfo.addresses.market,
      initialCollateralToken: positionInfo.addresses.collateralToken,
      swapPath: [],
    },
    numbers: {
      sizeDeltaUsd: positionInfo.numbers.sizeInUsd, 
      initialCollateralDeltaAmount: positionInfo.numbers.collateralAmount, 
      triggerPrice: 0,
      acceptablePrice: ethers.MaxUint256,
      executionFee: ethers.parseUnits('0.001', 18), 
      callbackGasLimit: 200000,
      minOutputAmount: 0,
      validFromTime: 0,
    },
    orderType: 4, 
    decreasePositionSwapType: 1,
    isLong: positionInfo.flags.isLong,
    shouldUnwrapNativeToken: true,
    autoCancel: false,
    referralCode: ethers.encodeBytes32String(''),
  };

  // createOrder multicall
  const exchangeRouterInterface = new ethers.Interface(EXCHANGE_ROUTER_ABI);
  const sentWnt = exchangeRouterInterface.encodeFunctionData('sendWnt', [
    ORDER_VAULT_ADDRESS,
    ethers.parseUnits('0.001', 18),
  ]);

  const withdrawOrderCalldata = exchangeRouterInterface.encodeFunctionData('createOrder', [
    withdrawOrderParams,
  ]);

  const executionFee = ethers.parseUnits('0.001', 18); 

  const tx = await exchangeRouterWallet.multicall([sentWnt, withdrawOrderCalldata], {
    value: executionFee,
  });

  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();
  console.log('Short position opened successfully');

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
