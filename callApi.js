const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const gradleCacheDir = path.join(process.env.HOME, '.gradle/caches/modules-2/files-2.1');

function hashFile(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        stream.on('error', reject);
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}

async function buildDependencyMap() {
    let dependencyMap = new Map();

    // Simple approach to find jar files - you might need to adjust based on your setup
    const files = fs.readdirSync(gradleCacheDir, { withFileTypes: true });
    for (let file of files) {
        if (file.isFile() && file.name.endsWith('.jar')) {
            const filePath = path.join(gradleCacheDir, file.name);
            const fileHash = await hashFile(filePath);
            dependencyMap.set(file.name, fileHash);
        }
    }

    return dependencyMap;
}

async function callApi() {
    const dependencyMap = await buildDependencyMap();
    console.log("Dependency Map:", dependencyMap);

    // Example API call
    // try {
    //     const response = await axios.get('https://example.com/api/path');
    //     console.log(response.data);
    // } catch (error) {
    //     console.error(error);
    // }
}

callApi();
