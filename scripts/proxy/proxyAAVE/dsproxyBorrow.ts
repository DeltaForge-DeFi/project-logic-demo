import { ethers } from "ethers";

// ABI для DSProxy
const dsProxyAbi = [
  "function execute(address _target, bytes _data) public payable returns (bytes memory response)",
  // Добавьте другие необходимые функции ABI, если требуется
];

// ABI для AaveBorrow
const aaveBorrowAbi = [
  "function executeActionDirect(bytes memory _callData) public payable",
  // Добавьте другие необходимые функции ABI, если требуется
];

// Адреса контрактов
const dsProxyAddress = "0x96e8c7ccf8f306a24cb9f982bba7b04454cf0638";
const aaveBorrowAddress = "0x89D9fcb5abe53fb0751a564C45cd23B3011058F7";

// Параметры для заимствования
const amount = ethers.parseUnits("1", 18); // 100 токенов с 18 десятичными знаками
const to = "0x8594169c6E19C7912448827BE6c8BC16A6A32419";
const rateMode = 2; // 1 для фиксированной ставки, 2 для переменной
const assetId = 0; // Идентификатор актива в Aave
const useDefaultMarket = false;
const useOnBehalf = false;
const market = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"; // Укажите, если не используется рынок по умолчанию
const onBehalf = "0x8594169c6E19C7912448827BE6c8BC16A6A32419"; // Укажите, если заимствование от имени другого пользователя

async function main() {
  // Настройка провайдера
  const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");

  // Настройка кошелька
  const privateKey =
    "";
  const wallet = new ethers.Wallet(privateKey, provider);

  // Создание экземпляров контрактов
  const dsProxy = new ethers.Contract(dsProxyAddress, dsProxyAbi, wallet);
  const aaveBorrow = new ethers.Contract(
    aaveBorrowAddress,
    aaveBorrowAbi,
    wallet
  );

  // Подготовка данных для вызова executeActionDirect
  const params = {
    amount: amount,
    to: to,
    rateMode: rateMode,
    assetId: assetId,
    useDefaultMarket: useDefaultMarket,
    useOnBehalf: useOnBehalf,
    market: market,
    onBehalf: onBehalf,
  };

  const callData = ethers.AbiCoder.defaultAbiCoder().encode(
    [
      "uint256",
      "address",
      "uint8",
      "uint16",
      "bool",
      "bool",
      "address",
      "address",
    ],
    [
      params.amount,
      params.to,
      params.rateMode,
      params.assetId,
      params.useDefaultMarket,
      params.useOnBehalf,
      params.market,
      params.onBehalf,
    ]
  );

  // Подготовка данных для вызова execute
  const executeData = aaveBorrow.interface.encodeFunctionData(
    "executeActionDirect",
    [callData]
  );

  // Выполнение вызова через DSProxy
  const tx = await dsProxy.execute(aaveBorrowAddress, executeData);
  console.log("Транзакция отправлена:", tx.hash);

  // Ожидание подтверждения транзакции
  const receipt = await tx.wait();
  console.log("Транзакция подтверждена в блоке:", receipt.blockNumber);
}

main().catch((error) => {
  console.error("Ошибка при выполнении заимствования через DSProxy:", error);
});
