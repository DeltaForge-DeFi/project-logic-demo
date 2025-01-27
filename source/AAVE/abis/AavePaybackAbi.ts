export const AAVE_PAYBACK_ABI = [
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
    {
      inputs: [{ internalType: "bytes", name: "_callData", type: "bytes" }],
      name: "executeActionDirect",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "executeActionDirectL2",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes", name: "_callData", type: "bytes" }],
      name: "parseInputs",
      outputs: [
        {
          components: [
            { internalType: "uint256", name: "amount", type: "uint256" },
            { internalType: "address", name: "from", type: "address" },
            { internalType: "uint8", name: "rateMode", type: "uint8" },
            { internalType: "uint16", name: "assetId", type: "uint16" },
            { internalType: "bool", name: "useDefaultMarket", type: "bool" },
            { internalType: "bool", name: "useOnBehalf", type: "bool" },
            { internalType: "address", name: "market", type: "address" },
            { internalType: "address", name: "onBehalf", type: "address" },
          ],
          internalType: "struct AavePayback.Params",
          name: "params",
          type: "tuple",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
  ];