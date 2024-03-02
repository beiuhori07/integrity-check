const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {ethers} = require("ethers");


const gradleCacheDir = path.join(process.env.HOME, '.gradle/caches/modules-2/files-2.1');

const getHashForJar = async (filePath) => {
    const algorithm = 'sha256'
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        const stream = fs.createReadStream(filePath);
        stream.on('data', (data) => hash.update(data, 'utf8'));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', (err) => reject(err));
    });
}

async function findJarFiles(dir, jarFiles = []) {
    const files = fs.readdirSync(dir, {withFileTypes: true});

    for (const file of files) {
        if (file.isDirectory()) {
            // If the entry is a directory, recurse into it
            await findJarFiles(path.join(dir, file.name), jarFiles);
        } else if (file.name.endsWith('.jar')) {
            // If the entry is a jar file, add it to the array
            let fullPath = path.join(dir, file.name);
            let hash = await getHashForJar(fullPath);
            // jarFiles.push(fullPath + " " + hash);
            // jarFiles.push(file.name + " " + hash);

            let fileName = file.name
            jarFiles[fileName] = '0x' + hash
        }
    }

    return jarFiles;
}

// Example usage
const baseDirectory = gradleCacheDir // Replace this with your base directory path
// const jarFiles = findJarFiles(baseDirectory).then((files) => console.log(files));


// Assuming you have the following information
const contractAddress = "0xBb42ecE7629d9e9E33A97fc40dCE77f42Eb9EF9B"; // Replace with your contract's address
const contractABI = [ // Replace with your contract's ABI
    "function getAllHashes() public view returns (string[] memory, bytes32[] memory)"
];

// Set up a provider (here, we're using Ethereum's mainnet; you might want to use a testnet or a local network for development)
const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/CI1qZNtrhzVG46OvBbJWbqRUZtFC4gMC"); // Replace with your provider

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider);

async function fetchAllHashes() {
    try {
        // Call the getAllHashes function
        const [keys, hashValues] = await contract.getAllHashes();

        // Output the results
        // console.log("Keys:", keys);
        // console.log("HashValues:", hashValues.map(hash => hash.toString()));

        const map = keys.reduce((acc, key, index) => {
            acc[key] = hashValues[index];
            return acc;
        }, {});

        console.log(map)
        console.log(Object.keys(map))

        return map;
    } catch (error) {
        console.error("Error fetching hashes:", error);
    }
}

// fetchAllHashes();

// async function getDepHashes() {
//     const depHashes = await findJarFiles(gradleCacheDir);
// }


async function pipelineCheck() {
    const chainHashes = await fetchAllHashes();
    const depHashes = await findJarFiles(gradleCacheDir);

    // console.log(depHashes)


    for (const chainKey of Object.keys(chainHashes)) {
        // console.log(depHashes[chainKey])
        // console.log(chainHashes[chainKey])
        if (depHashes[chainKey] == chainHashes[chainKey]) {
            console.log('matched')
        } else {
            console.log("diff")
            console.log("pipeline step fails")
            process.exit(1)
        }
    }
    console.log('pipeline step passes')
    process.exit(0);

}

pipelineCheck()
