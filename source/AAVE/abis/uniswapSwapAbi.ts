export const UNISWAP_SWAP_ABI = [
  {
    inputs: [
      {
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "amountOutMinimum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
          { name: "pullTokens", type: "bool" },
        ],
        internalType: "struct UniswapSwap.Params",
        name: "_callData",
        type: "bytes",
      },
      {
        internalType: "bytes32[]",
        name: "_returnValues",
        type: "bytes32[]",
      },
    ],
    name: "executeAction",
    outputs: [{ internalType: "bytes32", type: "bytes32" }],
    stateMutability: "payable",
    type: "function",
  },
] as const;
