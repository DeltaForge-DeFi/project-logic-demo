import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const AAVE_OPEN_POSITION_ADDRESS = "0x89044d3053D348F1f9606C280006f12E9612cE5d";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_ONE_RPC!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  try {
    console.log("Начинаем процесс approve токенов...");

    // Максимальное значение для approve
    const maxUint256 = ethers.MaxUint256;

    // Апрув WETH для AaveOpenPosition
    console.log("\nВыполняем approve WETH...");
    const wethContract = new ethers.Contract(
      WETH,
      ["function approve(address spender, uint256 amount) external returns (bool)"],
      wallet
    );

    const wethApproveTx = await wethContract.approve(AAVE_OPEN_POSITION_ADDRESS, maxUint256);
    await wethApproveTx.wait();
    console.log("WETH approved for AaveOpenPosition");
    console.log("Amount: MAX_UINT256");
    console.log("TX Hash:", wethApproveTx.hash);

    // Апрув DAI для AaveOpenPosition
    console.log("\nВыполняем approve DAI...");
    const daiContract = new ethers.Contract(
      DAI,
      ["function approve(address spender, uint256 amount) external returns (bool)"],
      wallet
    );

    const daiApproveTx = await daiContract.approve(AAVE_OPEN_POSITION_ADDRESS, maxUint256);
    await daiApproveTx.wait();
    console.log("DAI approved for AaveOpenPosition");
    console.log("Amount: MAX_UINT256");
    console.log("TX Hash:", daiApproveTx.hash);

    console.log("\nВсе токены успешно approved!");

  } catch (error) {
    console.error("Ошибка при выполнении approve:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 