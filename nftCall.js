const {ethers} = require('ethers');

const alchemyApiKey =
    "https://eth-sepolia.g.alchemy.com/v2/CI1qZNtrhzVG46OvBbJWbqRUZtFC4gMC";
const provider = new ethers.JsonRpcProvider(alchemyApiKey);
const address = '0x448A53a103d2e7232b3966f566a75e976114e263';

async function checkETHBalance() {
    const balance = await provider.getBalance(address);
    console.log("wei = ", balance)
}

async function nftCheck() {
    const tokenContract = new ethers.Contract("0xF5CF3fB04e9F9C3C858E3eAe6d1A3bbe733aA6bb", [
        "function balanceOf(address) view returns (uint)"
    ], provider);

    const balance = await tokenContract.balanceOf(address);
    console.log(`nfts owned in this collection: `, balance.toString());
}

checkETHBalance().catch(console.error);
nftCheck().catch(console.error);
