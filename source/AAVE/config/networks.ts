// src/config/networks.ts
import { Chain } from "viem";

export const NETWORK = {
  // Основные сети

  sepolia: {
    rpcUrl: `${process.env.ALCHEMY_SEPOLIA}`,
    accounts: [`0x${process.env.PRIVATE_KEY}`],
    chain: { id: 11155111, name: "sepolia" } as Chain,
  },

  arbitrum_sepolia: {
    rpcUrl: `${process.env.ARBITRUM_SEPOLIA_RPC}`,
    accounts: [`0x${process.env.PRIVATE_KEY}`],
    chain: { id: 421614, name: "arbitrum_sepolia" } as Chain,
  },

  arbitrum_one: {
    rpcUrl: `${process.env.ARBITRUM_ONE_RPC}`,
    accounts: [`0x${process.env.PRIVATE_KEY}`],
    chain: { id: 42161, name: "arbitrum_one" } as Chain,
  },
};

export type Network = keyof typeof NETWORK;
