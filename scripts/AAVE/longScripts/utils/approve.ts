// src/utils/approve.ts
import { createPublicClient } from "viem";
import { parseUnits } from "viem";
import { getAssetById } from "../../../../source/AAVE/config/assets";

export const checkAllowance = async (
  client: any,
  tokenAddress: string,
  owner: string,
  spender: string
) => {
  const tokenAbi = [
    "function allowance(address owner, address spender) view returns (uint256)",
  ];
  const tokenContract = client.contract(tokenAddress, tokenAbi);
  const allowance = await tokenContract.call("allowance", [owner, spender]);
  return allowance;
};

export const approve = async (
  client: any,
  tokenAddress: string,
  spender: string,
  amount: string
) => {
  const tokenAbi = [
    "function approve(address spender, uint256 amount) public returns (bool)",
  ];
  const tokenContract = client.contract(tokenAddress, tokenAbi);
  const approveTx = await tokenContract.write("approve", [
    spender,
    parseUnits(amount, 18),
  ]);
  return approveTx;
};
