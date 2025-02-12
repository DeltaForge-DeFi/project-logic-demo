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
} from "../../../common";

export declare namespace AaveBorrow {
  export type ParamsStruct = {
    amount: BigNumberish;
    to: AddressLike;
    rateMode: BigNumberish;
    assetId: BigNumberish;
    useDefaultMarket: boolean;
    useOnBehalf: boolean;
    market: AddressLike;
    onBehalf: AddressLike;
  };

  export type ParamsStructOutput = [
    amount: bigint,
    to: string,
    rateMode: bigint,
    assetId: bigint,
    useDefaultMarket: boolean,
    useOnBehalf: boolean,
    market: string,
    onBehalf: string
  ] & {
    amount: bigint;
    to: string;
    rateMode: bigint;
    assetId: bigint;
    useDefaultMarket: boolean;
    useOnBehalf: boolean;
    market: string;
    onBehalf: string;
  };
}

export interface AaveBorrowInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "AAVE_REFERRAL_CODE"
      | "NO_PARAM_MAPPING"
      | "RETURN_MAX_INDEX_VALUE"
      | "RETURN_MIN_INDEX_VALUE"
      | "SUB_MAX_INDEX_VALUE"
      | "SUB_MIN_INDEX_VALUE"
      | "actionType"
      | "adminData"
      | "decodeInputs"
      | "encodeInputs"
      | "executeAction"
      | "executeActionDirect"
      | "executeActionDirectL2"
      | "isDSProxy"
      | "kill"
      | "logger"
      | "parseInputs"
      | "registry"
      | "withdrawStuckFunds"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "ActionEvent"): EventFragment;

  encodeFunctionData(
    functionFragment: "AAVE_REFERRAL_CODE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "NO_PARAM_MAPPING",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "RETURN_MAX_INDEX_VALUE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "RETURN_MIN_INDEX_VALUE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "SUB_MAX_INDEX_VALUE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "SUB_MIN_INDEX_VALUE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "actionType",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "adminData", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "decodeInputs",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "encodeInputs",
    values: [AaveBorrow.ParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "executeAction",
    values: [BytesLike, BytesLike[], BigNumberish[], BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "executeActionDirect",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "executeActionDirectL2",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isDSProxy",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "kill", values?: undefined): string;
  encodeFunctionData(functionFragment: "logger", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "parseInputs",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "registry", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdrawStuckFunds",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "AAVE_REFERRAL_CODE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "NO_PARAM_MAPPING",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "RETURN_MAX_INDEX_VALUE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "RETURN_MIN_INDEX_VALUE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "SUB_MAX_INDEX_VALUE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "SUB_MIN_INDEX_VALUE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "actionType", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "adminData", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "decodeInputs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "encodeInputs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeAction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeActionDirect",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeActionDirectL2",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isDSProxy", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "kill", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "logger", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "parseInputs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "registry", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawStuckFunds",
    data: BytesLike
  ): Result;
}

export namespace ActionEventEvent {
  export type InputTuple = [logName: string, data: BytesLike];
  export type OutputTuple = [logName: string, data: string];
  export interface OutputObject {
    logName: string;
    data: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface AaveBorrow extends BaseContract {
  connect(runner?: ContractRunner | null): AaveBorrow;
  waitForDeployment(): Promise<this>;

  interface: AaveBorrowInterface;

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

  AAVE_REFERRAL_CODE: TypedContractMethod<[], [bigint], "view">;

  NO_PARAM_MAPPING: TypedContractMethod<[], [bigint], "view">;

  RETURN_MAX_INDEX_VALUE: TypedContractMethod<[], [bigint], "view">;

  RETURN_MIN_INDEX_VALUE: TypedContractMethod<[], [bigint], "view">;

  SUB_MAX_INDEX_VALUE: TypedContractMethod<[], [bigint], "view">;

  SUB_MIN_INDEX_VALUE: TypedContractMethod<[], [bigint], "view">;

  actionType: TypedContractMethod<[], [bigint], "view">;

  adminData: TypedContractMethod<[], [string], "view">;

  decodeInputs: TypedContractMethod<
    [_encodedInput: BytesLike],
    [AaveBorrow.ParamsStructOutput],
    "view"
  >;

  encodeInputs: TypedContractMethod<
    [_params: AaveBorrow.ParamsStruct],
    [string],
    "view"
  >;

  executeAction: TypedContractMethod<
    [
      _callData: BytesLike,
      _subData: BytesLike[],
      _paramMapping: BigNumberish[],
      _returnValues: BytesLike[]
    ],
    [string],
    "payable"
  >;

  executeActionDirect: TypedContractMethod<
    [_callData: BytesLike],
    [void],
    "payable"
  >;

  executeActionDirectL2: TypedContractMethod<[], [void], "payable">;

  isDSProxy: TypedContractMethod<[_proxy: AddressLike], [boolean], "view">;

  kill: TypedContractMethod<[], [void], "nonpayable">;

  logger: TypedContractMethod<[], [string], "view">;

  parseInputs: TypedContractMethod<
    [_callData: BytesLike],
    [AaveBorrow.ParamsStructOutput],
    "view"
  >;

  registry: TypedContractMethod<[], [string], "view">;

  withdrawStuckFunds: TypedContractMethod<
    [_token: AddressLike, _receiver: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "AAVE_REFERRAL_CODE"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "NO_PARAM_MAPPING"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "RETURN_MAX_INDEX_VALUE"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "RETURN_MIN_INDEX_VALUE"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "SUB_MAX_INDEX_VALUE"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "SUB_MIN_INDEX_VALUE"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "actionType"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "adminData"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "decodeInputs"
  ): TypedContractMethod<
    [_encodedInput: BytesLike],
    [AaveBorrow.ParamsStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "encodeInputs"
  ): TypedContractMethod<[_params: AaveBorrow.ParamsStruct], [string], "view">;
  getFunction(
    nameOrSignature: "executeAction"
  ): TypedContractMethod<
    [
      _callData: BytesLike,
      _subData: BytesLike[],
      _paramMapping: BigNumberish[],
      _returnValues: BytesLike[]
    ],
    [string],
    "payable"
  >;
  getFunction(
    nameOrSignature: "executeActionDirect"
  ): TypedContractMethod<[_callData: BytesLike], [void], "payable">;
  getFunction(
    nameOrSignature: "executeActionDirectL2"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "isDSProxy"
  ): TypedContractMethod<[_proxy: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "kill"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "logger"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "parseInputs"
  ): TypedContractMethod<
    [_callData: BytesLike],
    [AaveBorrow.ParamsStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "registry"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "withdrawStuckFunds"
  ): TypedContractMethod<
    [_token: AddressLike, _receiver: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "ActionEvent"
  ): TypedContractEvent<
    ActionEventEvent.InputTuple,
    ActionEventEvent.OutputTuple,
    ActionEventEvent.OutputObject
  >;

  filters: {
    "ActionEvent(string,bytes)": TypedContractEvent<
      ActionEventEvent.InputTuple,
      ActionEventEvent.OutputTuple,
      ActionEventEvent.OutputObject
    >;
    ActionEvent: TypedContractEvent<
      ActionEventEvent.InputTuple,
      ActionEventEvent.OutputTuple,
      ActionEventEvent.OutputObject
    >;
  };
}
