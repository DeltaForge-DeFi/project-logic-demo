/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../../common";

export interface DSProxyFactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "build()"
      | "build(address)"
      | "getProxyByOwner"
      | "isProxy"
      | "ownerToProxy"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "Created"): EventFragment;

  encodeFunctionData(functionFragment: "build()", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "build(address)",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getProxyByOwner",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isProxy",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "ownerToProxy",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "build()", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "build(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getProxyByOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isProxy", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ownerToProxy",
    data: BytesLike
  ): Result;
}

export namespace CreatedEvent {
  export type InputTuple = [
    sender: AddressLike,
    owner: AddressLike,
    proxy: AddressLike,
    cache: AddressLike
  ];
  export type OutputTuple = [
    sender: string,
    owner: string,
    proxy: string,
    cache: string
  ];
  export interface OutputObject {
    sender: string;
    owner: string;
    proxy: string;
    cache: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface DSProxyFactory extends BaseContract {
  connect(runner?: ContractRunner | null): DSProxyFactory;
  waitForDeployment(): Promise<this>;

  interface: DSProxyFactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  "build()": TypedContractMethod<[], [string], "nonpayable">;

  "build(address)": TypedContractMethod<
    [owner: AddressLike],
    [string],
    "nonpayable"
  >;

  getProxyByOwner: TypedContractMethod<[owner: AddressLike], [string], "view">;

  isProxy: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  ownerToProxy: TypedContractMethod<[arg0: AddressLike], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "build()"
  ): TypedContractMethod<[], [string], "nonpayable">;
  getFunction(
    nameOrSignature: "build(address)"
  ): TypedContractMethod<[owner: AddressLike], [string], "nonpayable">;
  getFunction(
    nameOrSignature: "getProxyByOwner"
  ): TypedContractMethod<[owner: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "isProxy"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "ownerToProxy"
  ): TypedContractMethod<[arg0: AddressLike], [string], "view">;

  getEvent(
    key: "Created"
  ): TypedContractEvent<
    CreatedEvent.InputTuple,
    CreatedEvent.OutputTuple,
    CreatedEvent.OutputObject
  >;

  filters: {
    "Created(address,address,address,address)": TypedContractEvent<
      CreatedEvent.InputTuple,
      CreatedEvent.OutputTuple,
      CreatedEvent.OutputObject
    >;
    Created: TypedContractEvent<
      CreatedEvent.InputTuple,
      CreatedEvent.OutputTuple,
      CreatedEvent.OutputObject
    >;
  };
}
