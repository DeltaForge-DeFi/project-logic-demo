import { ethers } from 'ethers';
import ExchangeRouterJson from '../../../../source/GMX/deploymentsGMX/arbitrum/ExchangeRouter.json';
import RouterJson from '../../../../source/GMX/deploymentsGMX/arbitrum/Router.json';
import OrderVaultJson from '../../../../source/GMX/deploymentsGMX/arbitrum/OrderVault.json';
import dotenv from 'dotenv';

dotenv.config();

const EXCHANGE_ROUTER_ADDRESS = ExchangeRouterJson.address; // Адрес ExchangeRouter
const EXCHANGE_ROUTER_ABI = ExchangeRouterJson.abi;

const ROUTER_ADDRESS = RouterJson.address; // Адрес Router

const ORDER_VAULT_ADDRESS = OrderVaultJson.address;

const USDC_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // USDC

const MARKET_ADDRESS = '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336'; // WAVAX/USDC Market

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_ARBITRUM_URL);

  // Ваш приватный ключ
  const privateKey = process.env.PRIVATE_KEY_ARBITRUM || '';
  const wallet = new ethers.Wallet(privateKey, provider);

  // Инициализируем контракты
  const exchangeRouterWallet = new ethers.Contract(EXCHANGE_ROUTER_ADDRESS, EXCHANGE_ROUTER_ABI, wallet);

  // Проверяем балансы
  const usdcAbi = ['function balanceOf(address owner) view returns (uint256)'];
  const usdcContract = new ethers.Contract(USDC_ADDRESS, usdcAbi, wallet);
  const usdcBalance = await usdcContract.balanceOf(wallet.address);
  console.log(`USDC Balance: ${ethers.formatUnits(usdcBalance, 6)} USDC`);

  const ethAddress = await provider.getBalance(wallet.address);
  console.log(`AVAX Balance: ${ethers.formatUnits(ethAddress, 18)} ETH`);

  // Параметры ордера
  const createOrderParams = {
    addresses: {
      receiver: wallet.address,
      cancellationReceiver: wallet.address,
      callbackContract: ethers.ZeroAddress,
      uiFeeReceiver: ethers.ZeroAddress,
      market: MARKET_ADDRESS,
      initialCollateralToken: USDC_ADDRESS,
      swapPath: [],
    },
    numbers: {
      sizeDeltaUsd: ethers.parseUnits('2.1', 30), // Размер позиции в USD
      initialCollateralDeltaAmount: 0, // Сумма залога в USDC
      triggerPrice: 0,
      acceptablePrice: 0,
      executionFee: ethers.parseUnits('0.001', 18), // Увеличиваем executionFee
      callbackGasLimit: 200000,
      minOutputAmount: 0,
      validFromTime: 0,
    },
    orderType: 2, // Тип ордера
    decreasePositionSwapType: 0,
    isLong: false,
    shouldUnwrapNativeToken: false,
    autoCancel: false,
    referralCode: ethers.encodeBytes32String(''),
  };

  // Одобрение токенов обеспечения (USDC)
  const collateralTokenAbi = [
    'function approve(address spender, uint256 amount) public returns (bool)',
  ];
  const collateralToken = new ethers.Contract(USDC_ADDRESS, collateralTokenAbi, wallet);

  const approveAmount = ethers.parseUnits('100000000000', 6); // Одобряем 100 USDC
  const approveTx = await collateralToken.approve(ROUTER_ADDRESS, approveAmount);
  await approveTx.wait();
  console.log('Tokens approved');

  const exchangeRouterInterface = new ethers.Interface(EXCHANGE_ROUTER_ABI);
  const sentWnt = exchangeRouterInterface.encodeFunctionData('sendWnt', [
    ORDER_VAULT_ADDRESS,
    ethers.parseUnits('0.001', 18),
  ]);

  const sendTokens = exchangeRouterInterface.encodeFunctionData('sendTokens', [
    USDC_ADDRESS,
    ORDER_VAULT_ADDRESS,
    ethers.parseUnits('2.1', 6),
  ]);

  const createOrderCalldata = exchangeRouterInterface.encodeFunctionData('createOrder', [
    createOrderParams,
  ]);

  const executionFee = ethers.parseUnits('0.001', 18);

  const tx = await exchangeRouterWallet.multicall([sentWnt, sendTokens, createOrderCalldata], {
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
