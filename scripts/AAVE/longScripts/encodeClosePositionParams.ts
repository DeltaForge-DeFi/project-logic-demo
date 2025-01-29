import { ethers } from "ethers";

async function main() {
  const AAVE_CLOSE_POSITION_ADDRESS = "0xe3e8640AE461ee3a3D34c5926Cf6f85f93786784"; // Адрес задеплоенного контракта AaveClosePosition

  try {
    console.log("Кодируем данные для закрытия позиции...");

    // Первый шаг - кодируем пустые параметры
    const callData = ethers.AbiCoder.defaultAbiCoder().encode(
      [], // пустой массив типов
      [] // пустой массив значений
    );

    // Создаем интерфейс AaveClosePosition
    const aaveClosePositionInterface = new ethers.Interface([
      "function executeActionDirect(bytes memory _callData) public payable",
    ]);

    // Кодируем вызов executeActionDirect с закодированными параметрами
    const executeData = aaveClosePositionInterface.encodeFunctionData(
      "executeActionDirect",
      [callData]
    );

    console.log("\nПараметры для DSProxy:");
    console.log("Contract Address:", AAVE_CLOSE_POSITION_ADDRESS);
    console.log("Execute Data:", executeData);

  } catch (error) {
    console.error("Ошибка при кодировании данных:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 