import { ethers } from "ethers";
import { DSProxyService } from "./dsProxy";
import { UNISWAP_SWAP_ABI } from "../../../../source/AAVE/abis/uniswapSwapAbi";

export interface UniswapSwapParams {
  tokenIn: string;
  tokenOut: string;
  fee: number;
  recipient: string;
  amountIn: ethers.BigNumberish;
  amountOutMinimum: ethers.BigNumberish;
  sqrtPriceLimitX96: ethers.BigNumberish;
  pullTokens: boolean;
}

export class UniswapSwapService {
  private contract: ethers.Contract;

  constructor(
    private uniswapSwapAddress: string,
    private dsProxyService: DSProxyService,
    signer: ethers.Signer
  ) {
    this.contract = new ethers.Contract(
      uniswapSwapAddress,
      UNISWAP_SWAP_ABI,
      signer
    );
  }

  public async swap(params: UniswapSwapParams) {
    try {
      // Кодируем параметры для вызова executeActionDirect
      const callData = ethers.AbiCoder.defaultAbiCoder().encode(
        [
          "address",
          "address",
          "uint24",
          "address",
          "uint256",
          "uint256",
          "uint160",
          "bool",
        ],
        [
          params.tokenIn,
          params.tokenOut,
          params.fee,
          params.recipient,
          params.amountIn,
          params.amountOutMinimum,
          params.sqrtPriceLimitX96,
          params.pullTokens,
        ]
      );

      // Создаем интерфейс для executeActionDirect
      const swapInterface = new ethers.Interface([
        "function executeActionDirect(bytes memory _callData) public payable",
      ]);

      // Кодируем вызов executeActionDirect
      const executeData = swapInterface.encodeFunctionData(
        "executeActionDirect",
        [callData]
      );

      // Выполняем через DSProxy
      return await this.dsProxyService.executeTarget(
        this.uniswapSwapAddress,
        executeData,
        {
          gasLimit: 2000000,
        }
      );
    } catch (error) {
      console.error("Ошибка при выполнении свапа:", error);
      throw error;
    }
  }
}
