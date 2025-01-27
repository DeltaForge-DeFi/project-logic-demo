import { ethers } from "ethers";
import { DSProxyService } from "./dsProxy";
import { AAVE_WITHDRAW_ABI } from "../../../../source/AAVE/abis/AaveWithdrawAbi";

export interface AaveWithdrawParams {
  assetId: number;
  useDefaultMarket: boolean;
  amount: ethers.BigNumberish;
  to: string;
  market: string;
}

export class AaveWithdrawService {
  private contract: ethers.Contract;

  constructor(
    private aaveWithdrawAddress: string,
    private dsProxyService: DSProxyService,
    signer: ethers.Signer
  ) {
    this.contract = new ethers.Contract(
      aaveWithdrawAddress,
      AAVE_WITHDRAW_ABI,
      signer
    );
  }

  public async withdraw(params: AaveWithdrawParams) {
    try {
      // Кодируем параметры для вызова executeActionDirect
      const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint16", "bool", "uint256", "address", "address"],
        [
          params.assetId,
          params.useDefaultMarket,
          params.amount,
          params.to,
          params.market,
        ]
      );

      // Кодируем вызов executeActionDirect
      const executeData = this.contract.interface.encodeFunctionData(
        "executeActionDirect",
        [encodedParams]
      );

      // Выполняем через DSProxy
      const receipt = await this.dsProxyService.executeTarget(
        this.aaveWithdrawAddress,
        executeData,
        {
          gasLimit: 2000000,
        }
      );

      return receipt;
    } catch (error) {
      console.error("Ошибка при выполнении withdraw через DSProxy:", error);
      throw error;
    }
  }
}

export const createAaveWithdrawService = (
  aaveWithdrawAddress: string,
  dsProxyService: DSProxyService,
  signer: ethers.Signer
): AaveWithdrawService => {
  return new AaveWithdrawService(aaveWithdrawAddress, dsProxyService, signer);
};
