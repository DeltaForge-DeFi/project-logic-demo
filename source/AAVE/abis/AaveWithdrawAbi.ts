// src/abis/aaveWithdraw.ts

export const AAVE_WITHDRAW_ABI = [
  // Функция executeAction
  {
    inputs: [
      { internalType: "bytes", name: "callData", type: "bytes" },
      { internalType: "bytes32[]", name: "_subData", type: "bytes32[]" },
      { internalType: "uint8[]", name: "_paramMapping", type: "uint8[]" },
      { internalType: "bytes32[]", name: "_returnValues", type: "bytes32[]" },
    ],
    name: "executeAction",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "payable",
    type: "function",
  },
  // Функция executeActionDirect
  {
    inputs: [{ internalType: "bytes", name: "_callData", type: "bytes" }],
    name: "executeActionDirect",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  // Функция executeActionDirectL2
  {
    inputs: [],
    name: "executeActionDirectL2",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
