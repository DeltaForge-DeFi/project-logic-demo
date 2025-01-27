import { ethers } from "ethers";
import { DSProxyService } from "./dsProxy";

export interface OpenPositionParams {
  callData: string;
}

export class AaveOpenPositionService {
  constructor(
    private aaveOpenPositionAddress: string,
    private dsProxyService: DSProxyService,
    private signer: ethers.Signer
  ) {}

  public async openPosition(params: OpenPositionParams): Promise<ethers.TransactionResponse> {
    try {
      const iface = new ethers.Interface([
        "function executeActionDirect(bytes memory _callData)",
      ]);
      const executeData = iface.encodeFunctionData("executeActionDirect", ["0x"]);

      return await this.dsProxyService.executeTarget(
        this.aaveOpenPositionAddress,
        executeData,
        {
          value: ethers.parseEther("0.005"),
          gasLimit: 3000000,
        }
      );
    } catch (error) {
      console.error("Error executing open position:", error);
      throw error;
    }
  }
}

export const createAaveOpenPositionService = (
  aaveOpenPositionAddress: string,
  dsProxyService: DSProxyService,
  signer: ethers.Signer
): AaveOpenPositionService => {
  return new AaveOpenPositionService(aaveOpenPositionAddress, dsProxyService, signer);
}; 