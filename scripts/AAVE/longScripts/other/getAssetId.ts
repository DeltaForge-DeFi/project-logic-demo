import { ethers } from "ethers";

// ABI для метода getReserveList из контракта Pool
const PoolAbi = [
  {
    inputs: [],
    name: "getReservesList",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
];

// ABI для получения символов токенов
const ERC20Abi = [
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];

async function getAssetsAndIds() {
  const RPC_URL = "https://arb1.arbitrum.io/rpc"; // RPC URL для сети Arbitrum
  const POOL_ADDRESS = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"; // Адрес пула Aave

  // Настройка провайдера
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // Подключение к пулу
  const poolContract = new ethers.Contract(POOL_ADDRESS, PoolAbi, provider);

  try {
    // Получение списка адресов резервов
    const reserves = await poolContract.getReservesList();
    console.log(`Found ${reserves.length} reserves:`);

    // Инициализация списка токенов
    const tokenDetails: { assetId: number; address: string; symbol: string }[] =
      [];

    for (let i = 0; i < reserves.length; i++) {
      const tokenAddress = reserves[i];
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20Abi,
        provider
      );

      // Получение символа токена
      const symbol = await tokenContract.symbol();

      tokenDetails.push({
        assetId: i,
        address: tokenAddress,
        symbol,
      });
    }

    // Печать токенов с assetId
    console.log("Token details:");
    tokenDetails.forEach((token) =>
      console.log(
        `AssetId: ${token.assetId}, Address: ${token.address}, Symbol: ${token.symbol}`
      )
    );

    return tokenDetails;
  } catch (error) {
    console.error("Error fetching assets and ids:", error);
  }
}

getAssetsAndIds().catch(console.error);
