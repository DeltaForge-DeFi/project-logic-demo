import { ethers } from "ethers";
import { AaveSupplyService } from "./aaveSupply";
import { AaveBorrowService } from "./aaveBorrow";
import { UniswapSwapService } from "./uniswapSwap";
import { DSProxyService } from "./dsProxy";

export interface LoopingParams {
  initialAmount: ethers.BigNumberish;
  borrowRatio: number; // процент займа от депозита (например, 75 = 75%)
  cycles: number;
  rateMode: number;
}

export class LoopingService {
  constructor(
    private aaveSupplyService: AaveSupplyService,
    private aaveBorrowService: AaveBorrowService,
    private uniswapService: UniswapSwapService,
    private dsProxyService: DSProxyService,
    private signer: ethers.Signer
  ) {}

  async executeLoop(params: LoopingParams) {
    const signerAddress = await this.signer.getAddress();
    let currentAmount = params.initialAmount;

    console.log("Начинаем процесс лупинга...");

    try {
      // Первоначальный депозит WETH
      console.log("Шаг 1: Депозит WETH");
      const supplyTx = await this.aaveSupplyService.supply({
        amount: currentAmount.toString(),
        from: await this.dsProxyService.getProxyAddress(),
        assetId: 4, // WETH
        useDefaultMarket: true,
        onBehalf: await this.signer.getAddress(),
        market: ethers.ZeroAddress
      });

      for (let i = 0; i < params.cycles; i++) {
        console.log(`Цикл ${i + 1} из ${params.cycles}`);

        // Рассчитываем сумму займа
        const borrowAmount =
          (BigInt(currentAmount) * BigInt(params.borrowRatio)) / BigInt(100);

        // Занимаем DAI
        console.log("Шаг 2: Заём DAI");
        await this.aaveBorrowService.borrow({
          amount: borrowAmount,
          to: await this.signer.getAddress(),
          rateMode: params.rateMode,
          assetId: 0, // DAI
          useDefaultMarket: true,
          useOnBehalf: false,
          market: ethers.ZeroAddress,
          onBehalf: ethers.ZeroAddress,
        });

        // Меняем DAI на WETH
        console.log("Шаг 3: Свап DAI в WETH");
        const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
        const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";

        await this.uniswapService.swap({
          tokenIn: DAI,
          tokenOut: WETH,
          fee: 3000,
          recipient: signerAddress,
          amountIn: borrowAmount,
          amountOutMinimum: 0,
          sqrtPriceLimitX96: 0,
          pullTokens: true,
        });

        // Получаем новый баланс WETH
        const wethContract = new ethers.Contract(
          WETH,
          ["function balanceOf(address) view returns (uint256)"],
          this.signer
        );
        currentAmount = await wethContract.balanceOf(signerAddress);

        // Депозитим полученный WETH
        console.log("Шаг 4: Депозит полученного WETH");
        await this.aaveSupplyService.supply({
          amount: currentAmount.toString(),
          from: signerAddress,
          assetId: 4, // WETH
          enableAsColl: true,
          useDefaultMarket: true,
        });
      }

      console.log("Лупинг успешно завершен!");
      return currentAmount;
    } catch (error) {
      console.error("Ошибка при выполнении лупинга:", error);
      throw error;
    }
  }
}
