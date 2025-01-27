// src/contracts/aaveSupply.ts
import { ethers } from "ethers";
import { DSProxyService } from "./dsProxy";
import { AaveSupplyAbi } from "../../../../source/AAVE/abis/AaveSupplyAbi";
import { getAaveSupplyContract } from "../../../../source/AAVE/config/assets";
import { checkAllowance, approve } from "../utils/approve";

export interface AaveSupplyParams {
  amount: string;
  from: string;
  assetId: number;
  enableAsColl?: boolean;
  useDefaultMarket?: boolean;
  useOnBehalf?: boolean;
  market?: string;
  onBehalf?: string;
}

export interface SupplyParams {
  assetId: number;
  useDefaultMarket: boolean;
  amount: ethers.BigNumberish;
  onBehalfOf: string;
  market: string;
}

export class AaveSupplyService {
  private dsProxyService: DSProxyService;
  private aaveSupplyAddress: string;

  constructor(dsProxyService: DSProxyService) {
    this.dsProxyService = dsProxyService;
    this.aaveSupplyAddress = getAaveSupplyContract();
  }

  /**
   * Выполняет supply токенов в Aave через DSProxy
   */
  public async supply(params: AaveSupplyParams) {
    try {
      const supplyParams = {
        amount: params.amount,
        from: params.from,
        assetId: params.assetId,
        enableAsColl: params.enableAsColl ?? false,
        useDefaultMarket: params.useDefaultMarket ?? true,
        useOnBehalf: params.useOnBehalf ?? false,
        market: params.market ?? ethers.ZeroAddress,
        onBehalf: params.onBehalf ?? ethers.ZeroAddress,
      };

      // Первый шаг - кодируем параметры supply
      const callData = ethers.AbiCoder.defaultAbiCoder().encode(
        [
          "uint256",
          "address",
          "uint16",
          "bool",
          "bool",
          "bool",
          "address",
          "address",
        ],
        [
          supplyParams.amount,
          supplyParams.from,
          supplyParams.assetId,
          supplyParams.enableAsColl,
          supplyParams.useDefaultMarket,
          supplyParams.useOnBehalf,
          supplyParams.market,
          supplyParams.onBehalf,
        ]
      );

      // Создаем интерфейс AaveSupply
      const aaveSupplyInterface = new ethers.Interface([
        "function executeActionDirect(bytes memory _callData) public payable",
      ]);

      // Кодируем вызов executeActionDirect с закодированными параметрами
      const executeData = aaveSupplyInterface.encodeFunctionData(
        "executeActionDirect",
        [callData]
      );

      // Выполняем через DSProxy
      const receipt = await this.dsProxyService.executeTarget(
        this.aaveSupplyAddress,
        executeData,
        {
          gasLimit: 1000000,
        }
      );

      return receipt;
    } catch (error) {
      console.error("Ошибка при выполнении supply через DSProxy:", error);
      throw error;
    }
  }

  /**
   * Проверяет и устанавливает разрешение на токен для DSProxy
   */
  public async checkAndApproveToken(
    tokenAddress: string,
    amount: string,
    owner: string,
    client: any
  ) {
    try {
      const dsProxyAddress = await this.dsProxyService.getContractAddress();

      // Проверяем текущий allowance
      const currentAllowance = await checkAllowance(
        client,
        tokenAddress,
        owner,
        dsProxyAddress
      );

      // Если allowance меньше требуемой суммы, выполняем approve
      if (currentAllowance < amount) {
        const approveTx = await approve(
          client,
          tokenAddress,
          dsProxyAddress,
          amount
        );
        await approveTx.wait();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Ошибка при проверке/установке разрешения:", error);
      throw error;
    }
  }
}

// Функция для создания сервиса
export const createAaveSupplyService = (dsProxyService: DSProxyService) => {
  return new AaveSupplyService(dsProxyService);
};
