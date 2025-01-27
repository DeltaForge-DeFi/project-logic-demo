import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Адреса контрактов GMX (из ваших JSON или переменных окружения)
import ExchangeRouterJson from '../../../source/GMX/deploymentsGMX/arbitrum/ExchangeRouter.json';
import RouterJson from '../../../source/GMX/deploymentsGMX/arbitrum/Router.json';
import OrderVaultJson from '../../../source/GMX/deploymentsGMX/arbitrum/OrderVault.json';
import DataStoreJson from '../../../source/GMX/deploymentsGMX/arbitrum/DataStore.json';
import ReaderJson from '../../../source/GMX/deploymentsGMX/arbitrum/Reader.json';

const EXCHANGE_ROUTER_ADDRESS = ExchangeRouterJson.address;
const ROUTER_ADDRESS = RouterJson.address;
const READER_ADDRESS = ReaderJson.address;
const ORDER_VAULT_ADDRESS = OrderVaultJson.address;
const DATA_STORE_ADDRESS = DataStoreJson.address;
const USDC_ADDRESS = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; 

const dsProxyAbi = [
  "function execute(address _target, bytes _data) external payable returns (bytes32 response)",
];

const usdcAbi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
];

const proxyAddress = "0xeba726f8339Fe4eF275bc9aa5aA07E21edde63Ca";
if (!proxyAddress) {
  throw new Error("PROXY_ADDRESS not found");
}

async function dsproxyShort(
  action: "createShort" | "withdrawShort",
  userProxy: string,
  params: any
) {
  const rpcUrl = "https://arb1.arbitrum.io/rpc";
  const privateKey = process.env.PRIVATE_KEY_ARBITRUM || 
    "";

  if (!rpcUrl || !privateKey) {
    throw new Error(
      "ARBITRUM_ONE_RPC or PRIVATE_KEY_ARBITRUM not found in environment variables"
    );
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  // Задеплоенный ранее адрес контракта CreateShort
  const createShortContractAddress = "0x5F605D8D9c342aE16EFcFb69Fb9267ec0Df5A716";

  const dsProxy = new ethers.Contract(userProxy, dsProxyAbi, wallet);
  const usdcContract = new ethers.Contract(USDC_ADDRESS, usdcAbi, wallet);

  const requiredAllowance = ethers.parseUnits("2.1", 6);
  let currentAllowance = await usdcContract.allowance(wallet.address, proxyAddress);
  if (currentAllowance < requiredAllowance) {
    console.log("Approving USDC allowance for DSProxy...");
    const approveTx = await usdcContract.approve(proxyAddress, requiredAllowance);
    await approveTx.wait();
    console.log("USDC allowance approved successfully for DSProxy");
  }

  let encodedData: string;

  if (action === "createShort") {
    // Параметры для shortParams:
    // user, market, sizeDeltaUsd, initialCollateralDeltaAmount,
    // exchangeRouter, reader, USDC, orderVaultAddress, dataStoreAddress, routerAddress

    const callData = ethers.AbiCoder.defaultAbiCoder().encode(
      [
        "address", // user
        "address", // market
        "uint256", // sizeDeltaUsd
        "uint256", // initialCollateralDeltaAmount
        "address", // exchangeRouter
        "address", // reader
        "address", // USDC
        "address", // orderVaultAddress
        "address", // dataStoreAddress
        "address"  // routerAddress
      ],
      [
        wallet.address,
        params.market,
        params.sizeDeltaUsd,
        params.collateralAmount,
        EXCHANGE_ROUTER_ADDRESS,
        READER_ADDRESS,
        USDC_ADDRESS,
        ORDER_VAULT_ADDRESS,
        DATA_STORE_ADDRESS,
        ROUTER_ADDRESS
      ]
    );

    // Кодируем вызов createShort(callData)
    const createShortAbi = [
      "function createShort(bytes _callData) external payable"
    ];
    const createShortInterface = new ethers.Interface(createShortAbi);

    encodedData = createShortInterface.encodeFunctionData("createShort", [callData]);

  } else if (action === "withdrawShort") {
    // Параметры для withdrawParams:
    // user,
    // exchangeRouter, reader, USDC, orderVaultAddress, dataStoreAddress, routerAddress

    const withdrawCallData = ethers.AbiCoder.defaultAbiCoder().encode(
      [
        "address", // user
        "address", // exchangeRouter
        "address", // reader
        "address", // USDC
        "address", // orderVaultAddress
        "address", // dataStoreAddress
        "address"  // routerAddress
      ],
      [
        wallet.address,
        EXCHANGE_ROUTER_ADDRESS,
        READER_ADDRESS,
        USDC_ADDRESS,
        ORDER_VAULT_ADDRESS,
        DATA_STORE_ADDRESS,
        ROUTER_ADDRESS
      ]
    );

    const withdrawShortAbi = [
      "function withdrawShort(bytes _callData) external payable"
    ];
    const withdrawShortInterface = new ethers.Interface(withdrawShortAbi);

    encodedData = withdrawShortInterface.encodeFunctionData("withdrawShort", [withdrawCallData]);

  } else {
    throw new Error("Unsupported action. Use 'createShort' or 'withdrawShort'.");
  }

  const tx = await dsProxy.execute(createShortContractAddress, encodedData, {
    value: ethers.parseEther("0.0005"),
    gasLimit: 2000000
  });
  

  console.log(`Transaction sent: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
}

// Пример вызова
(async () => {
  try {
    // createShort
    
    // const createShortParams = {
    //   market: "0x70d95587d40A2caf56bd97485aB3Eec10Bee6336",
    //   sizeDeltaUsd: ethers.parseUnits("3", 30), 
    //   collateralAmount: ethers.parseUnits("2.1", 6),
    //   collateralToken: USDC_ADDRESS,
    // };

    // await dsproxyShort("createShort", proxyAddress, createShortParams);

    // withdrawShorts
    const withdrawShortParams = {};

    await dsproxyShort("withdrawShort", proxyAddress, withdrawShortParams);

    // Если нужно будет вызвать withdrawShort:
    // await dsproxyShort("withdrawShort", proxyAddress, {});

  } catch (error: any) {
    console.error("Detailed error:", {
      error: error,
      message: error.message,
      data: error.data,
      reason: error.reason,
      code: error.code,
      transaction: error.transaction,
    });
  }
})();
