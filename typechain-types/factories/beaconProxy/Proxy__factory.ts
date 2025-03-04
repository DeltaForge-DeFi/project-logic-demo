/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type { Proxy, ProxyInterface } from "../../beaconProxy/Proxy";

const _abi = [
  {
    stateMutability: "payable",
    type: "fallback",
  },
] as const;

export class Proxy__factory {
  static readonly abi = _abi;
  static createInterface(): ProxyInterface {
    return new Interface(_abi) as ProxyInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Proxy {
    return new Contract(address, _abi, runner) as unknown as Proxy;
  }
}
