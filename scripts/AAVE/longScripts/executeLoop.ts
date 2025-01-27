import { ethers } from "ethers";
import { createDSProxyService } from "./contractScripts/dsProxy";
import { createAaveSupplyService } from "./contractScripts/aaveSupply";
import { createAaveBorrowService } from "./contractScripts/aaveBorrow";
import { UniswapSwapService } from "./contractScripts/uniswapSwap";
import { LoopingService } from "./contractScripts/loopingService";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  if (!process.env.PRIVATE_KEY || !process.env.ARBITRUM_ONE_RPC) {
    throw new Error(
      "Необходимо указать PRIVATE_KEY и ARBITRUM_ONE_RPC в .env файле"
    );
  }

  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_ONE_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Инициализируем сервисы
  const dsProxyService = createDSProxyService("arbitrum_one", wallet);
  const aaveSupplyService = createAaveSupplyService(dsProxyService);
  const aaveBorrowService = createAaveBorrowService(
    "0x89D9fcb5abe53fb0751a564C45cd23B3011058F7",
    dsProxyService,
    wallet
  );
  const uniswapService = new UniswapSwapService(
    "0xFEDE19F4F8979cc16CB9Cfc1Ca170C3dA32a5387",
    dsProxyService,
    wallet
  );

  const loopingService = new LoopingService(
    aaveSupplyService,
    aaveBorrowService,
    uniswapService,
    dsProxyService,
    wallet
  );

  try {
    const initialAmount = ethers.parseEther("0.0007");
    const result = await loopingService.executeLoop({
      initialAmount,
      borrowRatio: 60000, // Занимаем 60% от депозита
      cycles: 3,
      rateMode: 2, // Variable rate
    });

    console.log("Итоговая сумма WETH:", ethers.formatEther(result));
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
