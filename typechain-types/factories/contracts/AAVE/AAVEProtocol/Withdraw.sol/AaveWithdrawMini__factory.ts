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
import type { NonPayableOverrides } from "../../../../../common";
import type {
  AaveWithdrawMini,
  AaveWithdrawMiniInterface,
} from "../../../../../contracts/AAVE/AAVEProtocol/Withdraw.sol/AaveWithdrawMini";

const _abi = [
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
    inputs: [
      {
        internalType: "address",
        name: "_market",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506104ba806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806305a363de1461003b5780630e917f7614610059575b600080fd5b610043610075565b6040516100509190610213565b60405180910390f35b610073600480360381019061006e91906102c7565b61007a565b005b604081565b60006100858561017e565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100f6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100ed9061038b565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff166369328dec8585856040518463ffffffff1660e01b8152600401610133939291906103c9565b6020604051808303816000875af1158015610152573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101769190610415565b505050505050565b60008173ffffffffffffffffffffffffffffffffffffffff1663026b1d5f6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156101cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101ef9190610457565b9050919050565b600061ffff82169050919050565b61020d816101f6565b82525050565b60006020820190506102286000830184610204565b92915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061025e82610233565b9050919050565b61026e81610253565b811461027957600080fd5b50565b60008135905061028b81610265565b92915050565b6000819050919050565b6102a481610291565b81146102af57600080fd5b50565b6000813590506102c18161029b565b92915050565b600080600080608085870312156102e1576102e061022e565b5b60006102ef8782880161027c565b94505060206103008782880161027c565b9350506040610311878288016102b2565b92505060606103228782880161027c565b91505092959194509250565b600082825260208201905092915050565b7f496e76616c6964206d61726b6574000000000000000000000000000000000000600082015250565b6000610375600e8361032e565b91506103808261033f565b602082019050919050565b600060208201905081810360008301526103a481610368565b9050919050565b6103b481610253565b82525050565b6103c381610291565b82525050565b60006060820190506103de60008301866103ab565b6103eb60208301856103ba565b6103f860408301846103ab565b949350505050565b60008151905061040f8161029b565b92915050565b60006020828403121561042b5761042a61022e565b5b600061043984828501610400565b91505092915050565b60008151905061045181610265565b92915050565b60006020828403121561046d5761046c61022e565b5b600061047b84828501610442565b9150509291505056fea2646970667358221220b58d3bfce2d1a8b68dc6a2f96265b256b5e7beefaacfbe5dc2bde8f448019a2564736f6c63430008180033";

type AaveWithdrawMiniConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AaveWithdrawMiniConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AaveWithdrawMini__factory extends ContractFactory {
  constructor(...args: AaveWithdrawMiniConstructorParams) {
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
      AaveWithdrawMini & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): AaveWithdrawMini__factory {
    return super.connect(runner) as AaveWithdrawMini__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AaveWithdrawMiniInterface {
    return new Interface(_abi) as AaveWithdrawMiniInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): AaveWithdrawMini {
    return new Contract(address, _abi, runner) as unknown as AaveWithdrawMini;
  }
}
