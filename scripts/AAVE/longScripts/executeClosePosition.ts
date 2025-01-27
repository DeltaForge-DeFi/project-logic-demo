import { ethers } from "ethers";
import { createDSProxyService } from "./contractScripts/dsProxy";
import * as dotenv from "dotenv";

dotenv.config();

const AAVE_CLOSE_POSITION_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_ONE_RPC!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  
  const dsProxyService = createDSProxyService("arbitrum_one", wallet);

  try {
    console.log("Начинаем закрытие позиции...");

    // Создаем интерфейс для вызова executeActionDirect
    const aaveClosePositionInterface = new ethers.Interface([
      "function executeActionDirect(bytes memory _callData) public payable",
    ]);

    // Кодируем вызов executeActionDirect (пустые параметры, так как все захардкожено)
    const executeData = aaveClosePositionInterface.encodeFunctionData(
      "executeActionDirect",
      ["0x"]
    );

    // Выполняем через DSProxy
    console.log("Выполняем транзакцию через DSProxy...");
    const tx = await dsProxyService.executeTarget(
      AAVE_CLOSE_POSITION_ADDRESS,
      executeData
    );

    console.log("Транзакция отправлена:", tx.hash);
    const receipt = await tx.wait();
    console.log("Транзакция подтверждена:", receipt?.hash);

    console.log("Позиция успешно закрыта!");
  } catch (error) {
    console.error("Ошибка при закрытии позиции:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 