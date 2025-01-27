import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { createDSProxyService } from "./contractScripts/dsProxy";
import { createAavePaybackService } from "./contractScripts/aavePayback";

dotenv.config();

const AAVE_PAYBACK_ADDRESS = "0xa87756d654e2fdd980C385e0D6f28b534cAf662e";
const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const LENDING_POOL = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_ONE_RPC!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const dsProxyService = createDSProxyService("arbitrum_one", wallet);
  const aavePaybackService = createAavePaybackService(
    AAVE_PAYBACK_ADDRESS,
    dsProxyService,
    wallet
  );

  try {
    console.log("Starting payback process...");
    
    const dsProxyAddress = await dsProxyService.getContractAddress();
    console.log("DSProxy address:", dsProxyAddress);

    // Проверяем баланс DAI
    const daiContract = new ethers.Contract(
      DAI,
      [
        "function balanceOf(address) view returns (uint256)",
        "function approve(address spender, uint256 amount) external returns (bool)"
      ],
      wallet
    );

    const amount = ethers.parseUnits("1.4", 18);
    const balance = await daiContract.balanceOf(wallet.address);
    console.log("DAI balance:", ethers.formatUnits(balance, 18));
    
    if (ethers.toBigInt(balance) < ethers.toBigInt(amount)) {
      throw new Error("Insufficient DAI balance");
    }

    // Approve DAI для DSProxy
    console.log("Approving DAI for DSProxy...");
    const approveTx = await daiContract.approve(dsProxyAddress, amount);
    await approveTx.wait();
    console.log("DAI approved for DSProxy");

    const tx = await aavePaybackService.payback({
      amount: amount,
      from: wallet.address,
      rateMode: 2,
      assetId: 0,
      useDefaultMarket: true,
      useOnBehalf: false,
      market: LENDING_POOL,
      onBehalf: ethers.ZeroAddress
    });

    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt?.hash);
  } catch (error) {
    console.error("Error during payback:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });