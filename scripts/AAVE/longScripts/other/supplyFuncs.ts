import { ethers } from "ethers";

// ABI для AaveSupply
const AaveSupplyAbi = [
  {
    inputs: [{ internalType: "bytes", name: "_callData", type: "bytes" }],
    name: "executeActionDirect",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// ABI для Pool Address Provider
const PoolAddressesProviderAbi = [
  {
    inputs: [],
    name: "getPool",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

// ABI для ERC20 токенов (например, DAI)
const ERC20Abi = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
];

async function depositOneDaiArbitrum() {
  // Конфигурация
  const DAI_ADDRESS = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"; // Адрес DAI для сети Arbitrum
  const POOL_PROVIDER_ADDRESS = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"; // Адрес Pool Address Provider для Arbitrum
  const AAVE_SUPPLY_ADDRESS = "0x755d8133E1688b071Ec4ac73220eF7f70BC6992F"; // Адрес вашего контракта AaveSupply
  const RPC_URL = "https://arb1.arbitrum.io/rpc"; // RPC URL для сети Arbitrum
  const WALLET_PRIVATE_KEY =
    ""; // Приватный ключ
  const DAI_AMOUNT = ethers.parseUnits("1", 18); // 1 DAI (18 знаков после запятой)

  // Настройка провайдера и кошелька
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

  // Подключение к Pool Address Provider
  const poolAddressesProvider = new ethers.Contract(
    POOL_PROVIDER_ADDRESS,
    PoolAddressesProviderAbi,
    provider
  );

  // Получение адреса пула
  const poolAddress = await poolAddressesProvider.getPool();
  console.log(`Pool Address: ${poolAddress}`);

  // Подключение к контракту AaveSupply
  const aaveSupply = new ethers.Contract(
    AAVE_SUPPLY_ADDRESS,
    AaveSupplyAbi,
    wallet
  );

  // Подключение к контракту DAI
  const daiContract = new ethers.Contract(DAI_ADDRESS, ERC20Abi, wallet);

  // Шаг 1: Проверяем баланс DAI
  const daiBalance = await daiContract.balanceOf(wallet.address);
  console.log(`DAI Balance: ${ethers.formatUnits(daiBalance, 18)} DAI`);

  // Проверяем, достаточно ли DAI
  if (BigInt(daiBalance) < BigInt(DAI_AMOUNT)) {
    throw new Error("Insufficient DAI balance for deposit.");
  }

  // Шаг 2: Одобряем контракт AaveSupply на перевод DAI
  const approveTx = await daiContract.approve(AAVE_SUPPLY_ADDRESS, DAI_AMOUNT);
  console.log("Approval transaction sent:", approveTx.hash);
  await approveTx.wait();
  console.log("DAI approved successfully.");

  // Шаг 3: Формируем callData для депозита с возвратом aDAI на ваш кошелек
  const callData = ethers.AbiCoder.defaultAbiCoder().encode(
    [
      "uint256",
      "address",
      "uint16",
      "bool",
      "bool",
      "bool",
      "address",
      "address",
    ],
    [
      DAI_AMOUNT, // Сумма для депозита
      wallet.address, // Отправитель
      0, // assetId (например, DAI = 1, уточните в вашем контракте)
      false, // enableAsColl (не используем как залог)
      true, // useDefaultMarket (используем рынок по умолчанию)
      true, // useOnBehalf (переводим токены aDAI на указанный адрес)
      poolAddress, // Адрес пула
      wallet.address, // Ваш адрес, куда будут отправлены aDAI
    ]
  );

  // Шаг 4: Выполняем транзакцию депозита
  try {
    const tx = await aaveSupply.executeActionDirect(callData);
    console.log("Deposit transaction sent:", tx.hash);

    // Ожидание подтверждения
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.hash);
  } catch (error) {
    console.error("Deposit transaction failed:", error);
  }
}

depositOneDaiArbitrum().catch(console.error);
