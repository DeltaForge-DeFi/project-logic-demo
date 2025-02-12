/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  AaveWithdraw,
  AaveWithdrawInterface,
} from "../../../../contracts/AAVE/AAVEProtocol/AaveWithdraw";

const _abi = [
  {
    inputs: [],
    name: "NonContractCall",
    type: "error",
  },
  {
    inputs: [],
    name: "ReturnIndexValueError",
    type: "error",
  },
  {
    inputs: [],
    name: "SenderNotAdmin",
    type: "error",
  },
  {
    inputs: [],
    name: "SenderNotOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "SubIndexValueError",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "logName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "ActionEvent",
    type: "event",
  },
  {
    inputs: [],
    name: "AAVE_REFERRAL_CODE",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NO_PARAM_MAPPING",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RETURN_MAX_INDEX_VALUE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RETURN_MIN_INDEX_VALUE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SUB_MAX_INDEX_VALUE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SUB_MIN_INDEX_VALUE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "actionType",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "adminData",
    outputs: [
      {
        internalType: "contract AdminData",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_encodedInput",
        type: "bytes",
      },
    ],
    name: "decodeInputs",
    outputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "assetId",
            type: "uint16",
          },
          {
            internalType: "bool",
            name: "useDefaultMarket",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "address",
            name: "market",
            type: "address",
          },
        ],
        internalType: "struct AaveWithdraw.Params",
        name: "params",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "assetId",
            type: "uint16",
          },
          {
            internalType: "bool",
            name: "useDefaultMarket",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "address",
            name: "market",
            type: "address",
          },
        ],
        internalType: "struct AaveWithdraw.Params",
        name: "_params",
        type: "tuple",
      },
    ],
    name: "encodeInputs",
    outputs: [
      {
        internalType: "bytes",
        name: "encodedInput",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "callData",
        type: "bytes",
      },
      {
        internalType: "bytes32[]",
        name: "_subData",
        type: "bytes32[]",
      },
      {
        internalType: "uint8[]",
        name: "_paramMapping",
        type: "uint8[]",
      },
      {
        internalType: "bytes32[]",
        name: "_returnValues",
        type: "bytes32[]",
      },
    ],
    name: "executeAction",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_callData",
        type: "bytes",
      },
    ],
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
    inputs: [
      {
        internalType: "address",
        name: "_proxy",
        type: "address",
      },
    ],
    name: "isDSProxy",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "kill",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "logger",
    outputs: [
      {
        internalType: "contract DefisaverLogger",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_callData",
        type: "bytes",
      },
    ],
    name: "parseInputs",
    outputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "assetId",
            type: "uint16",
          },
          {
            internalType: "bool",
            name: "useDefaultMarket",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "address",
            name: "market",
            type: "address",
          },
        ],
        internalType: "struct AaveWithdraw.Params",
        name: "params",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "registry",
    outputs: [
      {
        internalType: "contract DFSRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawStuckFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50612e3f806100206000396000f3fe6080604052600436106101145760003560e01c806341c0e1b5116100a05780639093410d116100645780639093410d1461036a5780639864dcdd146103a7578063c579d490146103d2578063d3c2e7ed146103fb578063f24ccbfe1461042657610114565b806341c0e1b5146102905780637b103999146102a75780638b835979146102d25780638bcb62161461030f5780638df50f741461033a57610114565b80631c451ceb116100e75780631c451ceb146101d7578063247492f8146102145780632895f3aa1461023f5780632fa13cb814610249578063389f87ff1461027457610114565b806305a363de1461011957806306d2ae8e146101445780630ec5ef821461016f5780630f2eee42146101ac575b600080fd5b34801561012557600080fd5b5061012e610451565b60405161013b919061194f565b60405180910390f35b34801561015057600080fd5b50610159610456565b60405161016691906119e9565b60405180910390f35b34801561017b57600080fd5b5061019660048036038101906101919190611c0d565b61046e565b6040516101a39190611cb9565b60405180910390f35b3480156101b857600080fd5b506101c1610584565b6040516101ce9190611cf7565b60405180910390f35b3480156101e357600080fd5b506101fe60048036038101906101f99190611d12565b610589565b60405161020b9190611d4e565b60405180910390f35b34801561022057600080fd5b50610229610620565b6040516102369190611cf7565b60405180910390f35b61024761063b565b005b34801561025557600080fd5b5061025e6106ff565b60405161026b9190611cf7565b60405180910390f35b61028e60048036038101906102899190611e23565b610704565b005b34801561029c57600080fd5b506102a56107b6565b005b3480156102b357600080fd5b506102bc6108b6565b6040516102c99190611e8d565b60405180910390f35b3480156102de57600080fd5b506102f960048036038101906102f49190611f08565b6108ce565b6040516103069190611ff9565b60405180910390f35b34801561031b57600080fd5b50610324610a80565b6040516103319190611cf7565b60405180910390f35b610354600480360381019061034f91906121fc565b610a85565b60405161036191906122e2565b60405180910390f35b34801561037657600080fd5b50610391600480360381019061038c9190611e23565b610c9a565b60405161039e9190611ff9565b60405180910390f35b3480156103b357600080fd5b506103bc610d14565b6040516103c99190611cf7565b60405180910390f35b3480156103de57600080fd5b506103f960048036038101906103f491906122fd565b610d19565b005b34801561040757600080fd5b50610410610ec4565b60405161041d9190611cf7565b60405180910390f35b34801561043257600080fd5b5061043b610ec9565b6040516104489190612371565b60405180910390f35b604081565b73d47d8d97cad12a866900eec6cde1962529f2535181565b6060632895f3aa60e01b60405160200161048891906123d9565b604051602081830303815290604052905080826000015160f01b6040516020016104b392919061247d565b6040516020818303038152906040529050806104d28360200151610ee1565b6040516020016104e39291906124f2565b604051602081830303815290604052905080826040015160001b60405160200161050e92919061253b565b604051602081830303815290604052905080826060015160601b6040516020016105399291906125b0565b6040516020818303038152906040529050816020015161057f5780826080015160601b60405160200161056d9291906125b0565b60405160208183030381529060405290505b919050565b608081565b6000735a15566417e6c1c9546523066500bddbc53f88c773ffffffffffffffffffffffffffffffffffffffff166329710388836040518263ffffffff1660e01b81526004016105d891906125e7565b602060405180830381865afa1580156105f5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106199190612617565b9050919050565b60006001600481111561063657610635612644565b5b905090565b600061065960003660049080926106549392919061267d565b6108ce565b905060006106798260800151836000015184604001518560600151610eff565b91505073e6f9a5c850dbcd12bc64f40d692f537250adec3873ffffffffffffffffffffffffffffffffffffffff1663f4b24b55826040518263ffffffff1660e01b81526004016106c99190612715565b600060405180830381600087803b1580156106e357600080fd5b505af11580156106f7573d6000803e3d6000fd5b505050505050565b600081565b600061070f82610c9a565b9050600061072f8260800151836000015184604001518560600151610eff565b91505073e6f9a5c850dbcd12bc64f40d692f537250adec3873ffffffffffffffffffffffffffffffffffffffff1663f4b24b55826040518263ffffffff1660e01b815260040161077f9190612715565b600060405180830381600087803b15801561079957600080fd5b505af11580156107ad573d6000803e3d6000fd5b50505050505050565b3373ffffffffffffffffffffffffffffffffffffffff1673d47d8d97cad12a866900eec6cde1962529f2535173ffffffffffffffffffffffffffffffffffffffff1663f851a4406040518163ffffffff1660e01b8152600401602060405180830381865afa15801561082c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610850919061275f565b73ffffffffffffffffffffffffffffffffffffffff161461089d576040517fa6c827a900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff16ff5b73bf1cac12db60819bfa71a328282ecbc1d40443aa81565b6108d66118d1565b82826000906002926108ea9392919061267d565b906108f591906127a4565b60f01c816000019061ffff16908161ffff168152505061093283836002906003926109229392919061267d565b9061092d9190612803565b6110ff565b81602001901515908115158152505082826003906023926109559392919061267d565b906109609190612862565b60001c81604001818152505082826023906037926109809392919061267d565b9061098b91906128c1565b60601c816060019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050806020015115610a205773a97684ead0e402dc232d5a977953df7ecbab3cdb816080019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050610a7a565b8282603790604b92610a349392919061267d565b90610a3f91906128c1565b60601c816080019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250505b92915050565b600181565b600080610a9186610c9a565b9050610ac2816000015161ffff1685600081518110610ab357610ab2612920565b5b60200260200101518786611153565b816000019061ffff16908161ffff16815250506001610b138260200151610aea576000610aed565b60015b60ff1686600181518110610b0457610b03612920565b5b60200260200101518887611153565b14816020019015159081151581525050610b4e816040015185600281518110610b3f57610b3e612920565b5b60200260200101518786611153565b816040018181525050610b82816060015185600381518110610b7357610b72612920565b5b602002602001015187866111d9565b816060019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050610be4816080015185600481518110610bd557610bd4612920565b5b602002602001015187866111d9565b816080019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050600080610c3a8360800151846000015185604001518660600151610eff565b91509150604051610c4a9061297d565b60405180910390207f2b6d22f419271bcc89bbac8deec947c664365d6e24d06fef0ca7c325c704dce382604051610c819190611cb9565b60405180910390a28160001b9350505050949350505050565b610ca26118d1565b81806020019051810190610cb69190612a48565b9050806020015115610d0f5773a97684ead0e402dc232d5a977953df7ecbab3cdb816080019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250505b919050565b607f81565b3373ffffffffffffffffffffffffffffffffffffffff1673d47d8d97cad12a866900eec6cde1962529f2535173ffffffffffffffffffffffffffffffffffffffff16638da5cb5b6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610d8f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610db3919061275f565b73ffffffffffffffffffffffffffffffffffffffff1614610e00576040517f19494c8a00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610e93578173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610e8d573d6000803e3d6000fd5b50610ebf565b610ebe82828573ffffffffffffffffffffffffffffffffffffffff1661128d9092919063ffffffff16565b5b505050565b60ff81565b73e6f9a5c850dbcd12bc64f40d692f537250adec3881565b600081610ef257600060f81b610ef8565b600160f81b5b9050919050565b600060606000610f0e87611313565b905060008173ffffffffffffffffffffffffffffffffffffffff166352751797886040518263ffffffff1660e01b8152600401610f4b919061194f565b602060405180830381865afa158015610f68573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f8c919061275f565b905060007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8703610fe357610fe0868373ffffffffffffffffffffffffffffffffffffffff1661138b90919063ffffffff16565b90505b8273ffffffffffffffffffffffffffffffffffffffff166369328dec8389896040518463ffffffff1660e01b815260040161102093929190612a84565b6020604051808303816000875af115801561103f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110639190612abb565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff87036110c257806110b5878473ffffffffffffffffffffffffffffffffffffffff1661138b90919063ffffffff16565b6110bf9190612b17565b96505b6000898389896040516020016110db9493929190612b4b565b60405160208183030381529060405290508781955095505050505094509492505050565b60008060f81b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614159050919050565b600061115e84611476565b156111ce5761116c84611489565b156111a1578161117b856114b0565b60ff168151811061118f5761118e612920565b5b602002602001015160001c94506111cd565b826111ab85611505565b60ff16815181106111bf576111be612920565b5b602002602001015160001c94505b5b849050949350505050565b60006111e484611476565b15611281576111f284611489565b156112275781611201856114b0565b60ff168151811061121557611214612920565b5b602002602001015160601c9450611280565b60fe8460ff160361123a57309050611285565b60ff8460ff16036112545761124d61155c565b9050611285565b8261125e85611505565b60ff168151811061127257611271612920565b5b602002602001015160001c94505b5b8490505b949350505050565b61130e8363a9059cbb60e01b84846040516024016112ac929190612b90565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505061168d565b505050565b60008173ffffffffffffffffffffffffffffffffffffffff1663026b1d5f6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611360573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611384919061275f565b9050919050565b600073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036113f3578173ffffffffffffffffffffffffffffffffffffffff16319050611470565b8273ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff1660e01b815260040161142c91906125e7565b602060405180830381865afa158015611449573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061146d9190612abb565b90505b92915050565b60008060ff168260ff1614159050919050565b6000600160ff168260ff16101580156114a95750607f60ff168260ff1611155b9050919050565b60006114bb82611489565b6114f1576040517fdcc95a3900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001826114fe9190612bb9565b9050919050565b6000608060ff168260ff161015611548576040517f866f6e8700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6080826115559190612bb9565b9050919050565b600061156730610589565b156115e2573073ffffffffffffffffffffffffffffffffffffffff16638da5cb5b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156115b7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115db919061275f565b905061168a565b60003073ffffffffffffffffffffffffffffffffffffffff1663a0e67e2b6040518163ffffffff1660e01b8152600401600060405180830381865afa15801561162f573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906116589190612cb1565b905060018151146116695730611686565b8060008151811061167d5761167c612920565b5b60200260200101515b9150505b90565b60006116ef826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff166117559092919063ffffffff16565b90506000815114806117115750808060200190518101906117109190612617565b5b611750576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161174790612d6c565b60405180910390fd5b505050565b6060611764848460008561176d565b90509392505050565b606061177885611886565b6117ae576040517f304619b500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000808673ffffffffffffffffffffffffffffffffffffffff1685876040516117d79190612d8c565b60006040518083038185875af1925050503d8060008114611814576040519150601f19603f3d011682016040523d82523d6000602084013e611819565b606091505b5091509150811561182e57809250505061187e565b6000815111156118415780518082602001fd5b836040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016118759190612de7565b60405180910390fd5b949350505050565b60008060007fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a47060001b9050833f91508082141580156118c857506000801b8214155b92505050919050565b6040518060a00160405280600061ffff16815260200160001515815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff1681525090565b600061ffff82169050919050565b61194981611932565b82525050565b60006020820190506119646000830184611940565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006119af6119aa6119a58461196a565b61198a565b61196a565b9050919050565b60006119c182611994565b9050919050565b60006119d3826119b6565b9050919050565b6119e3816119c8565b82525050565b60006020820190506119fe60008301846119da565b92915050565b6000604051905090565b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611a6682611a1d565b810181811067ffffffffffffffff82111715611a8557611a84611a2e565b5b80604052505050565b6000611a98611a04565b9050611aa48282611a5d565b919050565b611ab281611932565b8114611abd57600080fd5b50565b600081359050611acf81611aa9565b92915050565b60008115159050919050565b611aea81611ad5565b8114611af557600080fd5b50565b600081359050611b0781611ae1565b92915050565b6000819050919050565b611b2081611b0d565b8114611b2b57600080fd5b50565b600081359050611b3d81611b17565b92915050565b6000611b4e8261196a565b9050919050565b611b5e81611b43565b8114611b6957600080fd5b50565b600081359050611b7b81611b55565b92915050565b600060a08284031215611b9757611b96611a18565b5b611ba160a0611a8e565b90506000611bb184828501611ac0565b6000830152506020611bc584828501611af8565b6020830152506040611bd984828501611b2e565b6040830152506060611bed84828501611b6c565b6060830152506080611c0184828501611b6c565b60808301525092915050565b600060a08284031215611c2357611c22611a0e565b5b6000611c3184828501611b81565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611c74578082015181840152602081019050611c59565b60008484015250505050565b6000611c8b82611c3a565b611c958185611c45565b9350611ca5818560208601611c56565b611cae81611a1d565b840191505092915050565b60006020820190508181036000830152611cd38184611c80565b905092915050565b600060ff82169050919050565b611cf181611cdb565b82525050565b6000602082019050611d0c6000830184611ce8565b92915050565b600060208284031215611d2857611d27611a0e565b5b6000611d3684828501611b6c565b91505092915050565b611d4881611ad5565b82525050565b6000602082019050611d636000830184611d3f565b92915050565b600080fd5b600080fd5b600067ffffffffffffffff821115611d8e57611d8d611a2e565b5b611d9782611a1d565b9050602081019050919050565b82818337600083830152505050565b6000611dc6611dc184611d73565b611a8e565b905082815260208101848484011115611de257611de1611d6e565b5b611ded848285611da4565b509392505050565b600082601f830112611e0a57611e09611d69565b5b8135611e1a848260208601611db3565b91505092915050565b600060208284031215611e3957611e38611a0e565b5b600082013567ffffffffffffffff811115611e5757611e56611a13565b5b611e6384828501611df5565b91505092915050565b6000611e77826119b6565b9050919050565b611e8781611e6c565b82525050565b6000602082019050611ea26000830184611e7e565b92915050565b600080fd5b600080fd5b60008083601f840112611ec857611ec7611d69565b5b8235905067ffffffffffffffff811115611ee557611ee4611ea8565b5b602083019150836001820283011115611f0157611f00611ead565b5b9250929050565b60008060208385031215611f1f57611f1e611a0e565b5b600083013567ffffffffffffffff811115611f3d57611f3c611a13565b5b611f4985828601611eb2565b92509250509250929050565b611f5e81611932565b82525050565b611f6d81611ad5565b82525050565b611f7c81611b0d565b82525050565b611f8b81611b43565b82525050565b60a082016000820151611fa76000850182611f55565b506020820151611fba6020850182611f64565b506040820151611fcd6040850182611f73565b506060820151611fe06060850182611f82565b506080820151611ff36080850182611f82565b50505050565b600060a08201905061200e6000830184611f91565b92915050565b600067ffffffffffffffff82111561202f5761202e611a2e565b5b602082029050602081019050919050565b6000819050919050565b61205381612040565b811461205e57600080fd5b50565b6000813590506120708161204a565b92915050565b600061208961208484612014565b611a8e565b905080838252602082019050602084028301858111156120ac576120ab611ead565b5b835b818110156120d557806120c18882612061565b8452602084019350506020810190506120ae565b5050509392505050565b600082601f8301126120f4576120f3611d69565b5b8135612104848260208601612076565b91505092915050565b600067ffffffffffffffff82111561212857612127611a2e565b5b602082029050602081019050919050565b61214281611cdb565b811461214d57600080fd5b50565b60008135905061215f81612139565b92915050565b60006121786121738461210d565b611a8e565b9050808382526020820190506020840283018581111561219b5761219a611ead565b5b835b818110156121c457806121b08882612150565b84526020840193505060208101905061219d565b5050509392505050565b600082601f8301126121e3576121e2611d69565b5b81356121f3848260208601612165565b91505092915050565b6000806000806080858703121561221657612215611a0e565b5b600085013567ffffffffffffffff81111561223457612233611a13565b5b61224087828801611df5565b945050602085013567ffffffffffffffff81111561226157612260611a13565b5b61226d878288016120df565b935050604085013567ffffffffffffffff81111561228e5761228d611a13565b5b61229a878288016121ce565b925050606085013567ffffffffffffffff8111156122bb576122ba611a13565b5b6122c7878288016120df565b91505092959194509250565b6122dc81612040565b82525050565b60006020820190506122f760008301846122d3565b92915050565b60008060006060848603121561231657612315611a0e565b5b600061232486828701611b6c565b935050602061233586828701611b6c565b925050604061234686828701611b2e565b9150509250925092565b600061235b826119b6565b9050919050565b61236b81612350565b82525050565b60006020820190506123866000830184612362565b92915050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6000819050919050565b6123d36123ce8261238c565b6123b8565b82525050565b60006123e582846123c2565b60048201915081905092915050565b600081905092915050565b600061240a82611c3a565b61241481856123f4565b9350612424818560208601611c56565b80840191505092915050565b60007fffff00000000000000000000000000000000000000000000000000000000000082169050919050565b6000819050919050565b61247761247282612430565b61245c565b82525050565b600061248982856123ff565b91506124958284612466565b6002820191508190509392505050565b60007fff0000000000000000000000000000000000000000000000000000000000000082169050919050565b6000819050919050565b6124ec6124e7826124a5565b6124d1565b82525050565b60006124fe82856123ff565b915061250a82846124db565b6001820191508190509392505050565b6000819050919050565b61253561253082612040565b61251a565b82525050565b600061254782856123ff565b91506125538284612524565b6020820191508190509392505050565b60007fffffffffffffffffffffffffffffffffffffffff00000000000000000000000082169050919050565b6000819050919050565b6125aa6125a582612563565b61258f565b82525050565b60006125bc82856123ff565b91506125c88284612599565b6014820191508190509392505050565b6125e181611b43565b82525050565b60006020820190506125fc60008301846125d8565b92915050565b60008151905061261181611ae1565b92915050565b60006020828403121561262d5761262c611a0e565b5b600061263b84828501612602565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600080fd5b600080fd5b6000808585111561269157612690612673565b5b838611156126a2576126a1612678565b5b6001850283019150848603905094509492505050565b600082825260208201905092915050565b7f4161766557697468647261770000000000000000000000000000000000000000600082015250565b60006126ff600c836126b8565b915061270a826126c9565b602082019050919050565b6000604082019050818103600083015261272e816126f2565b905081810360208301526127428184611c80565b905092915050565b60008151905061275981611b55565b92915050565b60006020828403121561277557612774611a0e565b5b60006127838482850161274a565b91505092915050565b600082905092915050565b600082821b905092915050565b60006127b0838361278c565b826127bb8135612430565b925060028210156127fb576127f67fffff00000000000000000000000000000000000000000000000000000000000083600203600802612797565b831692505b505092915050565b600061280f838361278c565b8261281a81356124a5565b9250600182101561285a576128557fff0000000000000000000000000000000000000000000000000000000000000083600103600802612797565b831692505b505092915050565b600061286e838361278c565b826128798135612040565b925060208210156128b9576128b47fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff83602003600802612797565b831692505b505092915050565b60006128cd838361278c565b826128d88135612563565b92506014821015612918576129137fffffffffffffffffffffffffffffffffffffffff00000000000000000000000083601403600802612797565b831692505b505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600081905092915050565b6000612967600c8361294f565b9150612972826126c9565b600c82019050919050565b60006129888261295a565b9150819050919050565b6000815190506129a181611aa9565b92915050565b6000815190506129b681611b17565b92915050565b600060a082840312156129d2576129d1611a18565b5b6129dc60a0611a8e565b905060006129ec84828501612992565b6000830152506020612a0084828501612602565b6020830152506040612a14848285016129a7565b6040830152506060612a288482850161274a565b6060830152506080612a3c8482850161274a565b60808301525092915050565b600060a08284031215612a5e57612a5d611a0e565b5b6000612a6c848285016129bc565b91505092915050565b612a7e81611b0d565b82525050565b6000606082019050612a9960008301866125d8565b612aa66020830185612a75565b612ab360408301846125d8565b949350505050565b600060208284031215612ad157612ad0611a0e565b5b6000612adf848285016129a7565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000612b2282611b0d565b9150612b2d83611b0d565b9250828203905081811115612b4557612b44612ae8565b5b92915050565b6000608082019050612b6060008301876125d8565b612b6d60208301866125d8565b612b7a6040830185612a75565b612b8760608301846125d8565b95945050505050565b6000604082019050612ba560008301856125d8565b612bb26020830184612a75565b9392505050565b6000612bc482611cdb565b9150612bcf83611cdb565b9250828203905060ff811115612be857612be7612ae8565b5b92915050565b600067ffffffffffffffff821115612c0957612c08611a2e565b5b602082029050602081019050919050565b6000612c2d612c2884612bee565b611a8e565b90508083825260208201905060208402830185811115612c5057612c4f611ead565b5b835b81811015612c795780612c65888261274a565b845260208401935050602081019050612c52565b5050509392505050565b600082601f830112612c9857612c97611d69565b5b8151612ca8848260208601612c1a565b91505092915050565b600060208284031215612cc757612cc6611a0e565b5b600082015167ffffffffffffffff811115612ce557612ce4611a13565b5b612cf184828501612c83565b91505092915050565b7f5361666545524332303a204552433230206f7065726174696f6e20646964206e60008201527f6f74207375636365656400000000000000000000000000000000000000000000602082015250565b6000612d56602a836126b8565b9150612d6182612cfa565b604082019050919050565b60006020820190508181036000830152612d8581612d49565b9050919050565b6000612d9882846123ff565b915081905092915050565b600081519050919050565b6000612db982612da3565b612dc381856126b8565b9350612dd3818560208601611c56565b612ddc81611a1d565b840191505092915050565b60006020820190508181036000830152612e018184612dae565b90509291505056fea2646970667358221220b643f072a4dedce059793b97ac21397ba05e1a1190f605401b6d112531b02a8b64736f6c63430008180033";

type AaveWithdrawConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AaveWithdrawConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AaveWithdraw__factory extends ContractFactory {
  constructor(...args: AaveWithdrawConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      AaveWithdraw & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): AaveWithdraw__factory {
    return super.connect(runner) as AaveWithdraw__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AaveWithdrawInterface {
    return new Interface(_abi) as AaveWithdrawInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): AaveWithdraw {
    return new Contract(address, _abi, runner) as unknown as AaveWithdraw;
  }
}
