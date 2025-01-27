import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { createDSProxyService } from "./contractScripts/dsProxy";
import { createAaveWithdrawService } from "./contractScripts/aaveWithdraw";

dotenv.config();

const AAVE_WITHDRAW_ADDRESS = "0x570BfB7A185EFa93d54b06348a9eB69F6bd94ec3";
const DEFAULT_AAVE_MARKET = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb";

async function main() {
  // Инициализация провайдера и кошелька
  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_ONE_RPC!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  // Создание сервисов
  const dsProxyService = createDSProxyService("arbitrum_one", wallet);
  const aaveWithdrawService = createAaveWithdrawService(
    AAVE_WITHDRAW_ADDRESS,
    dsProxyService,
    wallet
  );

  // Параметры для withdraw
  const withdrawParams = {
    assetId: 4, // ID актива (DAI)
    useDefaultMarket: true,
    amount: ethers.parseUnits("0.0005", 18), // 1 DAI
    to: wallet.address,
    market: DEFAULT_AAVE_MARKET,
  };

  try {
    console.log("Начинаем процесс withdraw...");

    // Выполняем withdraw
    const tx = await aaveWithdrawService.withdraw(withdrawParams);
    console.log("Транзакция отправлена:", tx.hash);

    // Ждем подтверждения
    const receipt = await tx.wait();
    console.log("Транзакция подтверждена:", receipt.hash);
  } catch (error) {
    console.error("Ошибка при выполнении withdraw:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
