import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

import ExchangeRouterJson from '../../../../source/GMX/deploymentsGMX/arbitrum/ExchangeRouter.json';
import RouterJson from '../../../../source/GMX/deploymentsGMX/arbitrum/Router.json';
import OrderVaultJson from '../../../../source/GMX/deploymentsGMX/arbitrum/OrderVault.json';
import DataStoreJson from '../../../../source/GMX/deploymentsGMX/arbitrum/DataStore.json';
import ReaderJson from '../../../../source/GMX/deploymentsGMX/arbitrum/Reader.json';

const EXCHANGE_ROUTER_ADDRESS = ExchangeRouterJson.address;
const ROUTER_ADDRESS = RouterJson.address;
const READER_ADDRESS = ReaderJson.address;
const READER_ABI = ReaderJson.abi;
const ORDER_VAULT_ADDRESS = OrderVaultJson.address;
const DATA_STORE_ADDRESS = DataStoreJson.address;
const USDC_ADDRESS = "0x3eBDeaA0DB3FfDe96E7a0DBBAFEC961FC50F725F"; //testnet

// Load the contract's ABI
const contractPath = path.resolve(__dirname, "../../artifacts/contracts/createShort.sol/CreateShort.json");
const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const { abi } = contractJson;

async function main() {
    // Connect to Avalanche Fuji testnet
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_ARBITRUM_URL);

    // Create a wallet instance
    const privateKey = process.env.PRIVATE_KEY_ARBITRUM;
    if (!privateKey) throw new Error("PRIVATE_KEY_ARBITRUM not found in .env");
    const wallet = new ethers.Wallet(privateKey, provider);

    // Contract address
    const contractAddress = "0xeba726f8339Fe4eF275bc9aa5aA07E21edde63Ca";
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    // Define parameters for readPosition
    const readerContract = new ethers.Contract(READER_ADDRESS, READER_ABI, provider);
    const positions = await readerContract.getAccountPositions(DATA_STORE_ADDRESS, contractAddress, 0, 100);
    positions.forEach((position: any) => {
        console.log(`Position: ${position}`);
  });
}

main().catch((error) => {
    console.error("Error interacting with contract:", error);
    process.exit(1);
});
