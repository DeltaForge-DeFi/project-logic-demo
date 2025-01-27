import { ethers } from "hardhat";

async function main() {
  console.log("Deploying AaveClosePosition contract...");

  // Получаем фабрику контракта
  const AaveClosePosition = await ethers.getContractFactory("AaveClosePosition");

  // Деплоим контракт
  const aaveClosePosition = await AaveClosePosition.deploy();

  // Ждем завершения деплоя
  await aaveClosePosition.waitForDeployment();

  const aaveClosePositionAddress = await aaveClosePosition.getAddress();
  console.log("AaveClosePosition deployed to:", aaveClosePositionAddress);


  console.log("Deployment completed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 