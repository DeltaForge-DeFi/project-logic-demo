import { ethers } from "ethers";
import { createDSProxyService } from "../../AAVE/longScripts/contractScripts/dsProxy";
import { getDefaultProvider } from "../../AAVE/longScripts/utils/getDefaultProvider";
import { getDefaultSigner } from "../../AAVE/longScripts/utils/getDefaultSigner";

// Интерфейс ERC20
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address, uint256) returns (bool)",
  "function symbol() view returns (string)",
];

const DS_PROXY_ABI = [
  "function execute(address _target, bytes memory _data) payable returns (bytes32)",
  "function setOwner(address owner)",
  "function owner() view returns (address)",
  "function forward(bytes memory _data) payable"
];

const WITHDRAW_FUNDS_ABI = [
  "function withdraw(uint256 amount)"
];

const WITHDRAW_FUNDS_BYTECODE = "0x6080604052348015600f57600080fd5b5060c68061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063f3fef3a314602d575b600080fd5b605660048036036020811015604157600080fd5b8101908080359060200190929190505050605c565b005b3373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015801560a0573d6000803e3d6000fd5b505056fea265627a7a72315820f8a1ce7c6956d84c209025c1e2cee53c7c9b7185e8c2f1c8b2c5c58c49e082e964736f6c63430005100032";

async function main() {
  const provider = getDefaultProvider();
  const signer = getDefaultSigner(provider);
  const dsProxyService = createDSProxyService("arbitrum_one", signer);

  // Получаем адрес DSProxy
  const dsProxyAddress = "0xDd06e3d838CF0ADd69838476993F42B7fE28d605";
  console.log("DSProxy address:", dsProxyAddress);

  // Токены для проверки
  const tokens = {
    WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  };

  try {
    // Проверяем баланс ETH
    const ethBalance = await provider.getBalance(dsProxyAddress);
    if (ethBalance > BigInt(0)) {
      console.log(`ETH balance: ${ethers.formatEther(ethBalance)}`);

      // Создаем контракт DSProxy
      const dsProxy = new ethers.Contract(dsProxyAddress, DS_PROXY_ABI, signer);

      // Вызываем forward для отправки ETH владельцу
      const tx = await dsProxy.forward("0x", {
        gasLimit: 300000
      });

      console.log("Transaction sent:", tx.hash);
      await tx.wait();

      const newBalance = await provider.getBalance(dsProxyAddress);
      console.log("New ETH balance:", ethers.formatEther(newBalance));
    }

    // Проверяем балансы токенов
    for (const [symbol, address] of Object.entries(tokens)) {
      const token = new ethers.Contract(address, ERC20_ABI, signer);
      const balance = await token.balanceOf(dsProxyAddress);

      if (balance > BigInt(0)) {
        console.log(`${symbol} balance: ${ethers.formatEther(balance)}`);

        // Создаем данные для вызова transfer
        const transferData = token.interface.encodeFunctionData("transfer", [
          await signer.getAddress(),
          balance
        ]);

        // Выполняем transfer через DSProxy
        await dsProxyService.executeTarget(address, transferData, {
          gasLimit: 300000,
        });

        console.log(`${symbol} withdrawn successfully`);
      }
    }

    console.log("All funds withdrawn successfully");
  } catch (error) {
    console.error("Error withdrawing funds:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
