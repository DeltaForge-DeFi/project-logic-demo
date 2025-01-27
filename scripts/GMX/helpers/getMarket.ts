import { ethers } from "ethers";
require('dotenv').config();

const PROVIDER_URL = process.env.ALCHEMY_ARBITRUM_URL;
const READER_ADDRESS = "0x0537C767cDAC0726c76Bb89e92904fe28fd02fE1"; // Reader 
const DATASTORE_ADDRESS = "0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8"; // DataStore 

const READER_ABI = [
  "function getMarkets(address dataStore, uint256 start, uint256 end) view returns (tuple(address marketToken, address indexToken, address longToken, address shortToken)[])"
];

async function getMarkets() {
  const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

  const readerContract = new ethers.Contract(READER_ADDRESS, READER_ABI, provider);

  try {
    const markets = await readerContract.getMarkets(DATASTORE_ADDRESS, 0, 1000);

    console.log("Markets:", markets);

    const ethUsdcMarket = markets.find(
      (market: any) =>
        market.indexToken.toLowerCase() === "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1".toLowerCase() && // WAVAX
        market.shortToken.toLowerCase() === "0xaf88d065e77c8cC2239327C5EDb3A432268e5831".toLowerCase() // USDC
    );

    if (ethUsdcMarket) {
      console.log("WAVAX/USDC Market:", ethUsdcMarket);
    } else {
      console.log("WAVAX/USDC Market not found");
    }
  } catch (error) {
    console.error("Error fetching markets:", error);
  }
}

getMarkets().catch(console.error);