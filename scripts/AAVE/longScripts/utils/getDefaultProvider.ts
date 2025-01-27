import { ethers } from "ethers";

export function getDefaultProvider(): ethers.Provider {
  if (!process.env.ARBITRUM_ONE_RPC) {
    throw new Error("ARBITRUM_ONE_RPC not set in environment");
  }
  return new ethers.JsonRpcProvider(process.env.ARBITRUM_ONE_RPC);
}
