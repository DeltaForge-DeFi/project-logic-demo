// src/config/assets.ts

export const assets = {
  0: { address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", symbol: "DAI" },
  1: { address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", symbol: "LINK" },
  2: { address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", symbol: "USDC" },
  3: { address: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f", symbol: "WBTC" },
  4: { address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1", symbol: "WETH" },
  5: { address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", symbol: "USDT" },
  6: { address: "0xba5ddd1f9d7f570dc94a51479a000e3bce967196", symbol: "AAVE" },
  7: { address: "0xd22a58f79e9481d1a88e00c343885a588b34b68b", symbol: "EURS" },
  8: {
    address: "0x5979d7b546e38e414f7e9822514be443a4800529",
    symbol: "wstETH",
  },
  9: { address: "0x3f56e0c36d275367b8c502090edf38289b3dea0d", symbol: "MAI" },
  10: { address: "0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8", symbol: "rETH" },
  11: { address: "0x93b346b6bc2548da6a1e7d98e9a421b42541425b", symbol: "LUSD" },
  12: { address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831", symbol: "USDC" },
  13: { address: "0x17fc002b466eec40dae837fc4be5c67993ddbd6f", symbol: "FRAX" },
  14: { address: "0x912ce59144191c1204e64559fe8253a0e49e6548", symbol: "ARB" },
  15: {
    address: "0x35751007a407ca6feffe80b3cb397736d2cf4dbe",
    symbol: "weETH",
  },
  16: { address: "0x7dff72693f6a4149b17e7c6314655f6a9f7c8b33", symbol: "GHO" },
};

export const contractAdresses = {
  AaveBorrowContract: "0x89D9fcb5abe53fb0751a564C45cd23B3011058F7",
  AavePaybackContract: "0xa87756d654e2fdd980C385e0D6f28b534cAf662e",
  AaveSupplyContract: "0x755d8133E1688b071Ec4ac73220eF7f70BC6992F", // Этот адрес мы будем использовать для supply
  AaveWithdrawContract: "0x570BfB7A185EFa93d54b06348a9eB69F6bd94ec3",
  AavePoolProvider: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
};

export const getAssetById = (id: number) => {
  return assets[id] || null;
};

export const getAaveSupplyContract = () => {
  return contractAdresses.AaveSupplyContract;
};

export const getAaveWithdrawContract = () => {
  return contractAdresses.AaveWithdrawContract;
};

export const getAaveBorrowContract = () => {
  return contractAdresses.AaveBorrowContract;
};

export const getAavePaybackContract = () => {
  return contractAdresses.AavePaybackContract;
};

export const AavePoolProvider = () => {
  return contractAdresses.AavePoolProvider;
};
