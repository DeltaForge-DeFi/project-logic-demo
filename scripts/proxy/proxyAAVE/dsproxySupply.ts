import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

// ABI для DSProxy
const dsProxyAbi = [
  "function execute(address _target, bytes _data) public payable returns (bytes memory response)",
  // Добавьте другие необходимые функции ABI, если требуется
];

// ABI для AaveSupply
const aaveSupplyAbi = [
  "function executeActionDirect(bytes memory _callData) public payable",
  // Добавьте другие необходимые функции ABI, если требуется
];

// ABI для ERC-20 токена
const erc20Abi = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  // Добавьте другие необходимые функции ABI, если требуется
];

// Адреса контрактов
const dsProxyAddress = "0xDd06e3d838CF0ADd69838476993F42B7fE28d605";
const aaveSupplyAddress = "0xfC0116CC89C50496De9566c732498444670402a7";
const lendingPoolAddress = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"; // Например, для Aave V2 на Ethereum
const tokenAddress = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"; // Замените на адрес вашего токена

// Параметры для supply
const amount = ethers.parseUnits("0.5", 6); // 2 токена с 18 десятичными знаками
const from = "0x8594169c6E19C7912448827BE6c8BC16A6A32419";
const assetId = 0; // Идентификатор актива в Aave
const onBehalf = "0x8594169c6E19C7912448827BE6c8BC16A6A32419"; // Если вы хотите сделать supply от имени другого пользователя

async function main() {
  // Настройка провайдера
  const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");

  // Настройка кошелька
  const privateKey = process.env.PRIVATE_KEY!; // Замените на ваш закрытый ключ
  const wallet = new ethers.Wallet(privateKey, provider);

  // Создание экземпляра контракта токена
  const tokenContract = new ethers.Contract("0xaf88d065e77c8cC2239327C5EDb3A432268e5831", erc20Abi, wallet);

  // Проверка текущего разрешения (allowance) для DSProxy
  const currentAllowance = await tokenContract.allowance(from, dsProxyAddress);
  console.log(`Текущее разрешение для DSProxy: ${currentAllowance.toString()}`);

  // Если текущее разрешение меньше необходимого, устанавливаем новое
  if (currentAllowance < amount) {
    const approveTx = await tokenContract.approve(dsProxyAddress, amount);
    console.log("Транзакция approve отправлена:", approveTx.hash);
    await approveTx.wait();
    console.log("Транзакция approve подтверждена.");
  } else {
    console.log("Достаточное разрешение уже установлено.");
  }

  // Создание экземпляров контрактов
  const dsProxy = new ethers.Contract(dsProxyAddress, dsProxyAbi, wallet);
  const aaveSupply = new ethers.Contract(
    aaveSupplyAddress,
    aaveSupplyAbi,
    wallet
  );

  // Подготовка данных для вызова executeActionDirect
  const params = {
    initialSupplyAmount: amount,
    borrowPercent: "59",
    cycles: 2,
  };

  const callData = ethers.AbiCoder.defaultAbiCoder().encode(
    [
      "uint256",
      "uint256",
      "uint8",
    ],
    [
      params.initialSupplyAmount,
      params.borrowPercent,
      params.cycles,
    ]
  );

  // Подготовка данных для вызова execute
  const executeData = aaveSupply.interface.encodeFunctionData(
    "executeActionDirect",
    [callData]
  );

  // Выполнение вызова через DSProxy
  const tx = await dsProxy.execute(aaveSupplyAddress, executeData);
  console.log("Транзакция отправлена:", tx.hash);

  // Ожидание подтверждения транзакции
  const receipt = await tx.wait();
  console.log("Транзакция подтверждена в блоке:", receipt.blockNumber);
}

main().catch((error) => {
  console.error("Ошибка при выполнении supply через DSProxy:", error);
});
