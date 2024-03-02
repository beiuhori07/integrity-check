const fs = require('fs');
const path = require('path');
const crypto = require('crypto');


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
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            // If the entry is a directory, recurse into it
            await findJarFiles(path.join(dir, file.name), jarFiles);
        } else if (file.name.endsWith('.jar')) {
            // If the entry is a jar file, add it to the array
            let fullPath = path.join(dir, file.name);
            let hash = await getHashForJar(fullPath);
            // jarFiles.push(fullPath + " " + hash);
            jarFiles.push(file.name + " " + hash);
        }
    }

    return jarFiles;
}

// Example usage
const baseDirectory = gradleCacheDir // Replace this with your base directory path
const jarFiles = findJarFiles(baseDirectory).then((files) => console.log(files));

