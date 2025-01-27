import { ethers } from "ethers";
import fs from "fs";
import path from "path";
require('dotenv').config();

const contractPath = path.resolve(__dirname, "../../../../contracts/GMX/deposit/Deposit.sol/Deposit.json");
const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const { abi, bytecode } = contractJson;

const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_TESTNET_URL);

const privateKey = process.env.PRIVATE_KEY_AVALANCHE_TESTNET;
if (!privateKey) {
  throw new Error("PRIVATE_KEY_AVALANCHE_TESTNET is not set in the environment variables");
}
const wallet = new ethers.Wallet(privateKey, provider);

const tokenAddress = "0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3"; // deposit token
const depositVaultAddress = "0x2964d242233036C8BDC1ADC795bB4DeA6fb929f2"; // DepositVault

async function main() {
  const Deposit = new ethers.ContractFactory(abi, bytecode, wallet);
  const simpleDeposit = await Deposit.deploy(tokenAddress, depositVaultAddress);
  await simpleDeposit.waitForDeployment();
  console.log("Contract deployed at:", simpleDeposit.target);

  const depositAmount = ethers.parseUnits("0.1", 18); // Example: 0.1 WAVAX

  const tokenContract = new ethers.Contract(tokenAddress, [
    "function approve(address spender, uint256 amount) external returns (bool)"
  ], wallet);

  const approveTx = await tokenContract.approve(simpleDeposit.target, depositAmount);
  console.log("Approval transaction sent:", approveTx.hash);
  await approveTx.wait();
  console.log("Approval confirmed");

  const updatedAbi = [
    ...abi,
    "function makeDeposit(uint256 amount) external"
  ];

  const updatedSimpleDeposit = new ethers.Contract(simpleDeposit.target, updatedAbi, wallet);

  const depositTx = await updatedSimpleDeposit.makeDeposit(depositAmount);
  console.log("Deposit transaction sent:", depositTx.hash);
  await depositTx.wait();
  console.log("Deposit confirmed");
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});