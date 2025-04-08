# 📦 Blockchain-Based File Storage System (POC)

A Proof-of-Concept (POC) implementation of a blockchain-powered file storage system designed to provide decentralized, tamper-proof storage by leveraging cryptographic principles like Merkle trees and block chaining.

---

## 📌 Overview

This project showcases an innovative approach to storing files in a secure, distributed, and verifiable manner. The system splits files into data chunks, organizes them using Merkle trees, and stores them in a custom-built blockchain structure. It aims to address the growing concerns around data integrity, tamper resistance, and centralized control.

This POC supports a research paper titled:  
**“Redefining Blockchain for File Storage Systems”**  
It demonstrates the feasibility of using blockchain principles beyond financial systems, particularly in digital data archiving.

---

## 🧠 Key Features

- 📂 File Splitting into Chunks
- 🌲 Merkle Tree-based Chunk Hashing
- ⛓️ Custom Blockchain Structure to Store File Metadata
- 🔐 SHA256-based Integrity Validation
- 🧪 Minimal implementation using Node.js for rapid experimentation

---

## 🛠️ Tech Stack

- **Language**: JavaScript (Node.js)
- **Crypto**: SHA256 (Node's native crypto library)
- **Architecture**:
  - `Block` and `Blockchain` classes
  - `MerkleTree` construction
  - Basic file I/O and chunking

---

