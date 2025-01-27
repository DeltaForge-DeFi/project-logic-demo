import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// Настройка провайдера и кошелька
const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_ONE_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "").connect(provider);

// ABI для DSProxy и вашего контракта AavePayback
const DSProxyABI = [
  "function execute(address _target, bytes _data) public payable returns (bytes memory response)",
];

const AavePaybackABI = [
  "function executeActionDirect(bytes memory _callData) public payable",
];

// Адреса
const DSProxyAddress = "0xDd06e3d838CF0ADd69838476993F42B7fE28d605";
const AavePaybackAddress = "0xa87756d654e2fdd980C385e0D6f28b534cAf662e";

async function executePayback() {
  // Подключение к контрактам
  const dsProxy = new ethers.Contract(DSProxyAddress, DSProxyABI, wallet);
  const aavePayback = new ethers.Contract(AavePaybackAddress, AavePaybackABI, wallet);

  // Параметры для payback
  const params = {
    amount: ethers.parseUnits("0.0005", 18),
    from: "0x8594169c6E19C7912448827BE6c8BC16A6A32419", // Ваш адрес
    rateMode: 2,
    assetId: 0,
    useDefaultMarket: true,
    useOnBehalf: false,
    market: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb", // AAVE V3 Market
    onBehalf: "0x8594169c6E19C7912448827BE6c8BC16A6A32419" // Ваш адрес
  };

  // Кодирование параметров как в dsproxySupply.ts
  const callData = ethers.AbiCoder.defaultAbiCoder().encode(
    [
      "uint256",
      "address",
      "uint8",
      "uint16",
      "bool",
      "bool",
      "address",
      "address"
    ],
    [
      params.amount,
      params.from,
      params.rateMode,
      params.assetId,
      params.useDefaultMarket,
      params.useOnBehalf,
      params.market,
      params.onBehalf
    ]
  );

  // Подготовка данных для вызова execute
  const executeData = aavePayback.interface.encodeFunctionData(
    "executeActionDirect",
    [callData]
  );

  // Выполнение вызова через DSProxy
  const tx = await dsProxy.execute(AavePaybackAddress, executeData);
  console.log("Transaction sent:", tx.hash);

  const receipt = await tx.wait();
  console.log("Transaction confirmed:", receipt.hash);
}

executePayback().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
