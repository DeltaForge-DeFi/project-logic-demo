import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// Константы
const DS_PROXY_ADDRESS = "0x96e8c7ccf8f306a24cb9f982bba7b04454cf0638"; // Адрес DSProxy
const CONTRACT_TO_CHECK = "0xYourContractAddress"; // Ваш контракт
const FUNCTION_SIGNATURE = "0xYourFunctionSelector"; // Сигнатура функции, например: "0x389f87ff"
const PROVIDER_URL = process.env.ARBITRUM_ONE_RPC!; // RPC-сервер сети Arbitrum

// ABI для DSProxy
const DS_PROXY_ABI = [
  "function owner() view returns (address)",
  "function authority() view returns (address)",
  "function isAuthorized(address src, address dst, bytes4 sig) view returns (bool)",
];

async function main() {
  const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

  // Подключение к DSProxy
  const dsProxy = new ethers.Contract(DS_PROXY_ADDRESS, DS_PROXY_ABI, provider);

  // Проверяем владельца DSProxy
  const owner = await dsProxy.owner();
  console.log(`Владелец DSProxy: ${owner}`);

  // Проверяем authority контракта
  const authority = await dsProxy.authority();
  console.log(`Authority контракт DSProxy: ${authority}`);

  // Если доступна функция isAuthorized
  try {
    const isAuthorized = await dsProxy.isAuthorized(
      CONTRACT_TO_CHECK,
      DS_PROXY_ADDRESS,
      FUNCTION_SIGNATURE
    );
    console.log(
      `Авторизован ли контракт ${CONTRACT_TO_CHECK} для вызова функции ${FUNCTION_SIGNATURE}?`,
      isAuthorized
    );
  } catch (error) {
    console.error(
      "Функция isAuthorized недоступна. Проверьте authority или владельца вручную."
    );
  }

  // Дополнительная проверка, если isAuthorized недоступна
  if (authority.toLowerCase() === CONTRACT_TO_CHECK.toLowerCase()) {
    console.log(
      `Контракт ${CONTRACT_TO_CHECK} авторизован как authority в DSProxy.`
    );
  } else {
    console.log(
      `Контракт ${CONTRACT_TO_CHECK} НЕ авторизован как authority в DSProxy.`
    );
  }
}

// Запуск скрипта
main().catch((error) => {
  console.error("Ошибка выполнения скрипта:", error);
});
