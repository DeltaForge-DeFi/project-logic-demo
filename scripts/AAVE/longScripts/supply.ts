import { ethers } from "ethers";
import { createDSProxyService } from "./contractScripts/dsProxy";
import { createAaveSupplyService } from "./contractScripts/aaveSupply";
import { assets } from "../../../source/AAVE/config/assets";
import { ERC20_ABI } from "../../../source/AAVE/abis/erc20";
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

  // Используем DAI по индексу 0
  const daiAsset = assets[0];

  const daiContract = new ethers.Contract(daiAsset.address, ERC20_ABI, wallet);

  const balance = await daiContract.balanceOf(wallet.address);
  console.log("Баланс DAI:", ethers.formatUnits(balance, 18)); // DAI всегда имеет 18 decimals

  const dsProxyService = createDSProxyService("arbitrum_one", wallet);
  const aaveSupplyService = createAaveSupplyService(dsProxyService);

  const amount = ethers.parseUnits("0.0005", 18);
  const dsProxyAddress = await dsProxyService.getContractAddress();

  // Проверяем текущий allowance
  const currentAllowance = await daiContract.allowance(
    wallet.address,
    dsProxyAddress
  );

  if (currentAllowance < amount) {
    console.log("Выполняем approve...");
    const approveTx = await daiContract.approve(dsProxyAddress, amount);
    await approveTx.wait();
    console.log("Approve выполнен");
  } else {
    console.log("Достаточный allowance уже установлен");
  }

  const supplyParams = {
    amount: amount.toString(),
    from: wallet.address,
    assetId: 0, // DAI всегда имеет id = 0
    enableAsColl: true,
    useDefaultMarket: true,
    useOnBehalf: false,
    market: ethers.ZeroAddress,
    onBehalf: ethers.ZeroAddress,
  };

  try {
    console.log("Начинаем supply DAI...");
    console.log("Параметры:", supplyParams);

    const tx = await aaveSupplyService.supply(supplyParams);
    console.log("Транзакция отправлена:", tx.hash);

    const receipt = await tx.wait();
    if (receipt) {
      console.log("Транзакция подтверждена в блоке:", receipt.blockNumber);
      console.log("Хэш транзакции:", receipt.hash);
      console.log("Использовано газа:", receipt.gasUsed.toString());
    }
  } catch (error) {
    console.error("Ошибка при выполнении supply:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
