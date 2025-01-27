import { ethers, parseUnits } from "ethers";
import supplyDAI from "./newSupplyFunc";
import repayDAI from "./repayFunc";
import withdrawDAI from "./withdrawFunc";
import borrowDAI from "./borrowFunc";

const PoolAbi = [
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "onBehalfOf", type: "address" },
      { internalType: "uint16", name: "referralCode", type: "uint16" },
    ],
    name: "supply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// ABI для Chainlink Price Feed
const PriceFeedAbi = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
];

const POOL_ABI = [
  "function getUserAccountData(address user) external view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
];

// ABI для ProtocolDataProvider
const DataProviderAbi = [
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserAccountData",
    outputs: [
      { internalType: "uint256", name: "totalCollateralBase", type: "uint256" },
      { internalType: "uint256", name: "totalDebtBase", type: "uint256" },
      {
        internalType: "uint256",
        name: "availableBorrowsBase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentLiquidationThreshold",
        type: "uint256",
      },
      { internalType: "uint256", name: "ltv", type: "uint256" },
      { internalType: "uint256", name: "healthFactor", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Общая конфигурация
const POOL_ADDRESS = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"; // Aave Pool для Arbitrum
const DATA_PROVIDER_ADDRESS = "0x0000000000000000000000000000000000000000"; // Замените на реальный адрес Data Provider для Arbitrum

const WALLET_PRIVATE_KEY =
  ""; // Замените на ваш приватный ключ
const RPC_URL = "https://arb1.arbitrum.io/rpc"; // RPC для Arbitrum
const RECEIVER_ADDRESS = "0x40e214a332856202b3Dd84a4E21b84a260A1b10f"; // Ваш кошелек

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

// Подключение к пулу Aave
const poolContract = new ethers.Contract(POOL_ADDRESS, PoolAbi, wallet);

// Подключение к ProtocolDataProvider
const dataProviderContract = new ethers.Contract(
  DATA_PROVIDER_ADDRESS,
  DataProviderAbi,
  wallet
);

async function openLoop(iterations: number, initialAmount: bigint) {
  let currentAmount = initialAmount;

  for (let i = 0; i < iterations; i++) {
    console.log(`\n=== Открытие лупинга: Итерация ${i + 1} ===`);

    // Внесение средств (Supply)
    try {
      console.log(
        `Выполняется supplyDAI на сумму ${ethers.formatUnits(
          currentAmount,
          18
        )} DAI...`
      );
      await supplyDAI(currentAmount);
      console.log("supplyDAI завершено.");
    } catch (error) {
      console.error("Ошибка в supplyDAI:", error);
      break; // Прерываем цикл при ошибке
    }

    // Расчет доступной суммы для заема
    const borrowAmount = await calculateBorrowableAmount();

    // Заем средств (Borrow)
    try {
      console.log(
        `Выполняется borrowDAI на сумму ${ethers.formatUnits(
          borrowAmount,
          18
        )} DAI...`
      );
      await borrowDAI(borrowAmount);
      console.log("borrowDAI завершено.");
    } catch (error) {
      console.error("Ошибка в borrowDAI:", error);
      break;
    }

    // Обновление текущей суммы для следующей итерации
    currentAmount = borrowAmount;

    console.log(`=== Итерация открытия ${i + 1} завершена ===`);
  }
}

// Функция для расчета доступной суммы для заема
async function calculateBorrowableAmount() {
  // Здесь вы можете добавить логику для расчета доступной суммы для заема
  // Например, получить данные аккаунта и вычислить на основе LTV
  // Для простоты вернем фиксированную сумму (например, 80% от текущего залога)

  // const WITHDRAW_AMOUNT = ethers.parseUnits("1", 18); // Сумма для вывода (в DAI)

  // Подключение к контракту aDAI

  // Получение данных аккаунта

  const pool = new ethers.Contract(POOL_ADDRESS, POOL_ABI, provider);

  // Получаем данные аккаунта пользователя
  const result = await pool.getUserAccountData(wallet.address);
  const availableBorrowsETH = result.availableBorrowsETH;
  console.log(`доступная сумма для заема${availableBorrowsETH}`);

  // Конвертация ETH в DAI (при необходимости)
  // Для простоты предположим, что 1 ETH = 1 DAI
  const borrowAmount = await parseUnits("0.2");

  return borrowAmount;
}

// Функция для получения текущего долга
async function getCurrentDebt(): Promise<bigint> {
  const userData = await dataProviderContract.getUserAccountData(
    wallet.address
  );
  const totalDebtBase: bigint = BigInt(userData.totalDebtBase.toString());
  return totalDebtBase;
}

const priceFeed = new ethers.Contract(
  "0xb56c2F0B653B2e0b10C9b928C8580Ac5Df02C7C7",
  PriceFeedAbi,
  provider
);

// Функция для получения текущей цены ETH/USD
async function getLatestETHUSDPrice(): Promise<number> {
  const [, answer] = await priceFeed.latestRoundData();
  const price = Number(answer) / 1e8; // Chainlink возвращает цену с 8 десятичными знаками
  return price;
}

// Функция для получения доступного баланса для вывода
async function getAvailableWithdrawAmount(): Promise<bigint> {
  const userData = await dataProviderContract.getUserAccountData(
    wallet.address
  );
  const totalCollateralBase: bigint = BigInt(
    userData.totalCollateralBase.toString()
  );

  // Вычисление суммы, которую можно безопасно вывести
  // Здесь вы можете добавить дополнительные проверки LTV и т.д.
  return totalCollateralBase;
}

// Пример использования:
const iterations = 3; // Количество повторений цикла
const initialAmount = ethers.parseUnits("2", 18); // Начальная сумма для внесения

// Открытие позиции
openLoop(iterations, initialAmount)
  .then(() => {
    console.log("Открытие лупинга завершено.");

    // Закрытие позиции (можно вызвать по необходимости)
    // closeLoop(iterations).then(() => {
    //   console.log("Закрытие лупинга завершено.");
    // });
  })
  .catch(console.error);
