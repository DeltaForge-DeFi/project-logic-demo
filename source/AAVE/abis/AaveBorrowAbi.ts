// src/abis/aaveBorrow.ts

export const AAVE_BORROW_ABI = [
  // Функция executeAction
  {
    inputs: [
      { internalType: "bytes", name: "_callData", type: "bytes" },
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
  // Функция actionType
  {
    inputs: [],
    name: "actionType",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "pure",
    type: "function",
  },
  // Функция parseInputs
  {
    inputs: [{ internalType: "bytes", name: "_callData", type: "bytes" }],
    name: "parseInputs",
    outputs: [
      {
        internalType: "tuple",
        name: "params",
        components: [
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint8", name: "rateMode", type: "uint8" },
          { internalType: "uint16", name: "assetId", type: "uint16" },
          { internalType: "bool", name: "useDefaultMarket", type: "bool" },
          { internalType: "bool", name: "useOnBehalf", type: "bool" },
          { internalType: "address", name: "market", type: "address" },
          { internalType: "address", name: "onBehalf", type: "address" },
        ],
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  // Функция encodeInputs
  {
    inputs: [
      {
        internalType: "tuple",
        name: "_params",
        components: [
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint8", name: "rateMode", type: "uint8" },
          { internalType: "uint16", name: "assetId", type: "uint16" },
          { internalType: "bool", name: "useDefaultMarket", type: "bool" },
          { internalType: "bool", name: "useOnBehalf", type: "bool" },
          { internalType: "address", name: "market", type: "address" },
          { internalType: "address", name: "onBehalf", type: "address" },
        ],
      },
    ],
    name: "encodeInputs",
    outputs: [{ internalType: "bytes", name: "encodedInput", type: "bytes" }],
    stateMutability: "pure",
    type: "function",
  },
  // Функция decodeInputs
  {
    inputs: [{ internalType: "bytes", name: "_encodedInput", type: "bytes" }],
    name: "decodeInputs",
    outputs: [
      {
        internalType: "tuple",
        name: "params",
        components: [
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint8", name: "rateMode", type: "uint8" },
          { internalType: "uint16", name: "assetId", type: "uint16" },
          { internalType: "bool", name: "useDefaultMarket", type: "bool" },
          { internalType: "bool", name: "useOnBehalf", type: "bool" },
          { internalType: "address", name: "market", type: "address" },
          { internalType: "address", name: "onBehalf", type: "address" },
        ],
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];
