import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// Константы
const DS_PROXY_ADDRESS = "0xDd06e3d838CF0ADd69838476993F42B7fE28d605"; // Адрес DSProxy
const CONTRACT_TO_AUTHORIZE = "0x570BfB7A185EFa93d54b06348a9eB69F6bd94ec3"; // AaveWithdraw
const FUNCTION_SIGNATURE = "0xe4bcd818"; // Сигнатура executeActionDirect
const PROVIDER_URL = process.env.ARBITRUM_ONE_RPC!; // RPC-сервер сети Arbitrum
const PRIVATE_KEY = process.env.PRIVATE_KEY!; // Приватный ключ владельца DSProxy

// ABI для DSProxy
const DS_PROXY_ABI = [
  "function owner() view returns (address)",
  "function setAuthority(address authority) external",
  "function isAuthorized(address src, address dst, bytes4 sig) view returns (bool)",
];

async function main() {
  const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Подключение к DSProxy
  const dsProxy = new ethers.Contract(DS_PROXY_ADDRESS, DS_PROXY_ABI, wallet);

  // Проверка владельца DSProxy
  const owner = await dsProxy.owner();
  console.log(`Владелец DSProxy: ${owner}`);

  if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
    console.error(
      "Вы не являетесь владельцем DSProxy. Авторизация невозможна."
    );
    return;
  }

  // Проверяем, зарегистрирована ли функция executeActionDirect
  try {
    const isAuthorized = await dsProxy.isAuthorized(
      CONTRACT_TO_AUTHORIZE,
      DS_PROXY_ADDRESS,
      FUNCTION_SIGNATURE
    );
    console.log(
      `Функция executeActionDirect ${
        isAuthorized ? "уже авторизована" : "не авторизована"
      }.`
    );

    if (isAuthorized) {
      return; // Ничего делать не нужно, функция уже авторизована.
    }
  } catch (error) {
    console.error(
      "Функция isAuthorized недоступна. Возможно, требуется другое решение."
    );
  }

  // Установка authority
  try {
    console.log(
      `Авторизуем контракт ${CONTRACT_TO_AUTHORIZE} через DSProxy...`
    );
    const tx = await dsProxy.setAuthority(CONTRACT_TO_AUTHORIZE, {
      gasLimit: 500000,
    });
    console.log(`Транзакция отправлена: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log("Транзакция подтверждена:", receipt);
  } catch (error: any) {
    console.error("Ошибка авторизации:", error.message);
  }
}

// Запуск скрипта
main().catch((error) => {
  console.error("Ошибка выполнения скрипта:", error);
});
