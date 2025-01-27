import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

export async function wrapEth(
  amount: bigint
): Promise<ethers.TransactionReceipt> {
  if (!process.env.PRIVATE_KEY || !process.env.ARBITRUM_ONE_RPC) {
    throw new Error(
      "Необходимо указать PRIVATE_KEY и ARBITRUM_ONE_RPC в .env файле"
    );
  }

  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_ONE_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Адрес WETH на Arbitrum One
  const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";

  const wethContract = new ethers.Contract(
    WETH,
    [
      "function deposit() external payable",
      "function withdraw(uint256) external",
      "function balanceOf(address) external view returns (uint256)",
    ],
    wallet
  );

  try {
    console.log(`Оборачиваем ${ethers.formatEther(amount)} ETH в WETH...`);
    const tx = await wethContract.deposit({ value: amount });
    const receipt = await tx.wait();
    console.log("ETH успешно обернут в WETH");
    console.log("Хэш транзакции:", receipt.hash);
    return receipt;
  } catch (error) {
    console.error("Ошибка при оборачивании ETH в WETH:", error);
    throw error;
  }
}

// Скрипт можно запустить напрямую
if (require.main === module) {
  const amount = ethers.parseEther("0.0006");
  wrapEth(amount)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
