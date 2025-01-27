import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import dotenv from 'dotenv';

dotenv.config();

const contractPath = path.resolve(__dirname, "../../artifacts/contracts/stub/stub.sol/TestStub.json");
const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const { abi, bytecode } = contractJson;

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_ARBITRUM_URL);

    const privateKey = process.env.PRIVATE_KEY_ARBITRUM; 
    if (!privateKey) throw new Error("PRIVATE_KEY not found in .env");
    const wallet = new ethers.Wallet(privateKey, provider);

    const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet);

    // Контракт теперь stateless, без конструктора
    const contract = await contractFactory.deploy();

    await contract.waitForDeployment();

    console.log(`Contract deployed at address: ${contract.target}`);
}

main().catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
});
