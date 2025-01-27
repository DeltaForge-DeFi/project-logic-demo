import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { createDSProxyService } from "./contractScripts/dsProxy";
import { createAaveBorrowService } from "./contractScripts/aaveBorrow";

dotenv.config();

const AAVE_BORROW_ADDRESS = "0x89D9fcb5abe53fb0751a564C45cd23B3011058F7";
const DEFAULT_AAVE_MARKET = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_ONE_RPC!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const dsProxyService = createDSProxyService("arbitrum_one", wallet);
  const aaveBorrowService = createAaveBorrowService(
    AAVE_BORROW_ADDRESS,
    dsProxyService,
    wallet
  );

  // Проверяем владельца DSProxy
  const owner = await dsProxyService.getContractAddress();
  console.log("Владелец DSProxy:", owner);

  const borrowParams = {
    amount: ethers.parseUnits("1", 18), // 1 токен
    to: wallet.address,
    rateMode: 2, // Variable rate
    assetId: 0, // DAI
    useDefaultMarket: true,
    useOnBehalf: false,
    market: DEFAULT_AAVE_MARKET,
    onBehalf: ethers.ZeroAddress,
  };

  try {
    console.log("Начинаем процесс заимствования...");
    const tx = await aaveBorrowService.borrow(borrowParams);
    console.log("Транзакция отправлена:", tx.hash);

    const receipt = await tx.wait();
    console.log("Транзакция подтверждена:", receipt.hash);
  } catch (error) {
    console.error("Ошибка при выполнении заимствования:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
