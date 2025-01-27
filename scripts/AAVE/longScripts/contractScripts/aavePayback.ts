import { ethers } from "ethers";
import { DSProxyService } from "./dsProxy";
import { AAVE_PAYBACK_ABI } from "../../../../source/AAVE/abis/AavePaybackAbi";

export interface PaybackParams {
  amount: bigint;
  from: string;
  rateMode: number;
  assetId: number;
  useDefaultMarket: boolean;
  useOnBehalf: boolean;
  market: string;
  onBehalf: string;
}

export class AavePaybackService {
  constructor(
    private readonly contractAddress: string,
    private readonly dsProxyService: DSProxyService,
    private readonly signer: ethers.Wallet
  ) {}

  async payback(params: PaybackParams) {
    const contract = new ethers.Contract(
      this.contractAddress,
      AAVE_PAYBACK_ABI,
      this.signer
    );

    const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
      [
        "tuple(uint256 amount, address from, uint8 rateMode, uint16 assetId, bool useDefaultMarket, bool useOnBehalf, address market, address onBehalf)",
      ],
      [params]
    );

    const callData = contract.interface.encodeFunctionData("executeActionDirect", [
      encodedParams,
    ]);

    return await this.dsProxyService.executeTarget(this.contractAddress, callData);
  }
}

export function createAavePaybackService(
  contractAddress: string,
  dsProxyService: DSProxyService,
  signer: ethers.Wallet
) {
  return new AavePaybackService(contractAddress, dsProxyService, signer);
}