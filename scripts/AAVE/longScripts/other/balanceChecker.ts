import { ethers } from "ethers";

// ABI для ERC20 токенов
const ERC20Abi = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

async function checkAaveSupplyContractBalance() {
  // Конфигурация
  const TOKEN_ADDRESS = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"; // Адрес DAI на Arbitrum
  const AAVE_SUPPLY_CONTRACT_ADDRESS =
    "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"; // Адрес контракта AaveSupply
  const RPC_URL = "https://arb1.arbitrum.io/rpc"; // RPC для Arbitrum

  // Настройка провайдера
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // Подключение к контракту токена
  const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20Abi, provider);

  try {
    // Получение баланса токенов на контракте AaveSupply
    const balance = await tokenContract.balanceOf(AAVE_SUPPLY_CONTRACT_ADDRESS);
    console.log(
      `Balance of token ${TOKEN_ADDRESS} on AaveSupply contract: ${ethers.formatUnits(
        balance,
        18
      )} tokens`
    );
  } catch (error) {
    console.error("Error checking balance:", error);
  }
}

checkAaveSupplyContractBalance().catch(console.error);
