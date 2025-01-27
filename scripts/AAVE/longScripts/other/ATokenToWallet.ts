import { ethers } from "ethers";

// ABI для ERC20 токенов
const ERC20Abi = [
  {
    constant: false,
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function transferADai() {
  const RPC_URL = "https://arb1.arbitrum.io/rpc"; // RPC для Arbitrum
  const WALLET_PRIVATE_KEY =
    ""; // Приватный ключ
  const ADAI_ADDRESS = "0x794a61358d6845594f94dc1db02a252b5b4814ad"; // Адрес aDAI
  const RECEIVER_ADDRESS = "0x40e214a332856202b3Dd84a4E21b84a260A1b10f"; // Ваш кошелек
  const AMOUNT = ethers.parseUnits("1", 18); // Сумма для перевода (в aDAI)

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

  // Подключение к контракту aDAI
  const aDaiContract = new ethers.Contract(ADAI_ADDRESS, ERC20Abi, wallet);

  try {
    // Выполняем перевод aDAI
    const tx = await aDaiContract.transfer(RECEIVER_ADDRESS, AMOUNT);
    console.log("Transfer transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transfer confirmed:", receipt.transactionHash);
  } catch (error) {
    console.error("Transfer failed:", error);
  }
}

transferADai().catch(console.error);
