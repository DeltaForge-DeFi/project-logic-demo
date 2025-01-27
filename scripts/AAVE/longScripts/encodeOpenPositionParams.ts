import { ethers } from "ethers";

async function main() {
  const AAVE_OPEN_POSITION_ADDRESS = "0x89044d3053D348F1f9606C280006f12E9612cE5d";

  // Параметры для открытия позиции
  const params = {
    initialSupplyAmount: ethers.parseEther("0.0005"), // 0.0005 WETH
    borrowPercent: 50, // Занимать 50% от депозита
    cycles: 3 // Количество циклов
  };

  // Первый шаг - кодируем параметры
  const callData = ethers.AbiCoder.defaultAbiCoder().encode(
    [
      "uint256",
      "uint256",
      "uint8"
    ],
    [
      params.initialSupplyAmount,
      params.borrowPercent,
      params.cycles
    ]
  );

  // Создаем интерфейс AaveOpenPosition
  const aaveOpenPositionInterface = new ethers.Interface([
    "function executeActionDirect(bytes memory _callData) public payable",
  ]);

  // Кодируем вызов executeActionDirect с закодированными параметрами
  const executeData = aaveOpenPositionInterface.encodeFunctionData(
    "executeActionDirect",
    [callData]
  );

  console.log("\nПараметры для DSProxy:");
  console.log("Contract Address:", AAVE_OPEN_POSITION_ADDRESS);
  console.log("Execute Data:", executeData);
  
  // Дополнительная информация для проверки
  console.log("\nРасшифровка параметров:");
  console.log("Initial Supply:", ethers.formatEther(params.initialSupplyAmount), "WETH");
  console.log("Borrow Percent:", params.borrowPercent, "%");
  console.log("Cycles:", params.cycles);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 