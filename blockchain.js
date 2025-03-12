const crypto = require("crypto");
const fs = require("fs");

const CHAIN_FILE = "chain.json";

class Block {
    constructor(index, previousHash, merkleRoot, chunks, fileName, timestamp = Date.now()) {
        this.index = index;
        this.previousHash = previousHash;
        this.merkleRoot = merkleRoot;
        this.chunks = chunks;
        this.fileName = fileName;
        this.timestamp = timestamp;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        const blockData = `${this.index}${this.previousHash}${this.merkleRoot}${this.timestamp}${JSON.stringify(this.chunks)}${this.fileName}`;
        return crypto.createHash("sha256").update(blockData).digest("hex");
    }
}

class Blockchain {
    constructor() {
        this.chain = [];
        this.loadBlockchain();
    }

    createGenesisBlock() {
        const genesisBlock = new Block(0, "0", "genesis", [], "Genesis Block");
        this.chain.push(genesisBlock);
    }

    loadBlockchain() {
        try {
            if (!fs.existsSync(CHAIN_FILE)) {
                console.log("No blockchain found. Creating a new one...");
                this.createGenesisBlock();
                this.saveBlockchain();
            } else {
                const data = fs.readFileSync(CHAIN_FILE, "utf-8");
                this.chain = JSON.parse(data).map(block => new Block(
                    block.index,
                    block.previousHash,
                    block.merkleRoot,
                    block.chunks,
                    block.fileName,
                    block.timestamp
                ));

                if (!this.isChainValid()) {
                    console.log("Blockchain integrity check failed. Reinitializing...");
                    this.createGenesisBlock();
                    this.saveBlockchain();
                }
            }
        } catch (error) {
            console.error("Error loading blockchain:", error.message);
            this.createGenesisBlock();
            this.saveBlockchain();
        }
    }

    saveBlockchain() {
        fs.writeFileSync(CHAIN_FILE, JSON.stringify(this.chain, null, 4));
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(`Block ${i} has invalid previous hash.`);
                return false;
            }
            if (currentBlock.calculateHash() !== currentBlock.hash) {
                console.log(`Block ${i} has been tampered with.`);
                return false;
            }
        }
        if (this.chain.length > 0 && this.chain[0].previousHash !== "0") {
            console.log("Genesis block has invalid previous hash.");
            return false;
        }

        return true;
    }


    addBlock(merkleRoot, chunks, fileName) {
        if (!this.isChainValid()) {
            console.log("Blockchain integrity check failed. Aborting block addition.");
            return;
        }

        const latestBlock = this.chain[this.chain.length - 1];
        const newBlock = new Block(this.chain.length, latestBlock.hash, merkleRoot, chunks, fileName);
        this.chain.push(newBlock);
        this.saveBlockchain();
        console.log(`Block added with Merkle Root: ${merkleRoot}`);
    }

    getChain() {
        return this.chain;
    }
}

module.exports = Blockchain;
