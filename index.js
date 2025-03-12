const Blockchain = require('./blockchain');
const { storeFile, retrieveFile } = require('./storage');
const MerkleTree = require('./merkle');
const path = require("path");

const blockchain = new Blockchain();
const command = process.argv[2];

if (command === "add-file") {
    const filePath = process.argv[3];
    if (!filePath) {
        console.log("Usage: node index.js add-file <filePath>");
        process.exit(1);
    }

    const filename = path.basename(filePath);
    const chunks = storeFile(filePath);
    const merkleTree = new MerkleTree(chunks);

    blockchain.addBlock(merkleTree.root, chunks, filename);
    if (proofOfStorage(chunks)) {
        console.log(`File "${filePath}" successfully stored.`);
    } else {
        console.log(`Storage verification failed for file "${filePath}".`);
    }
    console.log(`File "${filename}" added to blockchain with Merkle Root: ${merkleTree.root}`);
}

else if (command === "retrieve-file") {
    const fileName = process.argv[3];
    const outputPath = process.argv[4];

    if (!fileName || !outputPath) {
        console.log("Usage: node index.js retrieve-file <fileName> <outputPath>");
        process.exit(1);
    }
    const block = blockchain.getChain().find(block => block.fileName === fileName);

    if (!block) {
        console.log(`File "${fileName}" not found in blockchain.`);
        process.exit(1);
    }

   
    retrieveFile(block.chunks, outputPath);
    console.log(`File "${fileName}" successfully retrieved and saved as "${outputPath}".`);
}


else if (command === "show-chain") {
    console.log(JSON.stringify(blockchain.getChain(), null, 4));
}

else {
    console.log("Available Commands:");
    console.log("  node index.js add-file <filePath>      # Add a file to the blockchain");
    console.log("  node index.js retrieve-file <merkleRoot> [outputPath]  # Retrieve a file");
    console.log("  node index.js show-chain               # Display blockchain");
}
