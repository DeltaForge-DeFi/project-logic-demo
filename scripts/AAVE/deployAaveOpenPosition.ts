import { ethers } from "hardhat";

async function main() {
  console.log("Deploying AaveOpenPosition contract...");

  // Получаем фабрику контракта
  const AaveOpenPosition = await ethers.getContractFactory("AaveOpenPosition");

  // Деплоим контракт
  const aaveOpenPosition = await AaveOpenPosition.deploy();

  // Ждем завершения деплоя
  await aaveOpenPosition.waitForDeployment();

  const aaveOpenPositionAddress = await aaveOpenPosition.getAddress();
  console.log("AaveOpenPosition deployed to:", aaveOpenPositionAddress);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 