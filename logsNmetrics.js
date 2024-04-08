const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/trigger', (req, res) => {


    // todo: also treat the recovery alert case
    const parts =  req.body.body.split('\n');
    console.log("body ", parts[1])
    addLog(parts[1])


    res.send('Function has been triggered!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


const { ethers} = require('ethers');

const alchemyApiKey =
    "https://eth-sepolia.g.alchemy.com/v2/CI1qZNtrhzVG46OvBbJWbqRUZtFC4gMC";
const provider = new ethers.JsonRpcProvider(alchemyApiKey);
const privateKey = 'd24c3d30fff06b1a5cc05afb268720caaf7892b5659e3d470b6427830c9972ea'; // todo use environment variables or secure storage for production
const contractAbi = [
    "function addLog(string memory log) public"
];
const contractAddress = '0xac8bfeffaaa90e092a7c4709a9cda36f9cdf9e03';
const wallet = new ethers.Wallet(privateKey, provider);
const logsStorageContract = new ethers.Contract(contractAddress, contractAbi, wallet);

async function addLog(log) {
    try {
        const tx = await logsStorageContract.addLog(log);
        console.log('------')
        console.log('submitted log:', log)
        console.log('Transaction submitted:', tx.hash);

        const receipt = await tx.wait();
        console.log('Transaction confirmed:');
        console.log('------')
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}


