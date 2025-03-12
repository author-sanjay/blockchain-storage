const Blockchain = require("./blockchain"); 
const fs = require("fs");

const blockchain = new Blockchain();

function printBlockchain() {
    console.log("\nCurrent Blockchain:");
    console.log(JSON.stringify(blockchain.getChain(), null, 4));
}

console.log("\n🔹 TEST 1: Checking Genesis Block...");
if (blockchain.getChain().length === 1 && blockchain.getChain()[0].index === 0) {
    console.log("✅ Genesis block is correctly initialized.");
} else {
    console.error("❌ Genesis block initialization failed.");
}
printBlockchain();

console.log("\n🔹 TEST 2: Adding a New Block...");
blockchain.addBlock("root123", ["chunk1", "chunk2"], "testFile.txt");
if (blockchain.getChain().length === 2) {
    console.log("✅ Block added successfully.");
} else {
    console.error("❌ Block addition failed.");
}
printBlockchain();

console.log("\n🔹 TEST 3: Checking Blockchain Tamper Detection...");
const chain = blockchain.getChain();
if (chain.length > 1) {
    console.log("🔴 Tampering with Block 1...");
    chain[1].fileName = "HackedFile.txt"; 

    fs.writeFileSync("chain.json", JSON.stringify(chain, null, 4)); 
    const blockchainTampered = new Blockchain();

    if (!blockchainTampered.isChainValid()) {
        console.log("✅ Tampering detected successfully!");
    } else {
        console.error("❌ Tampering was NOT detected!");
    }
} else {
    console.log("⚠️ Not enough blocks to test tampering.");
}

console.log("\n🔹 TEST 4: Checking Blockchain Integrity on Load...");
const blockchainReinitialized = new Blockchain();
if (blockchainReinitialized.isChainValid()) {
    console.log("✅ Blockchain integrity is maintained.");
} else {
    console.error("❌ Blockchain integrity is compromised.");
}

printBlockchain();
