# 🔐 ProofChain Backend - Smart Contracts

**Solidity contracts and deployment infrastructure for ProofChain employment verification platform.**

## 🌐 Deployed Contract
**Address:** `0x5FB23E28eADE3dD32551224E9FAF7BC1c7A53D71`  
**Network:** BNB Smart Chain Testnet  
**Explorer:** [BSCScan Testnet](https://testnet.bscscan.com/address/0x5FB23E28eADE3dD32551224E9FAF7BC1c7A53D71)

## 📋 Contract Overview

### ProofAI.sol - Main Contract
A comprehensive ERC721-based contract that manages:
- **Soulbound Employment NFTs** - Non-transferable work records
- **Credential NFTs** - Education and skill certificates
- **Company Authorization** - Verified employer system
- **Fraud Detection** - Employment conflict checking
- **Reputation Management** - Company trust scoring

## 🏗 Architecture

### Core Structures

```solidity
struct Credential {
    string credentialType;      // "Education", "Certification", etc.
    string issuerName;         // University/Institution name
    uint256 trustScore;        // 0-100 reliability score
    uint256 issuedDate;        // Timestamp of issuance
    bool isRevoked;           // Revocation status
}

struct Employment {
    address employer;          // Company wallet address
    string companyName;        // Company name
    string position;          // Job title
    uint256 startDate;        // Employment start timestamp
    uint256 endDate;          // Employment end (0 if active)
    string employmentType;    // "full-time", "part-time", "contract"
    bool isActive;           // Current employment status
    string endReason;        // Reason for leaving
    uint256 trustScore;      // Employment record reliability
}

struct CompanyProfile {
    string companyName;       // Registered company name
    bool isVerified;         // Platform verification status
    uint256 trustScore;      // Company reputation (0-100)
    uint256 registrationDate; // Registration timestamp
    string[] redFlags;       // Fraud/issue flags
}
```

### Key Features

#### 1. Soulbound Token Implementation
```solidity
function _transfer(address from, address to, uint256 tokenId) internal override {
    if (from != address(0)) revert ProofAI_TokenIsSoulbound();
    super._transfer(from, to, tokenId);
}
```
- **Prevents NFT trading/selling** after minting
- **Maintains credential integrity** - can't be transferred to fake identities
- **Only minting allowed** (from zero address)

#### 2. Employment Conflict Detection
```solidity
function checkEmploymentConflicts(address employee) public view 
    returns (bool hasConflicts, uint256 activeFullTimeCount) {
    // Analyzes active full-time roles for Soham Parekh scenarios
}
```
- **Detects multiple concurrent full-time jobs**
- **Prevents employment fraud** at verification stage
- **Real-time conflict analysis**

#### 3. Company Authorization System
```solidity
function authorizeCompany(address companyAddress, string memory companyName) 
    public onlyOwner {
    // Only platform owner can authorize companies
}
```
- **Controlled minting** - only verified companies can issue employment NFTs
- **Company reputation tracking** with trust scores
- **Red flag system** for problematic employers

## 🛠 Technology Stack

- **Solidity** 0.8.20+
- **OpenZeppelin** Contracts (ERC721, Ownable, Counters)
- **Hardhat** Development Environment
- **Custom Errors** for gas optimization
- **BNB Smart Chain** Testnet

## 🚀 Setup & Deployment

### Prerequisites
- Node.js 18+
- Hardhat
- MetaMask with BNB testnet tokens

### Installation

```bash
# Clone and navigate to backend
git clone https://github.com/vivekgh0sh/ProofChain.git
cd ProofChain/ProofAI-Backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Add your PRIVATE_KEY to .env
```

### Environment Configuration

Create `.env` file:
```bash
PRIVATE_KEY=your_wallet_private_key_here
BSC_TESTNET_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
```

### Compilation & Testing

```bash
# Compile contracts
npx hardhat compile

# Run tests (if available)
npx hardhat test

# Check contract size
npx hardhat size-contracts
```

### Deployment

```bash
# Deploy to BNB testnet
npx hardhat run scripts/deploy.js --network bsc_testnet

# Verify contract (optional)
npx hardhat verify --network bsc_testnet DEPLOYED_ADDRESS
```

## 📜 Scripts

### Available Scripts

1. **deploy.js** - Deploy ProofAI contract
2. **authorize.js** - Authorize companies to mint employment NFTs  
3. **mintEmployment.js** - Mint employment NFT for testing
4. **interact.js** - General contract interaction utilities

### Usage Examples

```bash
# Deploy fresh contract
npx hardhat run scripts/deploy.js --network bsc_testnet

# Authorize a company
npx hardhat run scripts/authorize.js --network bsc_testnet

# Mint test employment NFT
npx hardhat run scripts/mintEmployment.js --network bsc_testnet
```

## 🔧 Contract Functions

### Core Functions

#### For Platform Owner
```solidity
// Authorize companies to mint employment NFTs
function authorizeCompany(address companyAddress, string memory companyName)

// Mint credential NFTs for users
function mintCredential(address to, string memory credentialType, ...)

// Revoke credentials if needed
function revokeCredential(uint256 tokenId)

// Flag fraudulent companies
function flagFraudulentCompany(address companyAddress, string memory reason)
```

#### For Authorized Companies  
```solidity
// Mint employment NFT for new employee
function mintEmploymentNFT(address employee, string memory companyName, ...)

// End employment when employee leaves
function endEmployment(uint256 tokenId, string memory reason)
```

#### For Public/Employers
```solidity
// Check for employment conflicts (Soham Parekh detection)
function checkEmploymentConflicts(address employee) 

// Get employment history
function getEmploymentHistory(address employee)

// Verify company legitimacy  
function verifyCompanyLegitimacy(address companyAddress)

// Check if credential is valid
function isCredentialValid(uint256 tokenId)
```

## 🔒 Security Features

### Gas Optimization
- **Custom errors** instead of require strings
- **Efficient mappings** for user data
- **Minimal storage** usage patterns

### Access Control
- **Owner-only functions** for sensitive operations
- **Company authorization** system
- **Input validation** on all functions

### Fraud Prevention
- **Soulbound implementation** prevents token trading
- **Employment conflict detection** catches multi-job scenarios
- **Company reputation system** tracks employer trustworthiness

## 📊 Contract Stats

- **Contract Size:** Optimized for deployment limits
- **Gas Costs:**
  - Employment NFT mint: ~150,000 gas
  - Credential mint: ~120,000 gas
  - Conflict check: ~50,000 gas
- **Storage Efficiency:** Minimal on-chain storage with IPFS metadata

## 🔍 Testing

### Test Coverage
- Employment NFT lifecycle (mint → end)
- Credential management (mint → revoke → verify)
- Access control enforcement
- Soulbound transfer restrictions
- Conflict detection accuracy

### Run Tests
```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/ProofAI.test.js

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

## 🐛 Debugging

### Common Issues

1. **"Company not authorized" error**
   - Solution: Call `authorizeCompany()` first as owner

2. **"Token is soulbound" error**  
   - Expected: NFTs cannot be transferred after minting

3. **Out of gas errors**
   - Solution: Increase gas limit in hardhat.config.js

### Network Configuration

```javascript
// hardhat.config.js
networks: {
  bsc_testnet: {
    url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    chainId: 97,
    accounts: [process.env.PRIVATE_KEY],
    gas: 2100000,
    gasPrice: 20000000000
  }
}
```

## 📄 Files Structure

```
ProofAI-Backend/
├── contracts/
│   └── ProofAI.sol              # Main contract
├── scripts/
│   ├── deploy.js               # Deployment script
│   ├── authorize.js            # Company authorization
│   ├── mintEmployment.js       # Employment NFT minting
│   └── interact.js             # General interactions
├── test/
│   └── ProofAI.test.js         # Contract tests
├── ignition/modules/           # Hardhat Ignition modules
├── hardhat.config.js           # Hardhat configuration
├── package.json               # Dependencies
├── .env.example               # Environment template
└── README.md                  # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/contract-improvement`)
3. Write tests for new functionality
4. Ensure all tests pass (`npx hardhat test`)
5. Commit changes with clear messages
6. Submit pull request

---

**Secure. Scalable. Soulbound.** 🔐
