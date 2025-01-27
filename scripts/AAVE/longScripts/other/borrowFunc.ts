import { ethers } from "ethers";

// ABI для пула Aave, включая функцию borrow
const PoolAbi = [
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "interestRateMode", type: "uint256" },
      { internalType: "uint16", name: "referralCode", type: "uint16" },
      { internalType: "address", name: "onBehalfOf", type: "address" },
    ],
    name: "borrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function borrowDAI(BORROW_AMOUNT) {
  // Конфигурация
  const DAI_ADDRESS = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"; // DAI
  const POOL_ADDRESS = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"; // Aave Pool для Arbitrum
  const WALLET_PRIVATE_KEY =
    ""; // Приватный ключ
  const RPC_URL = "https://arb1.arbitrum.io/rpc"; // RPC для Arbitrum
  //const BORROW_AMOUNT = ethers.parseUnits("1", 18); // Сумма для заема (в DAI)
  const INTEREST_RATE_MODE = 2; // 1 для стабильной ставки, 2 для переменной
  const REFERRAL_CODE = 0; // Реферальный код, обычно 0
  const ON_BEHALF_OF = "0x40e214a332856202b3Dd84a4E21b84a260A1b10f"; // Ваш кошелек

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

  // Подключение к пулу Aave
  const poolContract = new ethers.Contract(POOL_ADDRESS, PoolAbi, wallet);

  try {
    // Вызов функции borrow
    const tx = await poolContract.borrow(
      DAI_ADDRESS, // Адрес токена для заема (DAI)
      BORROW_AMOUNT, // Сумма для заема
      INTEREST_RATE_MODE, // Тип процентной ставки
      REFERRAL_CODE, // Реферальный код
      ON_BEHALF_OF // Кошелек, на который будет записан долг
    );

    console.log("Borrow transaction sent:", tx.hash);

    // Ожидание подтверждения транзакции
    const receipt = await tx.wait();
    console.log("Borrow transaction confirmed:", receipt.transactionHash);
  } catch (error) {
    console.error("Borrow transaction failed:", error);
  }
}

//borrowDAI(0.000000000052994772).catch(console.error);

export default borrowDAI;
