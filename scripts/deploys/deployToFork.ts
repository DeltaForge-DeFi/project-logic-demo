import { ethers } from "hardhat";

async function main() {
  console.log("Начинаем деплой контрактов в форк...");

  // Получаем аккаунты
  const [deployer] = await ethers.getSigners();
  console.log(`Деплой с аккаунта: ${deployer.address}`);
  console.log(`Баланс аккаунта: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`);

  // 1. Деплой TestImplementation
  console.log("Деплой TestImplementation...");
  const TestImplementationFactory = await ethers.getContractFactory("TestImplementation");
  const implementation = await TestImplementationFactory.deploy();
  await implementation.waitForDeployment();
  console.log(`TestImplementation задеплоен по адресу: ${await implementation.getAddress()}`);

  // 2. Деплой UpgradeableBeacon
  console.log("Деплой UpgradeableBeacon...");
  const UpgradeableBeaconFactory = await ethers.getContractFactory("UpgradeableBeacon");
  const beacon = await UpgradeableBeaconFactory.deploy(
    await implementation.getAddress(),
    deployer.address
  );
  await beacon.waitForDeployment();
  console.log(`UpgradeableBeacon задеплоен по адресу: ${await beacon.getAddress()}`);

  // 3. Подготовка данных для инициализации
  console.log("Подготовка данных для инициализации...");
  const initData = TestImplementationFactory.interface.encodeFunctionData("initialize", ["V1"]);

  // 4. Деплой BeaconProxy
  console.log("Деплой BeaconProxy...");
  const BeaconProxyFactory = await ethers.getContractFactory("BeaconProxy");
  const proxy = await BeaconProxyFactory.deploy(
    await beacon.getAddress(),
    initData
  );
  await proxy.waitForDeployment();
  console.log(`BeaconProxy задеплоен по адресу: ${await proxy.getAddress()}`);

  // 5. Создаем экземпляр контракта через прокси
  const proxiedImplementation = await ethers.getContractAt(
    "TestImplementation",
    await proxy.getAddress()
  );

  // 6. Проверяем, что инициализация прошла успешно
  const version = await proxiedImplementation.getVersion();
  console.log(`Версия имплементации: ${version}`);

  // 7. Устанавливаем значение через прокси
  const tx = await proxiedImplementation.setValue(42);
  await tx.wait();
  const value = await proxiedImplementation.getValue();
  console.log(`Установленное значение: ${value}`);

  // 8. Проверяем адрес имплементации
  const implAddress = await proxiedImplementation.getImplementationAddress();
  console.log(`Адрес имплементации через прокси: ${implAddress}`);
  console.log(`Ожидаемый адрес имплементации: ${await implementation.getAddress()}`);

  // Сохраняем адреса для последующего использования
  console.log("\nАдреса для обновления:");
  console.log(`IMPLEMENTATION_ADDRESS=${await implementation.getAddress()}`);
  console.log(`BEACON_ADDRESS=${await beacon.getAddress()}`);
  console.log(`PROXY_ADDRESS=${await proxy.getAddress()}`);

  console.log("\nДеплой завершен успешно!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 