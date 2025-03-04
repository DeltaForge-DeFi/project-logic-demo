/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BytesLike,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { PayableOverrides } from "../../../common";
import type {
  BeaconProxy,
  BeaconProxyInterface,
} from "../../../beaconProxy/beacon/BeaconProxy";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "beacon",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "ERC1967InvalidBeacon",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "ERC1967InvalidImplementation",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967NonPayable",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedCall",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
] as const;

const _bytecode =
  "0x60a060405260405161096038038061096083398181016040528101906100259190610684565b610035828261007060201b60201c565b8173ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250505050610795565b61007f8261016360201b60201c565b8173ffffffffffffffffffffffffffffffffffffffff167f1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e60405160405180910390a26000815111156101505761014a8273ffffffffffffffffffffffffffffffffffffffff16635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561011a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061013e91906106e0565b8261030660201b60201c565b5061015f565b61015e61039060201b60201c565b5b5050565b60008173ffffffffffffffffffffffffffffffffffffffff163b036101bf57806040517f64ced0ec0000000000000000000000000000000000000000000000000000000081526004016101b6919061071c565b60405180910390fd5b806101f27fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d5060001b6103cd60201b60201c565b60000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008173ffffffffffffffffffffffffffffffffffffffff16635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610280573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102a491906106e0565b905060008173ffffffffffffffffffffffffffffffffffffffff163b0361030257806040517f4c9c8ce30000000000000000000000000000000000000000000000000000000081526004016102f9919061071c565b60405180910390fd5b5050565b60606000808473ffffffffffffffffffffffffffffffffffffffff1684604051610330919061077e565b600060405180830381855af49150503d806000811461036b576040519150601f19603f3d011682016040523d82523d6000602084013e610370565b606091505b50915091506103868583836103d760201b60201c565b9250505092915050565b60003411156103cb576040517fb398979f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b6000819050919050565b6060826103f2576103ed8261046c60201b60201c565b610464565b6000825114801561041a575060008473ffffffffffffffffffffffffffffffffffffffff163b145b1561045c57836040517f9996b315000000000000000000000000000000000000000000000000000000008152600401610453919061071c565b60405180910390fd5b819050610465565b5b9392505050565b60008151111561047f5780518082602001fd5b6040517fd6bda27500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006104f0826104c5565b9050919050565b610500816104e5565b811461050b57600080fd5b50565b60008151905061051d816104f7565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6105768261052d565b810181811067ffffffffffffffff821117156105955761059461053e565b5b80604052505050565b60006105a86104b1565b90506105b4828261056d565b919050565b600067ffffffffffffffff8211156105d4576105d361053e565b5b6105dd8261052d565b9050602081019050919050565b60005b838110156106085780820151818401526020810190506105ed565b60008484015250505050565b6000610627610622846105b9565b61059e565b90508281526020810184848401111561064357610642610528565b5b61064e8482856105ea565b509392505050565b600082601f83011261066b5761066a610523565b5b815161067b848260208601610614565b91505092915050565b6000806040838503121561069b5761069a6104bb565b5b60006106a98582860161050e565b925050602083015167ffffffffffffffff8111156106ca576106c96104c0565b5b6106d685828601610656565b9150509250929050565b6000602082840312156106f6576106f56104bb565b5b60006107048482850161050e565b91505092915050565b610716816104e5565b82525050565b6000602082019050610731600083018461070d565b92915050565b600081519050919050565b600081905092915050565b600061075882610737565b6107628185610742565b93506107728185602086016105ea565b80840191505092915050565b600061078a828461074d565b915081905092915050565b6080516101b16107af600039600060c701526101b16000f3fe608060405261000c61000e565b005b61001e610019610020565b61009d565b565b600061002a6100c3565b73ffffffffffffffffffffffffffffffffffffffff16635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610074573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610098919061014e565b905090565b3660008037600080366000845af43d6000803e80600081146100be573d6000f35b3d6000fd5b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061011b826100f0565b9050919050565b61012b81610110565b811461013657600080fd5b50565b60008151905061014881610122565b92915050565b600060208284031215610164576101636100eb565b5b600061017284828501610139565b9150509291505056fea26469706673582212200c6c022ae3ee6aedf2d156a122455fca8b21172779d484b2c1aac01261a1555164736f6c634300081c0033";

type BeaconProxyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BeaconProxyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BeaconProxy__factory extends ContractFactory {
  constructor(...args: BeaconProxyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    beacon: AddressLike,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(beacon, data, overrides || {});
  }
  override deploy(
    beacon: AddressLike,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string }
  ) {
    return super.deploy(beacon, data, overrides || {}) as Promise<
      BeaconProxy & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): BeaconProxy__factory {
    return super.connect(runner) as BeaconProxy__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BeaconProxyInterface {
    return new Interface(_abi) as BeaconProxyInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): BeaconProxy {
    return new Contract(address, _abi, runner) as unknown as BeaconProxy;
  }
}
