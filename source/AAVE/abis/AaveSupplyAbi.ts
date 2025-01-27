// src/abis/AaveSupplyAbi.ts
export const AaveSupplyAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "from", type: "address" },
      { internalType: "uint16", name: "assetId", type: "uint16" },
      { internalType: "bool", name: "enableAsColl", type: "bool" },
      { internalType: "bool", name: "useDefaultMarket", type: "bool" },
      { internalType: "bool", name: "useOnBehalf", type: "bool" },
      { internalType: "address", name: "market", type: "address" },
      { internalType: "address", name: "onBehalf", type: "address" },
    ],
    name: "executeActionDirect",
    outputs: [{ internalType: "bytes", name: "logData", type: "bytes" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];
