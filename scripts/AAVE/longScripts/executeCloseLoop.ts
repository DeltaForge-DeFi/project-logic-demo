import { ethers } from "ethers";
import { createDSProxyService } from "./contractScripts/dsProxy";
import { createAaveWithdrawService } from "./contractScripts/aaveWithdraw";
import { createAavePaybackService } from "./contractScripts/aavePayback";
import { LoopingCloseService } from "./contractScripts/loopingCloseService";
import { UniswapSwapService } from "./contractScripts/uniswapSwap";
import * as dotenv from "dotenv";

dotenv.config();

// Захардкоженные адреса контрактов
const CONTRACTS = {
  AAVE_DATA_PROVIDER: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
  WITHDRAW_GATEWAY: "0x570BfB7A185EFa93d54b06348a9eB69F6bd94ec3",
  PAYBACK_GATEWAY: "0xa87756d654e2fdd980C385e0D6f28b534cAf662e",
  UNISWAP_ROUTER: "0xFEDE19F4F8979cc16CB9Cfc1Ca170C3dA32a5387",
  WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
};

async function main() {
  if (!process.env.PRIVATE_KEY || !process.env.ARBITRUM_ONE_RPC) {
    throw new Error("Необходимо указать PRIVATE_KEY и ARBITRUM_ONE_RPC в .env файле");
  }

  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_ONE_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const dsProxyService = createDSProxyService("arbitrum_one", wallet);
  const aaveWithdrawService = createAaveWithdrawService(
    CONTRACTS.WITHDRAW_GATEWAY,
    dsProxyService,
    wallet
  );
  const aavePaybackService = createAavePaybackService(
    CONTRACTS.PAYBACK_GATEWAY,
    dsProxyService,
    wallet
  );

  const uniswapService = new UniswapSwapService(
    CONTRACTS.UNISWAP_ROUTER,
    dsProxyService,
    wallet
  );

  const loopingCloseService = new LoopingCloseService(
    aaveWithdrawService,
    aavePaybackService,
    uniswapService,
    dsProxyService,
    wallet,
    CONTRACTS.AAVE_DATA_PROVIDER
  );

  try {
    const result = await loopingCloseService.executeCloseLoop({
      cycles: 3,
      rateMode: 2, // Variable rate
      minHealthFactor: 1.05,
    });

    console.log("Оставшийся долг WETH:", ethers.formatEther(result));
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 