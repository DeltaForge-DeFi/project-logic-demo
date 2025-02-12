/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../../common";

export type CreateOrderParamsAddressesStruct = {
  receiver: AddressLike;
  cancellationReceiver: AddressLike;
  callbackContract: AddressLike;
  uiFeeReceiver: AddressLike;
  market: AddressLike;
  initialCollateralToken: AddressLike;
  swapPath: AddressLike[];
};

export type CreateOrderParamsAddressesStructOutput = [
  receiver: string,
  cancellationReceiver: string,
  callbackContract: string,
  uiFeeReceiver: string,
  market: string,
  initialCollateralToken: string,
  swapPath: string[]
] & {
  receiver: string;
  cancellationReceiver: string;
  callbackContract: string;
  uiFeeReceiver: string;
  market: string;
  initialCollateralToken: string;
  swapPath: string[];
};

export type CreateOrderParamsNumbersStruct = {
  sizeDeltaUsd: BigNumberish;
  initialCollateralDeltaAmount: BigNumberish;
  triggerPrice: BigNumberish;
  acceptablePrice: BigNumberish;
  executionFee: BigNumberish;
  callbackGasLimit: BigNumberish;
  minOutputAmount: BigNumberish;
  validFromTime: BigNumberish;
};

export type CreateOrderParamsNumbersStructOutput = [
  sizeDeltaUsd: bigint,
  initialCollateralDeltaAmount: bigint,
  triggerPrice: bigint,
  acceptablePrice: bigint,
  executionFee: bigint,
  callbackGasLimit: bigint,
  minOutputAmount: bigint,
  validFromTime: bigint
] & {
  sizeDeltaUsd: bigint;
  initialCollateralDeltaAmount: bigint;
  triggerPrice: bigint;
  acceptablePrice: bigint;
  executionFee: bigint;
  callbackGasLimit: bigint;
  minOutputAmount: bigint;
  validFromTime: bigint;
};

export type OrderParamsStruct = {
  addresses: CreateOrderParamsAddressesStruct;
  numbers: CreateOrderParamsNumbersStruct;
  orderType: BigNumberish;
  decreasePositionSwapType: BigNumberish;
  isLong: boolean;
  shouldUnwrapNativeToken: boolean;
  autoCancel: boolean;
  referralCode: BytesLike;
};

export type OrderParamsStructOutput = [
  addresses: CreateOrderParamsAddressesStructOutput,
  numbers: CreateOrderParamsNumbersStructOutput,
  orderType: bigint,
  decreasePositionSwapType: bigint,
  isLong: boolean,
  shouldUnwrapNativeToken: boolean,
  autoCancel: boolean,
  referralCode: string
] & {
  addresses: CreateOrderParamsAddressesStructOutput;
  numbers: CreateOrderParamsNumbersStructOutput;
  orderType: bigint;
  decreasePositionSwapType: bigint;
  isLong: boolean;
  shouldUnwrapNativeToken: boolean;
  autoCancel: boolean;
  referralCode: string;
};

export interface IExchangeRouterInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "cancelOrder"
      | "createOrder"
      | "createWithdrawal"
      | "multicall"
      | "sendTokens"
      | "sendWnt"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "cancelOrder",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "createOrder",
    values: [OrderParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "createWithdrawal",
    values: [OrderParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "multicall",
    values: [BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "sendTokens",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "sendWnt",
    values: [AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "cancelOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createWithdrawal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "multicall", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sendTokens", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sendWnt", data: BytesLike): Result;
}

export interface IExchangeRouter extends BaseContract {
  connect(runner?: ContractRunner | null): IExchangeRouter;
  waitForDeployment(): Promise<this>;

  interface: IExchangeRouterInterface;

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

  cancelOrder: TypedContractMethod<[key: BytesLike], [void], "payable">;

  createOrder: TypedContractMethod<
    [params: OrderParamsStruct],
    [void],
    "nonpayable"
  >;

  createWithdrawal: TypedContractMethod<
    [params: OrderParamsStruct],
    [void],
    "nonpayable"
  >;

  multicall: TypedContractMethod<[data: BytesLike[]], [string[]], "payable">;

  sendTokens: TypedContractMethod<
    [token: AddressLike, to: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  sendWnt: TypedContractMethod<
    [receiver: AddressLike, amount: BigNumberish],
    [void],
    "payable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "cancelOrder"
  ): TypedContractMethod<[key: BytesLike], [void], "payable">;
  getFunction(
    nameOrSignature: "createOrder"
  ): TypedContractMethod<[params: OrderParamsStruct], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "createWithdrawal"
  ): TypedContractMethod<[params: OrderParamsStruct], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "multicall"
  ): TypedContractMethod<[data: BytesLike[]], [string[]], "payable">;
  getFunction(
    nameOrSignature: "sendTokens"
  ): TypedContractMethod<
    [token: AddressLike, to: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "sendWnt"
  ): TypedContractMethod<
    [receiver: AddressLike, amount: BigNumberish],
    [void],
    "payable"
  >;

  filters: {};
}
