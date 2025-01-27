require('dotenv').config();
const { ethers } = require("ethers");

async function mintTokens() {
    const PROVIDER_URL = process.env.ALCHEMY_AVALANCHE_FUJI_URL;
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

    const privateKey = process.env.PRIVATE_KEY_AVALANCHE_FUJI; 
    const signer = new ethers.Wallet(privateKey, provider);

    const tokenAddress = "0x3eBDeaA0DB3FfDe96E7a0DBBAFEC961FC50F725F";
    
    const abi = [
        "function mint(address to, uint256 amount) external",
        "function decimals() view returns (uint8)"
    ];

    const tokenContract = new ethers.Contract(tokenAddress, abi, signer);

    try {
        const decimals = await tokenContract.decimals();
        const amount = ethers.parseUnits("100", decimals);
        
        const tx = await tokenContract.mint(signer.address, amount);
        console.log("Transaction sent:", tx.hash);
        
        await tx.wait();
        console.log("Tokens minted successfully!");
    } catch (error) {
        console.error("Error minting tokens:", error);
    }
}

mintTokens()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
