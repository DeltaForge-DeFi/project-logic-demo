import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

// Load the contract's ABI
const contractPath = path.resolve(__dirname, "../../../../contracts/GMX/GMXShort/createShort.sol/CreateShort.json");
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
    const contractAddress = "0x330E8229dD907361c4A1E4fC2d70ed616776411b"; //! you need to change address if it's new contract
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    // USDC contract
    const usdcAddress = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
    const usdcAbi = [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function allowance(address owner, address spender) external view returns (uint256)",
        "function balanceOf(address account) external view returns (uint256)"
    ];
    const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, wallet);

    // Ensure the contract can pull USDC from the user
    const requiredAllowance = ethers.parseUnits("2.1", 6);
    let currentAllowance = await usdcContract.allowance(wallet.address, contractAddress);
    if (currentAllowance < requiredAllowance) {
        const approveTx = await usdcContract.approve(contractAddress, requiredAllowance);
        await approveTx.wait();
    }

    // Define parameters for createShort
    const marketAddress = "0x70d95587d40A2caf56bd97485aB3Eec10Bee6336"; //mainnet address (weth/usdc)
    const sizeDeltaUsd = 3; // The contract multiplies by 1e30 internally
    const initialCollateralDeltaAmount = ethers.parseUnits("2.1", 6); // 100 USDC

    // withdraw tx
    const tx = await contract.withdrawShort(
        {
            value: ethers.parseEther("0.0007") // в eth
        }
    );

    // createShort tx
    // const tx = await contract.createShort(marketAddress, sizeDeltaUsd, initialCollateralDeltaAmount,
    //     {
    //         value: ethers.parseEther("0.0007") // в eth
    //     }
    // );

    console.log("Transaction sent, waiting for confirmation...");
    await tx.wait();
    console.log("createShort function called successfully");
}

main().catch((error) => {
    console.error("Error interacting with contract:", error);
    process.exit(1);
});
