# 🔐 ProofChain - Employment Fraud Prevention Platform

**Built for BNB Hack Bombay 2025**

ProofChain is a decentralized employment verification platform that prevents hiring fraud through soulbound NFTs and on-chain reputation systems. Built to solve real-world problems like the Soham Parekh case where one person simultaneously worked at 19 startups.

## 🌐 Live Demo
**Website:** https://vivekgh0sh.github.io/ProofChain/  

**Pitch Slide:** https://docs.google.com/presentation/d/1nxuniCmgBrgPFvO2LeFrKyjdGfKjad-dfkP-n-4nNew/edit?usp=sharing

**Demo Video:** https://odysee.com/@vivekgh0sh:4/ProofChain:d

**Smart Contract:** `0x5FB23E28eADE3dD32551224E9FAF7BC1c7A53D71` (BNB Testnet)

## 🚀 Features

### Core Functionality
- **Soulbound Employment NFTs** - Non-transferable work records
- **Credential Verification** - Education and skill certificates  
- **Fraud Detection** - Real-time employment conflict checking
- **Company Reputation** - On-chain trust scoring for employers
- **Multi-Dashboard Interface** - User, Employer, and Company views

### Anti-Fraud Mechanisms  
- **Employment Conflict Detection** - Prevents multiple concurrent full-time roles
- **Company Verification System** - Authorized company minting only
- **Immutable Work History** - Permanent, tamper-proof employment records
- **Trust Scoring** - AI-powered risk assessment

## 🛠 Technology Stack

- **Smart Contracts:** Solidity, OpenZeppelin, Hardhat
- **Frontend:** React, Vite, ethers.js, React Router
- **Blockchain:** BNB Smart Chain (Testnet)
- **Storage:** IPFS for metadata
- **Deployment:** GitHub Pages

## 📁 Project Structure

```
ProofChain/
├── ProofAI-Backend/          # Smart contracts and deployment
│   ├── contracts/           # Solidity contracts
│   ├── scripts/            # Deployment scripts
│   ├── test/              # Contract tests
│   └── hardhat.config.js  # Hardhat configuration
├── ProofAI-Frontend/         # React web application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   └── artifacts/     # Contract artifacts
│   └── package.json
└── README.md
```

## 🎯 Problem & Solution

### The Problem
- **Employment fraud is costing billions globally**
- **Remote hiring lacks verification mechanisms**
- **Traditional background checks don't work for Web3 teams**
- **Cases like Soham Parekh (19 concurrent jobs) are increasing**

### Our Solution
1. **Companies mint Employment NFTs** when hiring
2. **Employees build verifiable career profiles** 
3. **Employers verify candidates instantly** before hiring
4. **Fraud prevention through conflict detection**

## 💰 Market Opportunity

- **$8.39B Web3 freelance market** growing to $16.89B by 2029 (19.1% CAGR)
- **460,000 Web3 professionals** globally
- **17,000+ companies** need employment verification
- **Average $5-10K cost** per bad hire prevented

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- BNB testnet tokens

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/vivekgh0sh/ProofChain.git
cd ProofChain
```

2. **Setup Backend**
```bash
cd ProofAI-Backend
npm install
npx hardhat compile
```

3. **Setup Frontend**
```bash
cd ../ProofAI-Frontend
npm install
npm run dev
```

4. **Connect to BNB Testnet**
- Network: BNB Smart Chain Testnet
- RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
- Chain ID: 97

## 🎮 Usage

### For Companies
1. Get authorized by platform owner
2. Mint Employment NFTs for new hires
3. End employment when employees leave

### For Employees  
1. Connect wallet to view your profile
2. Collect employment and credential NFTs
3. Share verifiable work history with potential employers

### For Employers
1. Enter candidate's wallet address
2. Run instant fraud detection check
3. View employment history and conflict analysis

## 🏗 Architecture

### Smart Contract Features
- **ERC721 Soulbound NFTs** for employment records
- **Access control** with company authorization
- **Conflict detection** algorithms
- **Company reputation** system
- **Gas-optimized** with custom errors

### Frontend Architecture
- **Multi-page React** application
- **Wallet integration** with ethers.js
- **Responsive design** for all devices
- **Real-time blockchain** interaction

## 🔒 Security

- **Soulbound tokens** prevent NFT trading/selling
- **Access control** restricts minting to authorized companies
- **Input validation** and custom error handling
- **Reentrancy protection** in all state-changing functions

## 🎯 Business Model

### Revenue Streams
- **Per-verification:** $0.50-$1.25 per check
- **Employment NFT minting:** $2.00 per NFT
- **Enterprise subscriptions:** $299-$2000/month
- **Custom integrations:** Revenue sharing

### Target Markets
- Web3 freelance platforms (DeWork, Ethlance)
- DAOs and token communities  
- Blockchain startups (50-500 employees)
- EdTech and certification programs
---

**Prevent employment fraud. Build trust. Scale globally.** 🚀
