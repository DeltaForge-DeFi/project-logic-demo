import { ethers } from "ethers";
import { DSProxyService } from "./dsProxy";
import { AAVE_BORROW_ABI } from "../../../../source/AAVE/abis/AaveBorrowAbi";

export interface AaveBorrowParams {
  amount: ethers.BigNumberish;
  to: string;
  rateMode: number;
  assetId: number;
  useDefaultMarket: boolean;
  useOnBehalf: boolean;
  market: string;
  onBehalf: string;
}

export class AaveBorrowService {
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(
    private aaveBorrowAddress: string,
    private dsProxyService: DSProxyService,
    signer: ethers.Signer
  ) {
    this.contract = new ethers.Contract(
      aaveBorrowAddress,
      AAVE_BORROW_ABI,
      signer
    );
    this.signer = signer;
  }

  public async borrow(
    params: AaveBorrowParams
  ): Promise<ethers.ContractTransactionResponse> {
    try {
      // Проверяем владельца DSProxy
      const owner = await this.dsProxyService.getContractAddress();
      const signerAddress = await this.signer.getAddress();

      // Кодируем параметры для вызова executeActionDirect
      const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
        [
          "tuple(uint256 amount, address to, uint8 rateMode, uint16 assetId, bool useDefaultMarket, bool useOnBehalf, address market, address onBehalf)",
        ],
        [
          {
            amount: params.amount,
            to: params.to,
            rateMode: params.rateMode,
            assetId: params.assetId,
            useDefaultMarket: params.useDefaultMarket ?? true,
            useOnBehalf: params.useOnBehalf ?? false,
            market: params.market ?? ethers.ZeroAddress,
            onBehalf: params.onBehalf ?? ethers.ZeroAddress,
          },
        ]
      );

      // Кодируем вызов executeActionDirect
      const executeData = this.contract.interface.encodeFunctionData(
        "executeActionDirect",
        [encodedParams]
      );

      // Выполняем через DSProxy
      return await this.dsProxyService.executeTarget(
        this.aaveBorrowAddress,
        executeData,
        {
          gasLimit: 2000000,
        }
      );
    } catch (error) {
      console.error("Ошибка при выполнении borrow через DSProxy:", error);
      throw error;
    }
  }
}

export const createAaveBorrowService = (
  aaveBorrowAddress: string,
  dsProxyService: DSProxyService,
  signer: ethers.Signer
): AaveBorrowService => {
  return new AaveBorrowService(aaveBorrowAddress, dsProxyService, signer);
};
