import { ethers } from "hardhat";
import { expect } from "chai";

describe("AaveWithdraw on Arbitrum with ethers v6", function () {
  let dsProxy: any;
  let aaveWithdraw: any;

  const AAVE_WITHDRAW_ADDRESS = "0x570BfB7A185EFa93d54b06348a9eB69F6bd94ec3"; // AaveWithdraw контракт
  const DS_PROXY_ADDRESS = "0x96e8c7ccf8f306a24cb9f982bba7b04454cf0638"; // DSProxy контракт
  const DEFAULT_AAVE_MARKET = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"; // Aave Market

  before(async function () {
    const [deployer] = await ethers.getSigners();

    // Подключаемся к DSProxy
    dsProxy = new ethers.Contract(
      DS_PROXY_ADDRESS,
      [
        "function execute(address _target, bytes _data) public payable returns (bytes memory)",
        "function owner() view returns (address)",
      ],
      deployer
    );

    // Подключаемся к AaveWithdraw
    aaveWithdraw = new ethers.Contract(
      AAVE_WITHDRAW_ADDRESS,
      ["function executeActionDirect(bytes memory _callData) public payable"],
      deployer
    );
  });

  it("Should call executeActionDirect on AaveWithdraw through DSProxy", async function () {
    const [deployer] = await ethers.getSigners();

    const params = {
      assetId: 0, // ID актива
      useDefaultMarket: true, // Использовать ли дефолтный рынок
      amount: ethers.parseUnits("1", 18), // Сумма токенов
      to: deployer.address, // Адрес назначения
      market: DEFAULT_AAVE_MARKET, // Aave Market
    };

    // Кодируем параметры
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
    const callData = aaveWithdraw.interface.encodeFunctionData(
      "executeActionDirect",
      [encodedParams]
    );

    // Проверяем владельца DSProxy
    const owner = await dsProxy.getFunction("owner").staticCall();
    console.log("Владелец DSProxy:", owner);

    expect(owner.toLowerCase()).to.equal(
      deployer.address.toLowerCase(),
      "Вы не являетесь владельцем DSProxy"
    );

    // Отправляем транзакцию через DSProxy
    try {
      const tx = await dsProxy
        .getFunction("execute")
        .send(AAVE_WITHDRAW_ADDRESS, callData, {
          gasLimit: 500000, // Установите разумный лимит газа
        });
      console.log(`Транзакция отправлена: ${tx.hash}`);

      const receipt = await tx.wait();
      console.log("Транзакция подтверждена:", receipt);

      expect(receipt.status).to.equal(1);
    } catch (error) {
      console.error("Транзакция ревертирована. Ошибка:", error);
      throw error;
    }
  });
});
