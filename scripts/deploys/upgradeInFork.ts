import { ethers } from "hardhat";

// Адреса из предыдущего деплоя (замените на ваши)
const BEACON_ADDRESS = "0x..."; // Скопируйте из вывода предыдущего скрипта
const PROXY_ADDRESS = "0x...";  // Скопируйте из вывода предыдущего скрипта

async function main() {
  console.log("Начинаем обновление имплементации в форке...");

  // Получаем аккаунты
  const [deployer] = await ethers.getSigners();
  console.log(`Обновление с аккаунта: ${deployer.address}`);

  // 1. Деплой TestImplementationV2
  console.log("Деплой TestImplementationV2...");
  const TestImplementationV2Factory = await ethers.getContractFactory("TestImplementationV2");
  const implementationV2 = await TestImplementationV2Factory.deploy();
  await implementationV2.waitForDeployment();
  console.log(`TestImplementationV2 задеплоен по адресу: ${await implementationV2.getAddress()}`);

  // 2. Обновление Beacon
  console.log("Обновление Beacon...");
  const beacon = await ethers.getContractAt("UpgradeableBeacon", BEACON_ADDRESS);
  const tx = await beacon.upgradeTo(await implementationV2.getAddress());
  await tx.wait();
  console.log("Beacon обновлен!");

  // 3. Проверка обновления через прокси
  const proxiedImplementation = await ethers.getContractAt(
    "TestImplementationV2",
    PROXY_ADDRESS
  );

  // 4. Проверяем версию
  const version = await proxiedImplementation.getVersion();
  console.log(`Новая версия имплементации: ${version}`); // Должно быть "V2"

  // 5. Проверяем новую функциональность
  await proxiedImplementation.setAdditionalData("Тестовые данные V2");
  const additionalData = await proxiedImplementation.getAdditionalData();
  console.log(`Дополнительные данные: ${additionalData}`);

  // 6. Проверяем, что старые данные сохранились
  const value = await proxiedImplementation.getValue();
  console.log(`Сохраненное значение: ${value}`); // Должно быть 42

  console.log("Обновление завершено успешно!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 