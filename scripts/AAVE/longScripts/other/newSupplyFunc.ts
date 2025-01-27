import { ethers } from "ethers";

// ABI для пула Aave, включая функцию supply
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

async function supplyDAI(SUPPLY_AMOUNT) {
  // Конфигурация
  const DAI_ADDRESS = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"; // DAI
  const POOL_ADDRESS = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"; // Aave Pool для Arbitrum
  const WALLET_PRIVATE_KEY =
    ""; // Замените на ваш приватный ключ
  const RPC_URL = "https://arb1.arbitrum.io/rpc"; // RPC для Arbitrum
  //const SUPPLY_AMOUNT = ethers.parseUnits("1", 18); // Сумма для внесения (в DAI)
  const REFERRAL_CODE = 0; // Реферальный код, обычно 0
  const ON_BEHALF_OF = "0x40e214a332856202b3Dd84a4E21b84a260A1b10f"; // Ваш кошелек

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

  // Подключение к контракту DAI
  const daiContract = new ethers.Contract(DAI_ADDRESS, ERC20Abi, wallet);

  // Проверка баланса DAI
  const daiBalance = await daiContract.balanceOf(wallet.address);
  console.log(`DAI Balance: ${ethers.formatUnits(daiBalance, 18)} DAI`);

  if (daiBalance < SUPPLY_AMOUNT) {
    throw new Error("Недостаточно DAI для внесения в пул Aave.");
  }

  // Одобрение пула Aave на использование ваших DAI
  try {
    const approveTx = await daiContract.approve(POOL_ADDRESS, SUPPLY_AMOUNT);
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
    // Вызов функции supply
    const tx = await poolContract.supply(
      DAI_ADDRESS, // Адрес токена для внесения (DAI)
      SUPPLY_AMOUNT, // Сумма для внесения
      ON_BEHALF_OF, // Кошелек, на который будут записаны aToken
      REFERRAL_CODE // Реферальный код
    );

    console.log("Supply transaction sent:", tx.hash);

    // Ожидание подтверждения транзакции
    const receipt = await tx.wait();
    console.log("Supply transaction confirmed:", receipt.transactionHash);
  } catch (error) {
    console.error("Supply transaction failed:", error);
  }
}

//supplyDAI().catch(console.error);

export default supplyDAI;
