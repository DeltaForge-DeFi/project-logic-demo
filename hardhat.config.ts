import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "hardhat-tracer";

import * as tenderly from "@tenderly/hardhat-tenderly";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    // sepolia: {
    //   url: `${process.env.ALCHEMY_SEPOLIA}`,
    //   accounts: [`0x${process.env.PRIVATE_KEY}`],
    // },
    // arbitrum_sepolia: {
    //   url: `${process.env.ARBITRUM_SEPOLIA_RPC}`,
    //   accounts: [`0x${process.env.PRIVATE_KEY}`],
    // },
    // arbitrum_one: {
    //   url: `${process.env.ARBITRUM_ONE_RPC}`,
    //   accounts: [`0x${process.env.PRIVATE_KEY}`],
    // },
    virtual_arbitrum_one: {
      url: "https://virtual.arbitrum.rpc.tenderly.co/be6ab672-3709-4a27-802b-6973dd0110d0",
      chainId: 42161
    },
  },
  tenderly: {
    // https://docs.tenderly.co/account/projects/account-project-slug
    project: "aave",
    username: "tetswest",
  },
};

export default config;