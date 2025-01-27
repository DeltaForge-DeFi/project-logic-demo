import { ethers } from "ethers";

// ABI для пула Aave
const PoolAbi = [
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "withdraw",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// ABI для ERC20 (aDAI)
const ERC20Abi = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

async function withdrawDAI(WITHDRAW_AMOUNT) {
  // Конфигурация
  const ADAI_ADDRESS = "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE"; // aDAI
  const DAI_ADDRESS = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"; // DAI
  const POOL_ADDRESS = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"; // Aave Pool для Arbitrum
  const WALLET_PRIVATE_KEY =
    ""; // Приватный ключ
  const RPC_URL = "https://arb1.arbitrum.io/rpc"; // RPC для Arbitrum
  const RECEIVER_ADDRESS = "0x40e214a332856202b3Dd84a4E21b84a260A1b10f"; // Ваш кошелек
  // const WITHDRAW_AMOUNT = ethers.parseUnits("1", 18); // Сумма для вывода (в DAI)

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

  // Подключение к контракту aDAI
  const aDaiContract = new ethers.Contract(ADAI_ADDRESS, ERC20Abi, wallet);

  // Проверка баланса aDAI
  const aDaiBalance = await aDaiContract.balanceOf(wallet.address);
  console.log(`aDAI Balance: ${ethers.formatUnits(aDaiBalance, 18)} aDAI`);

  if (aDaiBalance < WITHDRAW_AMOUNT) {
    throw new Error(
      "Insufficient aDAI balance. Adjust the amount to withdraw."
    );
  }

  // Подключение к пулу Aave
  const poolContract = new ethers.Contract(POOL_ADDRESS, PoolAbi, wallet);

  try {
    // Вызов функции withdraw
    const tx = await poolContract.withdraw(
      DAI_ADDRESS, // Адрес токена для вывода (DAI)
      WITHDRAW_AMOUNT, // Сумма для вывода
      RECEIVER_ADDRESS // Кошелек, на который будет отправлен DAI
    );

    console.log("Withdraw transaction sent:", tx.hash);

    // Ожидание подтверждения транзакции
    const receipt = await tx.wait();
    console.log("Withdraw transaction confirmed:", receipt.transactionHash);
  } catch (error) {
    console.error("Withdraw transaction failed:", error);
  }
}

// withdrawDAI().catch(console.error);

export default withdrawDAI;
