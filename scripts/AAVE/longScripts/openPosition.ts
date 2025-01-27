import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { createDSProxyService } from "./contractScripts/dsProxy";
import { createAaveOpenPositionService } from "./contractScripts/aaveOpenPosition";

dotenv.config();

const AAVE_OPEN_POSITION_ADDRESS = "0x1bEB0301a426BED729cA80343bf950Ad37cD1f0d";
const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const UNISWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_ONE_RPC!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const dsProxyService = createDSProxyService("arbitrum_one", wallet);
  const aaveOpenPositionService = createAaveOpenPositionService(
    AAVE_OPEN_POSITION_ADDRESS,
    dsProxyService,
    wallet
  );

  try {
    console.log("Начинаем открытие leveraged позиции...");

    const dsProxyAddress = await dsProxyService.getContractAddress();
    console.log("DSProxy address:", dsProxyAddress);

    // Апрув WETH для DSProxy
    console.log("Выполняем approve WETH...");
    const wethContract = new ethers.Contract(
      WETH,
      ["function approve(address spender, uint256 amount) external returns (bool)"],
      wallet
    );

    // Апрув на начальный депозит (0.0005 WETH)
    const initialAmount = ethers.parseEther("0.0005"); // 0.0005 WETH
    const approveTx = await wethContract.approve(dsProxyAddress, initialAmount);
    await approveTx.wait();
    console.log("WETH approved for initial deposit");

    // Апрув DAI для контракта AaveOpenPosition (для свапов)
    console.log("Выполняем approve DAI...");
    const daiContract = new ethers.Contract(
      DAI,
      ["function approve(address spender, uint256 amount) external returns (bool)"],
      wallet
    );

    // Апрув на 0.03 DAI (0.01 DAI на каждый цикл)
    const daiAmount = ethers.parseEther("0.03"); // 3 цикла по 0.01 DAI
    const daiApproveTx = await daiContract.approve(AAVE_OPEN_POSITION_ADDRESS, daiAmount);
    await daiApproveTx.wait();
    console.log("DAI approved for swaps");

    // Апрув DAI для Uniswap Router
    console.log("Выполняем approve DAI для Uniswap...");
    const daiApproveTxUniswap = await daiContract.approve(
      UNISWAP_ROUTER,
      daiAmount
    );
    await daiApproveTxUniswap.wait();
    console.log("DAI approved for Uniswap Router");

    // Параметры для открытия позиции
    const params = {
        initialSupplyAmount: ethers.parseEther("0.0005"), // 0.0005 WETH
        borrowPercent: 50, // Занимать 50% от депозита
        cycles: 3 // Количество циклов
    };

    // Кодируем параметры
    const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
        ["tuple(uint256 initialSupplyAmount, uint256 borrowPercent, uint8 cycles)"],
        [params]
    );

    // Выполняем основную транзакцию
    console.log("Выполняем основную транзакцию...");
    const tx = await aaveOpenPositionService.openPosition({
        callData: encodedParams
    });

    console.log("Транзакция отправлена:", tx.hash);
    const receipt = await tx.wait();
    console.log("Транзакция подтверждена:", receipt?.hash);

    console.log("Leveraged позиция успешно открыта!");
  } catch (error) {
    console.error("Ошибка при открытии позиции:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 