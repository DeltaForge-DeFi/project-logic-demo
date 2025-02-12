/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IDSProxyFactory,
  IDSProxyFactoryInterface,
} from "../../../../contracts/DSProxy/interfaces/IDSProxyFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_proxy",
        type: "address",
      },
    ],
    name: "isProxy",
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
] as const;

export class IDSProxyFactory__factory {
  static readonly abi = _abi;
  static createInterface(): IDSProxyFactoryInterface {
    return new Interface(_abi) as IDSProxyFactoryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IDSProxyFactory {
    return new Contract(address, _abi, runner) as unknown as IDSProxyFactory;
  }
}
