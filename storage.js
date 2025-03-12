const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const STORAGE_DIR = 'storage/';
const ENCRYPTION_KEY = crypto.scryptSync('94d2c37ae48fdaf0050f54b6e0f6330008baf6b42098bb9517e62f2c703ca34c071c4ea1cdf0fcc10d41f66c8b2cabc874c8942114882923620f9483a97cd721e98e14a33acb0e104704d0f793338f9751ede0f8b4252ef7ac88f08154b989d2b2c31024ac4424dd77a316f2d3c1a664be3256aff9fe76dd850c40d0d05489871575c2689748c07650448961608fd01938c271d4ee68f82d7737940ea6ba5992cbb6f62eb9f8280be348901b70e182cfc4c8b5d3a22926d93d8513b7b9dfc7caa578de7aede5bd8ae0f20c5de1ffe2f45dd8a17cfcd1910187681dce80da0b1d2707559c952d62b76b4a86d0a06f4053b9e82f3fceddece7573bedf546bb602a3919ebd25521c1597d2c190b13a22e766f568fd6676b12dbd7372eea59b0d2ee61baaea8113aa5480a6fd7cecf259843c36215c196a44e7d5c047717839b8b5153fbc285a2b561d407ccadaa0fe4d99150c7da368542317027a0d7725c0ac7c6ad02f5d1d4c41ea24aa8b0b3059adf0821f9b5b0604d9b800d75db9a0c1d73726380a22deaa3fa8ae761ee5c60d3741258aa26ae092a8b99828b0f0055aec7731bc17fb6f8e5d3751a53ab9738a8c1e13cc5741d9f54b8520684fc500c17010a3e5456cc8b1ba8af6ac7313d9e97db8460beab314c027912acb08c583c13ca45cfdc0ffa4d8035e69b671a380abdc10f5f15a8093e27dacebcac3df8579bfe86', 'salt', 32);
const IV_LENGTH = 16;
if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR);
}


function encryptData(data) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([iv, cipher.update(data), cipher.final()]);
    return encrypted;
}

function decryptData(encryptedData) {
    const iv = encryptedData.slice(0, IV_LENGTH);
    const encryptedText = encryptedData.slice(IV_LENGTH);
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted;
}
function storeFile(filePath) {
    const fileData = fs.readFileSync(filePath);
    const chunkSize = 1024; 
    const chunks = [];

    for (let i = 0; i < fileData.length; i += chunkSize) {
        const chunk = fileData.slice(i, i + chunkSize);
        const encryptedChunk = encryptData(chunk);
        const chunkHash = crypto.createHash('sha256').update(encryptedChunk).digest('hex');
        const chunkPath = path.join(STORAGE_DIR, chunkHash);

        fs.writeFileSync(chunkPath, encryptedChunk);
        chunks.push(chunkHash);
    }

    return chunks; 
}

function retrieveFile(chunks, outputPath) {
    const fileBuffer = Buffer.concat(
        chunks.map(hash => decryptData(fs.readFileSync(path.join(STORAGE_DIR, hash))))
    );
    fs.writeFileSync(outputPath, fileBuffer);
    console.log(`File restored at: ${outputPath}`);
}

function proofOfStorage(chunks) {
    if (chunks.length === 0) return false;

    const randomChunk = chunks[Math.floor(Math.random() * chunks.length)];
    const chunkPath = path.join(STORAGE_DIR, randomChunk);

    if (!fs.existsSync(chunkPath)) {
        console.log("Proof of Storage failed: Chunk missing.");
        return false;
    }

    const encryptedChunk = fs.readFileSync(chunkPath);

    const computedHash = crypto.createHash("sha256").update(encryptedChunk).digest("hex");

    if (computedHash !== randomChunk) {
        console.log("Proof of Storage failed: Chunk hash mismatch.");
        return false;
    }

    console.log("Proof of Storage successful: Random chunk verified.");
    return true;
}




module.exports = { storeFile, retrieveFile,proofOfStorage };
