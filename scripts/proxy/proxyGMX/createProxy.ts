import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const PROXY_FACTORY_ADDR = "0x5a15566417e6C1c9546523066500bDDBc53F88C7";

const DSProxyFactoryABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "proxy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "cache",
        "type": "address"
      }
    ],
    "name": "Created",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "build",
    "outputs": [
      {
        "internalType": "address",
        "name": "proxy",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "build",
    "outputs": [
      {
        "internalType": "address",
        "name": "proxy",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];


async function main() {
  const rpcUrl = process.env.ARBITRUM_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    throw new Error("Please set ARBITRUM_RPC_URL and PRIVATE_KEY in your .env file");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const factory = new ethers.Contract(PROXY_FACTORY_ADDR, DSProxyFactoryABI, wallet);

  console.log("Sending transaction to create a new DSProxy with owner:", wallet.address);
  // Явно указываем какую функцию build вызывать
  const tx = await factory["build(address)"](wallet.address);
  const receipt = await tx.wait();

  console.log(receipt.logs);

  const createdEvent = receipt.logs
    .map((log: ethers.Log) => {
      try {
        return factory.interface.parseLog(log);
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error("Error parsing log:", e.message);
        }
        return null;
      }
    })
    .find((e: any) => e && e.name === "Created");

  if (!createdEvent) {
    throw new Error("No Created event found in transaction receipt");
  }

  const proxyAddress = createdEvent.args.proxy;
  console.log("Ваш новый DSProxy:", proxyAddress);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
