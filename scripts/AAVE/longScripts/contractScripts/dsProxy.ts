import { ethers } from "ethers";
import { NETWORK } from "../../../../source/AAVE/config/networks";
import { DS_PROXY_ABI } from "../../../../source/AAVE/abis/DSProxyAbi";
import * as dotenv from "dotenv";

dotenv.config();

// Типы данных
export interface DSProxyResponse {
  target: string;
  response: string;
}

export interface DSProxyExecuteOptions {
  gasLimit?: number;
  value?: ethers.BigNumberish;
}

// Адреса DSProxy для разных сетей
const DS_PROXY_ADDRESSES: { [key: string]: string } = {
  arbitrum_one: process.env.DS_PROXY_ADDRESS || "",
};

function getDSProxyAddress(network: string): string {
  const address = DS_PROXY_ADDRESSES[network];
  if (!address) {
    throw new Error(`DSProxy address not found for network: ${network}`);
  }
  return address;
}

// Класс для работы с DSProxy
export class DSProxyService {
  private contract: ethers.Contract;

  constructor(network: string, private signer: ethers.Signer) {
    if (!process.env.DS_PROXY_ADDRESS) {
      throw new Error("DS_PROXY_ADDRESS not found in environment variables");
    }

    this.contract = new ethers.Contract(
      getDSProxyAddress(network),
      DS_PROXY_ABI,
      signer
    );
  }

  public async executeTarget(
    targetAddress: string,
    data: string,
    options: DSProxyExecuteOptions = {}
  ): Promise<ethers.TransactionResponse> {
    try {
      // Validate input data format
      if (!data.startsWith("0x")) {
        data = "0x" + data;
      }

      // Enhanced logging for debugging
      console.log("Executing DSProxy with:", {
        targetAddress,
        dataHex: data,
        dataLength: data.length,
        options,
      });

      // Encode the function call
      const executeData = this.contract.interface.encodeFunctionData(
        "execute(address,bytes)",
        [targetAddress, data]
      );

      // Send the transaction with encoded data
      const tx = await this.signer.sendTransaction({
        to: await this.contract.getAddress(),
        data: executeData,
        gasLimit: options.gasLimit || 5000000,
        value: options.value || 0,
      });

      console.log("Transaction sent:", tx.hash);

      // Wait for confirmation with more detailed error handling
      const receipt = await tx.wait();

      if (!receipt || receipt.status === 0) {
        try {
          const result = await this.signer.provider?.call({
            to: await this.contract.getAddress(),
            data: executeData,
            from: await this.signer.getAddress(),
          });
          console.log("Call result:", result);
        } catch (callError: any) {
          const revertReason =
            callError.data || callError.reason || "Unknown reason";
          throw new Error(
            `Transaction failed: ${tx.hash}. Reason: ${revertReason}`
          );
        }
        throw new Error(`Transaction failed: ${tx.hash}`);
      }

      return tx;
    } catch (error: any) {
      console.error("DSProxy execution failed:", {
        error: error.message,
        code: error.code,
        reason: error.reason,
        data: error.data,
      });
      throw error;
    }
  }

  public async getContractAddress(): Promise<string> {
    return this.contract.getAddress();
  }

  public async getProxyAddress(): Promise<string> {
    return this.contract.getAddress();
  }
}

export const createDSProxyService = (
  network: keyof typeof NETWORK,
  signer: ethers.Signer
): DSProxyService => {
  return new DSProxyService(network, signer);
};
