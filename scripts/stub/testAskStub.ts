import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const dsProxyAbi = [
    "function execute(address _target, bytes _data) external payable returns (bytes32 response)",
];

const wethAbi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function deposit() external payable",
    "function withdraw(uint256 amount) external",
];

const stubAbi = [
    "function deposit(bytes calldata paramsBytes) external",
    "function withdraw(bytes calldata paramsBytes) external",
];

// Адреса контрактов
const WETH_ADDRESS = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"; // WETH на Arbitrum Sepolia
const STUB_ADDRESS = "0x0006aEE3a7FBDcD4f60854f99C38662ce342fE03"; // Адрес задеплоенного stub контракта
const proxyAddress = "0xeba726f8339Fe4eF275bc9aa5aA07E21edde63Ca"; // Адрес вашего DSProxy

async function testStub(action: "deposit" | "withdraw", amount?: ethers.BigNumber) {
    const rpcUrl = process.env.ARBITRUM_ONE_RPC;
    const privateKey = process.env.PRIVATE_KEY_ARBITRUM;

    if (!rpcUrl || !privateKey) {
        throw new Error("Missing environment variables");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Проверяем сеть
    const network = await provider.getNetwork();
    console.log("Connected to network:", network.name);

    // Проверяем баланс
    const balance = await provider.getBalance(wallet.address);
    console.log("Wallet balance:", ethers.formatEther(balance), "ETH");
    console.log("Wallet address:", wallet.address);

    const dsProxy = new ethers.Contract(proxyAddress, dsProxyAbi, wallet);
    const weth = new ethers.Contract(WETH_ADDRESS, wethAbi, wallet);

    if (action === "deposit") {
        if (!amount) throw new Error("Amount required for deposit");

        // 1. Wrap ETH to WETH
        console.log("Wrapping ETH to WETH...");
        const wrapTx = await weth.deposit({ value: amount });
        await wrapTx.wait();
        console.log("ETH wrapped successfully");

        // 2. Approve WETH for DSProxy
        console.log("Checking WETH allowance...");
        const currentAllowance = await weth.allowance(wallet.address, proxyAddress);
        console.log("Current allowance:", ethers.formatEther(currentAllowance));
        
        if (currentAllowance < amount) {
            console.log("Approving WETH for DSProxy...");
            // Используем максимальное значение для approve
            console.log(amount);
            const approveTx = await weth.approve(proxyAddress, amount);
            await approveTx.wait();
            console.log("WETH approved successfully");
        } else {
            console.log("Sufficient allowance exists");
        }

        // 3. Encode deposit call
        const depositCallData = ethers.AbiCoder.defaultAbiCoder().encode(
            [
                "address",
                "uint256"
            ],
            [
                WETH_ADDRESS,
                amount
            ]
        );

        const stubInterface = new ethers.Interface(stubAbi);
        const encodedData = stubInterface.encodeFunctionData("deposit", [depositCallData]);

        // 4. Execute via DSProxy
        console.log("Executing deposit through DSProxy...");
        const tx = await dsProxy.execute(STUB_ADDRESS, encodedData, {
            gasLimit: 1000000
        });

        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Deposit completed in block:", receipt.blockNumber);

    } else if (action === "withdraw") {
        // Encode withdraw call
        const withdrawCallData = ethers.AbiCoder.defaultAbiCoder().encode(
            [
                "address",
            ],
            [
                WETH_ADDRESS,
            ]
        );
        const stubInterface = new ethers.Interface(stubAbi);
        const encodedData = stubInterface.encodeFunctionData("withdraw", [withdrawCallData]);

        console.log("Executing withdraw through DSProxy...");
        const tx = await dsProxy.execute(STUB_ADDRESS, encodedData, {
            gasLimit: 1000000
        });

        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Withdrawal completed in block:", receipt.blockNumber);
    }
}

// Пример использования
(async () => {
    try {
        // Депозит 0.0001 ETH
        const depositAmount = ethers.parseEther("0.0001");
        await testStub("deposit", depositAmount);

        // Подождем немного перед выводом
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Вывод средств
        await testStub("withdraw");

    } catch (error: any) {
        console.error("Error:", {
            message: error.message,
            data: error.data,
            reason: error.reason,
            code: error.code,
            transaction: error.transaction
        });
    }
})();
