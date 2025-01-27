import { ethers } from "ethers";

export function getDefaultSigner(provider: ethers.Provider): ethers.Wallet {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not set in environment");
  }
  return new ethers.Wallet(process.env.PRIVATE_KEY, provider);
}
