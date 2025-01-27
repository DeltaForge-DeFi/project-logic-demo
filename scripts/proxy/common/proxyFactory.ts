import { ethers } from "ethers";

// ABI for DSProxyFactory
const dsProxyFactoryAbi = [
  "function build() public returns (address proxy)",
  // Add other necessary ABI functions if required
];

// Address of the deployed DSProxyFactory contract
const dsProxyFactoryAddress = "YOUR_DSProxyFactory_ADDRESS";

async function main() {
  // Set up the provider (e.g., Infura, Alchemy, or a local node)
  const provider = new ethers.JsonRpcProvider("YOUR_PROVIDER_URL");

  // Set up the wallet with a private key
  const privateKey = "YOUR_PRIVATE_KEY";
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
    .map((log) => dsProxyFactory.interface.parseLog(log))
    .find((parsedLog) => parsedLog.name === "Created")?.args?.proxy;

  console.log("New DSProxy deployed at address:", proxyAddress);
}

main().catch((error) => {
  console.error("Error deploying DSProxy:", error);
});
