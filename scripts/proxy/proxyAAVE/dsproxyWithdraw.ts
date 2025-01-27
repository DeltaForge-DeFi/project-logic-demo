import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

// Загрузка переменных из .env
const PROVIDER_URL = process.env.ARBITRUM_ONE_RPC!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const DS_PROXY_ADDRESS = "0x96e8c7ccf8f306a24cb9f982bba7b04454cf0638"; // Адрес DSProxy
const AAVE_WITHDRAW_ADDRESS = "0x570BfB7A185EFa93d54b06348a9eB69F6bd94ec3"; // Адрес контракта AaveWithdraw
const DEFAULT_AAVE_MARKET = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"; // Aave Market

// ABI для DSProxy
const DS_PROXY_ABI = [
  "function execute(address _target, bytes _data) public payable returns (bytes memory)",
  "function owner() view returns (address)",
];

// Полная ABI для AaveWithdraw
const AAVE_WITHDRAW_ABI = [
  "function executeActionDirect(bytes memory _callData) public payable",
];

async function main() {
  // Инициализация провайдера и кошелька
  const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Подключение к контрактам
  const dsProxy = new ethers.Contract(DS_PROXY_ADDRESS, DS_PROXY_ABI, wallet);
  const aaveWithdraw = new ethers.Contract(
    AAVE_WITHDRAW_ADDRESS,
    AAVE_WITHDRAW_ABI,
    wallet
  );

  // Проверяем владельца DSProxy
  const owner = await dsProxy.getFunction("owner").staticCall();
  console.log("Владелец DSProxy:", owner);

  if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
    console.error("Вы не являетесь владельцем DSProxy. Вызов запрещён.");
    return;
  }

  // Параметры вызова
  const params = {
    assetId: 0, // ID актива
    useDefaultMarket: true, // Использовать ли дефолтный рынок
    amount: ethers.parseUnits("1", 18), // Сумма токенов (например, 1 токен)
    to: wallet.address, // Адрес назначения
    market: DEFAULT_AAVE_MARKET, // Aave Market (игнорируется, если useDefaultMarket = true)
  };

  // Кодируем параметры в формат для executeActionDirect
  const paramsEncoded = ethers.AbiCoder.defaultAbiCoder().encode(
    ["uint16", "bool", "uint256", "address", "address"],
    [
      params.assetId,
      params.useDefaultMarket,
      params.amount,
      params.to,
      params.market,
    ]
  );

  // Кодируем вызов executeActionDirect
  const callData = aaveWithdraw.interface.encodeFunctionData(
    "executeActionDirect",
    [paramsEncoded]
  );

  // Проверяем возможность вызова через DSProxy
  try {
    console.log("Проверяем транзакцию с помощью staticCall...");
    const callStaticResult = await dsProxy
      .getFunction("execute")
      .staticCall(AAVE_WITHDRAW_ADDRESS, callData);
    console.log(
      "Тестовый вызов выполнен успешно (callStatic):",
      callStaticResult
    );
  } catch (error) {
    console.error("Ошибка callStatic:", error);
    console.log("Транзакция может быть ревертирована. Попробуем выполнить её.");
  }

  // Логирование данных транзакции
  const txRequest = {
    to: DS_PROXY_ADDRESS,
    data: dsProxy.interface.encodeFunctionData("execute", [
      AAVE_WITHDRAW_ADDRESS,
      callData,
    ]),
    gasLimit: 500000, // Лимит газа
  };

  console.log("Данные транзакции:", txRequest);

  // Выполняем транзакцию через DSProxy
  console.log("Отправляем транзакцию через DSProxy...");
  try {
    const tx = await wallet.sendTransaction(txRequest);
    console.log(`Транзакция отправлена: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log("Транзакция подтверждена:", receipt);
  } catch (error) {
    console.error("Транзакция ревертирована.");
    console.error("Данные транзакции:", txRequest);
    console.error("Ошибка:", error);
  }
}

// Запуск скрипта
main().catch((error) => {
  console.error("Ошибка выполнения скрипта:", error);
});
