import { ethers } from "ethers";

// Провайдер для сети Arbitrum
const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");

// Адрес контракта Aave Pool на Arbitrum
const POOL_ADDRESS = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";

// ABI для метода getUserAccountData
const POOL_ABI = [
  "function getUserAccountData(address user) external view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
];

// Адрес пользователя, чей баланс вы хотите узнать
const userAddress = "0x40e214a332856202b3Dd84a4E21b84a260A1b10f";

async function getUserDAIBalance() {
  // Создаем экземпляр контракта Aave Pool
  const pool = new ethers.Contract(POOL_ADDRESS, POOL_ABI, provider);

  try {
    // Получаем данные аккаунта пользователя
    const result = await pool.getUserAccountData(userAddress);

    // Доступные данные
    const totalCollateralBase = ethers.formatUnits(
      result.totalCollateralBase,
      18
    );
    const totalDebtBase = ethers.formatUnits(result.totalDebtBase, 18);
    const availableBorrowsBase = ethers.formatUnits(
      result.availableBorrowsBase,
      18
    );
    const healthFactor = ethers.formatUnits(result.healthFactor, 18);

    console.log(`Общий залог: ${totalCollateralBase} ETH`);
    console.log(`Общий долг: ${totalDebtBase} ETH`);
    console.log(`Доступно для заимствования: ${availableBorrowsBase} ETH`);
    console.log(`Коэффициент здоровья: ${healthFactor}`);
  } catch (error) {
    console.error("Ошибка при получении данных о балансе DAI:", error);
  }
}

getUserDAIBalance();
