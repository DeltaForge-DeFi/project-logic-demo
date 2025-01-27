import { ethers } from "ethers";
import { UniswapSwapService } from "./contractScripts/uniswapSwap";
import { createDSProxyService } from "./contractScripts/dsProxy";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  if (!process.env.PRIVATE_KEY || !process.env.ARBITRUM_ONE_RPC) {
    throw new Error(
      "Необходимо указать PRIVATE_KEY и ARBITRUM_ONE_RPC в .env файле"
    );
  }

  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_ONE_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Адреса для mainnet
  const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
  const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
  const UNISWAP_SWAP_ADDRESS = "0xFEDE19F4F8979cc16CB9Cfc1Ca170C3dA32a5387";
  const DS_PROXY_ADDRESS = "0xDd06e3d838CF0ADd69838476993F42B7fE28d605";

  // Инициализация сервисов
  const dsProxyService = createDSProxyService("arbitrum_one", wallet);
  const uniswapService = new UniswapSwapService(
    UNISWAP_SWAP_ADDRESS,
    dsProxyService
  );

  const amountIn = ethers.parseEther("0.0006");
  const dsProxyAddress = await dsProxyService.getContractAddress();

  // Контракты токенов
  const wethContract = new ethers.Contract(
    WETH,
    [
      "function deposit() external payable",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)",
    ],
    wallet
  );

  const daiContract = new ethers.Contract(
    DAI,
    [
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)",
    ],
    wallet
  );

  // Проверяем и делаем approve для WETH
  const wethAllowance = await wethContract.allowance(
    wallet.address,
    dsProxyAddress
  );
  if (wethAllowance < amountIn) {
    console.log("Выполняем approve WETH...");
    const wethApproveTx = await wethContract.approve(
      dsProxyAddress,
      ethers.MaxUint256
    );
    await wethApproveTx.wait();
    console.log("WETH approve выполнен");
  }

  // Проверяем и делаем approve для DAI
  const daiAllowance = await daiContract.allowance(
    wallet.address,
    dsProxyAddress
  );
  if (daiAllowance < amountIn) {
    console.log("Выполняем approve DAI...");
    const daiApproveTx = await daiContract.approve(
      dsProxyAddress,
      ethers.MaxUint256
    );
    await daiApproveTx.wait();
    console.log("DAI approve выполнен");
  }

  // Оборачиваем ETH в WETH
  //   console.log("Оборачиваем ETH в WETH...");
  //   const wrapTx = await wethContract.deposit({ value: amountIn });
  //   await wrapTx.wait();
  //   console.log("ETH успешно обернут в WETH");

  const swapParams = {
    tokenIn: WETH,
    tokenOut: DAI,
    fee: 3000,
    recipient: await wallet.getAddress(),
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
    pullTokens: true,
  };

  try {
    console.log("Начинаем свап...");
    const tx = await uniswapService.swap(swapParams);

    console.log("Ожидаем подтверждение транзакции...");
    const receipt = await tx.wait();

    console.log("Свап успешно выполнен!");
    console.log("Хэш транзакции:", receipt.hash);
  } catch (error) {
    console.error("Ошибка при выполнении свапа:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
