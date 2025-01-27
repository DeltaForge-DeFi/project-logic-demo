import { ethers } from "ethers";
import { DSProxyService } from "./dsProxy";
import { UniswapSwapService } from "./uniswapSwap";

const AAVE_DATA_PROVIDER_ABI = [
  "function getPool() external view returns (address)",
  "function getReserveData(address asset) external view returns (tuple(uint256 unbacked, uint256 accruedToTreasuryScaled, uint256 totalAToken, uint256 totalStableDebt, uint256 totalVariableDebt, uint256 liquidityRate, uint256 variableBorrowRate, uint256 stableBorrowRate, uint256 averageStableBorrowRate, uint256 liquidityIndex, uint256 variableBorrowIndex, uint40 lastUpdateTimestamp))",
  "function getUserReserveData(address asset, address user) external view returns (uint256 currentATokenBalance, uint256 currentStableDebt, uint256 currentVariableDebt, uint256 principalStableDebt, uint256 scaledVariableDebt, uint256 stableBorrowRate, uint256 liquidityRate, uint40 stableRateLastUpdated, bool usageAsCollateralEnabled)"
];

const POOL_ABI = [
  "function getUserAccountData(address user) external view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)"
];

const CONTRACTS = {
  WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
};

const CHAINLINK_ETH_USD_FEED = "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612";
const CHAINLINK_FEED_ABI = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)"
];

export interface CloseLoopParams {
  cycles: number;
  rateMode: number;
  minHealthFactor: number; // Минимальный безопасный HF после каждой операции
}

export class LoopingCloseService {
  private readonly HEALTH_FACTOR_DECIMALS = 18;
  private readonly ETH_DECIMALS = 18;
  private readonly DAI_DECIMALS = 18;
  private pool!: ethers.Contract;
  private ethUsdPriceFeed: ethers.Contract;
  private initialized = false;

  constructor(
    private aaveWithdrawService: any,
    private aavePaybackService: any,
    private uniswapService: UniswapSwapService,
    private dsProxyService: DSProxyService,
    private wallet: ethers.Wallet,
    private aaveDataProviderAddress: string
  ) {
    this.ethUsdPriceFeed = new ethers.Contract(
      CHAINLINK_ETH_USD_FEED,
      CHAINLINK_FEED_ABI,
      this.wallet
    );
  }

  private async initializePool() {
    if (this.initialized) return;
    
    const dataProvider = new ethers.Contract(
      this.aaveDataProviderAddress,
      AAVE_DATA_PROVIDER_ABI,
      this.wallet
    );
    const poolAddress = await dataProvider.getPool();
    this.pool = new ethers.Contract(poolAddress, POOL_ABI, this.wallet);
    this.initialized = true;
  }

  async executeCloseLoop(params: CloseLoopParams): Promise<bigint> {
    await this.initializePool();
    
    const userAddress = await this.dsProxyService.getProxyAddress();
    console.log(`Используется пул AAVE: ${await this.pool.getAddress()}`);

    for (let i = 0; i < params.cycles; i++) {
      console.log(`Выполняется цикл закрытия ${i + 1}/${params.cycles}`);

      // 1. Получаем текущее состояние позиции из пула
      const {
        totalCollateralBase,
        totalDebtBase,
        currentLiquidationThreshold,
        healthFactor,
      } = await this.pool.getUserAccountData(userAddress);

      console.log("Текущий Health Factor:", ethers.formatUnits(healthFactor, this.HEALTH_FACTOR_DECIMALS));

      if (totalDebtBase === BigInt(0)) {
        console.log("Долг полностью погашен");
        break;
      }

      // 2. Получаем цену ETH для конвертации
      const { answer } = await this.ethUsdPriceFeed.latestRoundData();
      const ethPrice = answer;

      // 3. Рассчитываем безопасный объем вывода в ETH
      const { withdrawAmount, swapAmount } = await this.calculateSafeWithdrawAmount(
        totalCollateralBase,
        totalDebtBase,
        currentLiquidationThreshold,
        params.minHealthFactor
      );

      if (withdrawAmount <= BigInt(0)) {
        console.log("Невозможно безопасно вывести коллатерал");
        break;
      }

      console.log("Выводим WETH:", ethers.formatEther(withdrawAmount));

      // 4. Выводим WETH
      const withdrawTx = await this.aaveWithdrawService.withdraw({
        amount: withdrawAmount.toString(),
        assetId: 4,
        useDefaultMarket: true,
        to: await this.wallet.getAddress(),
        market: ethers.ZeroAddress
      });
      await withdrawTx.wait();

      // 5. Свапаем WETH в DAI через Uniswap
      const swapTx = await this.uniswapService.swap({
        tokenIn: CONTRACTS.WETH,
        tokenOut: CONTRACTS.DAI,
        amountIn: swapAmount.toString(),
        fee: 500,
        recipient: await this.wallet.getAddress(),
        amountOutMinimum: "0",
        sqrtPriceLimitX96: "0",
        pullTokens: true
      });
      await swapTx.wait();

      // 6. Погашаем долг в DAI
      const daiAmount = totalDebtBase;

      await this.aavePaybackService.payback({
        amount: daiAmount,
        from: await this.wallet.getAddress(),
        token: CONTRACTS.DAI,
        rateMode: params.rateMode
      });

      console.log(`Погашено DAI: ${ethers.formatEther(daiAmount)}`);
      console.log(`Осталось долга: ${ethers.formatEther(totalDebtBase - daiAmount)}`);
    }

    const finalAccountData = await this.pool.getUserAccountData(userAddress);
    return finalAccountData.totalDebtBase;
  }

  private async calculateSafeWithdrawAmount(
    totalCollateral: bigint,   // в USD с 8 decimals
    totalDebt: bigint,        // в USD с 8 decimals
    liquidationThreshold: bigint,
    minHealthFactor: number
  ): Promise<{ withdrawAmount: bigint; swapAmount: bigint }> {
    const { answer } = await this.ethUsdPriceFeed.latestRoundData();
    const ethPrice = answer; // цена ETH в USD с 8 decimals

    // 1. Рассчитываем максимально возможный вывод в USD
    const requiredCollateralUsd = (totalDebt * BigInt(Math.floor(minHealthFactor * 100)) * BigInt(100)) / liquidationThreshold;
    const maxWithdrawUsd = totalCollateral > requiredCollateralUsd 
      ? totalCollateral - requiredCollateralUsd
      : BigInt(0);

    // 2. Определяем сколько нужно свапнуть в USD
    const swapAmountUsd = maxWithdrawUsd < totalDebt 
      ? maxWithdrawUsd 
      : totalDebt;

    // 3. Конвертируем суммы в ETH для вывода и свапа
    const withdrawAmountEth = (maxWithdrawUsd * BigInt(1e18)) / BigInt(ethPrice);
    const swapAmountEth = (swapAmountUsd * BigInt(1e18)) / BigInt(ethPrice);

    console.log("Текущий коллатерал (USD):", ethers.formatUnits(totalCollateral, 8));
    console.log("Текущий долг (USD):", ethers.formatUnits(totalDebt, 8));
    console.log("Цена ETH (USD):", ethers.formatUnits(ethPrice, 8));
    console.log("Можно вывести (USD):", ethers.formatUnits(maxWithdrawUsd, 8));
    console.log("Нужно свапнуть (USD):", ethers.formatUnits(swapAmountUsd, 8));
    console.log("Выводим ETH:", ethers.formatEther(withdrawAmountEth));
    console.log("Свапаем ETH:", ethers.formatEther(swapAmountEth));

    return {
      withdrawAmount: withdrawAmountEth,
      swapAmount: swapAmountEth
    };
  }
} 