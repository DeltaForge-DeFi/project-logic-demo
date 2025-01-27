import { ethers } from "ethers";

// ABI для пула Aave, включая функцию repay
const PoolAbi = [
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "interestRateMode", type: "uint256" },
      { internalType: "address", name: "onBehalfOf", type: "address" },
    ],
    name: "repay",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// ABI для ERC20 (DAI)
const ERC20Abi = [
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

const WALLET_PRIVATE_KEY =
  ""; // Приватный ключ
const RPC_URL = "https://arb1.arbitrum.io/rpc"; // RPC для Arbitrum
const provider = new ethers.JsonRpcProvider(RPC_URL);

const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

async function repayDAI(REPAY_AMOUNT) {
  // Конфигурация
  const DAI_ADDRESS = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"; // DAI
  const POOL_ADDRESS = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"; // Aave Pool для Arbitrum
  const WALLET_PRIVATE_KEY =
    "0x73f8ec57687cbb8045dde56e1137e5ab48a3c6960b34a5d4c5fa9d03fdb2b4f5"; // Замените на ваш приватный ключ
  const RPC_URL = "https://arb1.arbitrum.io/rpc"; // RPC для Arbitrum
  //   const REPAY_AMOUNT = ethers.parseUnits("1", 18); // Сумма для погашения (в DAI)
  const INTEREST_RATE_MODE = 2; // 1 для стабильной ставки, 2 для переменной
  const ON_BEHALF_OF = "0x40e214a332856202b3Dd84a4E21b84a260A1b10f"; // Адрес, за который вы погашаете долг

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

  // Подключение к контракту DAI
  const daiContract = new ethers.Contract(DAI_ADDRESS, ERC20Abi, wallet);

  // Проверка баланса DAI
  const daiBalance = await daiContract.balanceOf(wallet.address);
  console.log(`DAI Balance: ${ethers.formatUnits(daiBalance, 18)} DAI`);

  if (daiBalance < REPAY_AMOUNT) {
    throw new Error("Недостаточно баланса DAI для погашения займа.");
  }

  // Одобрение пула Aave на использование ваших DAI
  try {
    const approveTx = await daiContract.approve(POOL_ADDRESS, REPAY_AMOUNT);
    console.log("Approve transaction sent:", approveTx.hash);

    // Ожидание подтверждения транзакции
    await approveTx.wait();
    console.log("Approve transaction confirmed.");
  } catch (error) {
    console.error("Approve transaction failed:", error);
    return;
  }

  // Подключение к пулу Aave
  const poolContract = new ethers.Contract(POOL_ADDRESS, PoolAbi, wallet);

  try {
    // Вызов функции repay
    const tx = await poolContract.repay(
      DAI_ADDRESS, // Адрес токена для погашения (DAI)
      REPAY_AMOUNT, // Сумма для погашения
      INTEREST_RATE_MODE, // Тип процентной ставки
      ON_BEHALF_OF // Кошелек, за который вы погашаете долг
    );

    console.log("Repay transaction sent:", tx.hash);

    // Ожидание подтверждения транзакции
    const receipt = await tx.wait();
    console.log("Repay transaction confirmed:", receipt.transactionHash);
  } catch (error) {
    console.error("Repay transaction failed:", error);
  }
}

// repayDAI().catch(console.error);

export default repayDAI;
