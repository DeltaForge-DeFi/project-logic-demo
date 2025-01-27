import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "hardhat-tracer";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `${process.env.ALCHEMY_SEPOLIA}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },

    arbitrum_sepolia: {
      url: `${process.env.ARBITRUM_SEPOLIA_RPC}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },

    arbitrum_one: {
      url: `${process.env.ARBITRUM_ONE_RPC}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;