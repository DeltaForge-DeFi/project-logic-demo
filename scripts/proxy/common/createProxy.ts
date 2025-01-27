import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// ABI for DSProxyFactory
const dsProxyFactoryAbi = [
  "function build() public returns (address proxy)",
];

// Address of the deployed DSProxyFactory contract
const dsProxyFactoryAddress = "0x0227ad3629570fCe89db7aA93cdDCc8C03B4c461";

async function main() {
  // Set up the provider (e.g., Infura, Alchemy, or a local node)
  const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");

  // Set up the wallet with a private key
  const privateKey = process.env.PRIVATE_KEY_ARBITRUM;
  if (!privateKey) throw new Error("PRIVATE_KEY_ARBITRUM not found in .env");
  const wallet = new ethers.Wallet(privateKey, provider);

  // Create an instance of the DSProxyFactory contract
  const dsProxyFactory = new ethers.Contract(
    dsProxyFactoryAddress,
    dsProxyFactoryAbi,
    wallet
  );

  // Call the build function to deploy a new DSProxy
  const tx = await dsProxyFactory.build();
  console.log("Transaction sent:", tx.hash);

  // Wait for the transaction to be confirmed
  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt.blockNumber);

  // Retrieve the address of the new DSProxy from events
  const proxyAddress = receipt.logs
    // .map((log) => dsProxyFactory.interface.parseLog(log))
    // .find((parsedLog) => parsedLog.name === "Created")?.args?.proxy;

  console.log("New DSProxy deployed at address:", proxyAddress);
}

main().catch((error) => {
  console.error("Error deploying DSProxy:", error);
});