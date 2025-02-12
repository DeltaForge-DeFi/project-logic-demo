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
  DefisaverLogger,
  DefisaverLoggerInterface,
} from "../../../../contracts/common/utils/DefisaverLogger";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
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
    name: "ActionDirectEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "logName",
        type: "string",
      },
    ],
    name: "RecipeEvent",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_logName",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "logActionDirectEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_logName",
        type: "string",
      },
    ],
    name: "logRecipeEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50610528806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806305fedae51461003b578063f4b24b5514610057575b600080fd5b61005560048036038101906100509190610291565b610073565b005b610071600480360381019061006c919061037b565b6100cf565b005b806040516100819190610464565b60405180910390203373ffffffffffffffffffffffffffffffffffffffff167fb6cd938f99beba85b61cc813aa1c12ba1b95f797dfb6ddd567c0f361f3e7757460405160405180910390a350565b816040516100dd9190610464565b60405180910390203373ffffffffffffffffffffffffffffffffffffffff167ff28c1e8e1a8c97027796e625e1ed041028c9642e14da6e7ad2c18838a59a2d8c8360405161012b91906104d0565b60405180910390a35050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61019e82610155565b810181811067ffffffffffffffff821117156101bd576101bc610166565b5b80604052505050565b60006101d0610137565b90506101dc8282610195565b919050565b600067ffffffffffffffff8211156101fc576101fb610166565b5b61020582610155565b9050602081019050919050565b82818337600083830152505050565b600061023461022f846101e1565b6101c6565b9050828152602081018484840111156102505761024f610150565b5b61025b848285610212565b509392505050565b600082601f8301126102785761027761014b565b5b8135610288848260208601610221565b91505092915050565b6000602082840312156102a7576102a6610141565b5b600082013567ffffffffffffffff8111156102c5576102c4610146565b5b6102d184828501610263565b91505092915050565b600067ffffffffffffffff8211156102f5576102f4610166565b5b6102fe82610155565b9050602081019050919050565b600061031e610319846102da565b6101c6565b90508281526020810184848401111561033a57610339610150565b5b610345848285610212565b509392505050565b600082601f8301126103625761036161014b565b5b813561037284826020860161030b565b91505092915050565b6000806040838503121561039257610391610141565b5b600083013567ffffffffffffffff8111156103b0576103af610146565b5b6103bc85828601610263565b925050602083013567ffffffffffffffff8111156103dd576103dc610146565b5b6103e98582860161034d565b9150509250929050565b600081519050919050565b600081905092915050565b60005b8381101561042757808201518184015260208101905061040c565b60008484015250505050565b600061043e826103f3565b61044881856103fe565b9350610458818560208601610409565b80840191505092915050565b60006104708284610433565b915081905092915050565b600081519050919050565b600082825260208201905092915050565b60006104a28261047b565b6104ac8185610486565b93506104bc818560208601610409565b6104c581610155565b840191505092915050565b600060208201905081810360008301526104ea8184610497565b90509291505056fea26469706673582212203833ac89926b66b1d5b7d39b461f08f6cf68103d0b2b84c2057a1395a21d583f64736f6c63430008180033";

type DefisaverLoggerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DefisaverLoggerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DefisaverLogger__factory extends ContractFactory {
  constructor(...args: DefisaverLoggerConstructorParams) {
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
      DefisaverLogger & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): DefisaverLogger__factory {
    return super.connect(runner) as DefisaverLogger__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DefisaverLoggerInterface {
    return new Interface(_abi) as DefisaverLoggerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): DefisaverLogger {
    return new Contract(address, _abi, runner) as unknown as DefisaverLogger;
  }
}
