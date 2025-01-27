import { ethers } from "ethers";

// ABI смарт-контракта AaveWithdraw
const AaveWithdrawAbi = [
  "function executeActionDirect(bytes _callData) public payable",
];

// Адреса и параметры (замените на ваши значения)
const AAVE_WITHDRAW_CONTRACT_ADDRESS =
  "0x570BfB7A185EFa93d54b06348a9eB69F6bd94ec3";
const WALLET_PRIVATE_KEY = "PRIVATE_KEY";
const RPC_URL = "https://arb1.arbitrum.io/rpc"; // Например, https://arb1.arbitrum.io/rpc
const RECEIVER_ADDRESS = "0x40e214a332856202b3Dd84a4E21b84a260A1b10f";
const MARKET_ADDRESS = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"; // Если используете рынок по умолчанию, можно пропустить
const ASSET_ID = 0; // Пример ID актива (замените на фактический ID)
const WITHDRAW_AMOUNT = ethers.parseUnits("1", 18); // Сумма для вывода (1 токен с 18 десятичными знаками)
const USE_DEFAULT_MARKET = true; // Установите в false, если указываете MARKET_ADDRESS

async function main() {
  // Устанавливаем провайдера и кошелек
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

  // Подключаемся к смарт-контракту AaveWithdraw
  const aaveWithdrawContract = new ethers.Contract(
    AAVE_WITHDRAW_CONTRACT_ADDRESS,
    AaveWithdrawAbi,
    wallet
  );

  // Создаем параметры для вызова
  const params = {
    assetId: ASSET_ID,
    useDefaultMarket: USE_DEFAULT_MARKET,
    amount: WITHDRAW_AMOUNT,
    to: RECEIVER_ADDRESS,
    market: MARKET_ADDRESS, // Если USE_DEFAULT_MARKET = true, это поле можно оставить пустым
  };

  // Кодируем параметры
  const callData = encodeParams(params);

  // Проверка и установка allowance (если требуется)
  // Подключаемся к контракту соответствующего aToken
  const aTokenAddress = "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE"; // Замените на адрес aToken, соответствующий вашему assetId
  const aTokenContract = new ethers.Contract(
    aTokenAddress,
    [
      "function balanceOf(address owner) external view returns (uint256)",
      "function allowance(address owner, address spender) external view returns (uint256)",
      "function approve(address spender, uint256 amount) external returns (bool)",
    ],
    wallet
  );

  // Проверяем баланс aTokens
  const aTokenBalance = await aTokenContract.balanceOf(wallet.address);
  console.log(
    `Баланс aToken: ${ethers.formatUnits(aTokenBalance, 18)} токенов`
  );

  // Проверяем allowance
  const allowance = await aTokenContract.allowance(
    wallet.address,
    AAVE_WITHDRAW_CONTRACT_ADDRESS
  );
  console.log(
    `Allowance для AaveWithdraw: ${ethers.formatUnits(allowance, 18)} токенов`
  );

  if (allowance < WITHDRAW_AMOUNT) {
    try {
      const approveTx = await aTokenContract.approve(
        AAVE_WITHDRAW_CONTRACT_ADDRESS,
        ethers.MaxUint256 // Одобряем максимально возможную сумму
      );

      console.log("Approve транзакция отправлена:", approveTx.hash);
      await approveTx.wait();
      console.log("Approve транзакция подтверждена.");

      // Проверяем обновленный allowance
      const updatedAllowance = await aTokenContract.allowance(
        wallet.address,
        AAVE_WITHDRAW_CONTRACT_ADDRESS
      );
      console.log(
        `Обновленный allowance: ${ethers.formatUnits(
          updatedAllowance,
          18
        )} токенов`
      );
    } catch (error: any) {
      console.error("Ошибка при выполнении транзакции approve:", error.message);
      return;
    }
  }

  // Выполнение транзакции с обработкой ошибок
  try {
    const tx = await aaveWithdrawContract.executeActionDirect(callData, {
      gasLimit: 500000, // Устанавливаем лимит газа
    });
    console.log("Транзакция отправлена:", tx.hash);
    const receipt = await tx.wait();
    console.log("Транзакция подтверждена:", receipt.transactionHash);
  } catch (error: any) {
    if (error.error && error.error.body) {
      const errorBody = JSON.parse(error.error.body);
      console.error(
        "Ошибка при выполнении транзакции:",
        errorBody.error.message
      );
    } else {
      console.error("Ошибка при выполнении транзакции:", error.message);
    }
  }
}

// Функция для кодирования параметров в bytes
function encodeParams(params: any): string {
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();

  // Если используется рынок по умолчанию, исключаем параметр market
  if (params.useDefaultMarket) {
    return abiCoder.encode(
      ["uint16", "bool", "uint256", "address"],
      [params.assetId, params.useDefaultMarket, params.amount, params.to]
    );
  } else {
    return abiCoder.encode(
      ["uint16", "bool", "uint256", "address", "address"],
      [
        params.assetId,
        params.useDefaultMarket,
        params.amount,
        params.to,
        params.market,
      ]
    );
  }
}

main().catch((error) => {
  console.error("Ошибка:", error);
});
