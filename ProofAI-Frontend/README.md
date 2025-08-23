# 🔐 ProofChain Frontend - React Application

**Modern React web application for ProofChain employment verification platform.**

## 🌐 Live Demo
**Website:** https://vivekgh0sh.github.io/ProofChain/  
**Repository:** https://github.com/vivekgh0sh/ProofChain

## 📋 Application Overview

A comprehensive Web3 application built with React and Vite that provides:
- **Multi-dashboard interface** for different user types
- **Wallet integration** with MetaMask
- **Real-time blockchain interaction** via ethers.js
- **Responsive design** for all devices
- **Professional UI/UX** for enterprise adoption

## 🏗 Architecture

### Component Structure

```
src/
├── components/
│   ├── UserDashboard.jsx      # Employee profile & credentials
│   ├── EmployerDashboard.jsx  # Candidate verification tools
│   ├── CompanyDashboard.jsx   # Employment NFT management
│   ├── CompanyVerification.jsx # Company legitimacy checker
│   └── Footer.jsx            # Site footer
├── pages/
│   ├── HomePage.jsx          # Landing page
│   └── PricingPage.jsx       # Business pricing tiers
├── artifacts/
│   └── ProofAI.json          # Contract ABI and metadata
├── App.jsx                   # Main app router
└── main.jsx                  # React entry point
```

### Key Features

#### 1. Wallet Integration
- **MetaMask connection** with automatic network detection
- **BNB Testnet configuration** and switching
- **Account management** with persistent state
- **Transaction handling** with error management

#### 2. Multi-Dashboard System
- **User Dashboard:** LinkedIn-style verifiable career profiles
- **Employer Dashboard:** Fraud detection and candidate verification
- **Company Dashboard:** Employment NFT minting and management

#### 3. Real-time Blockchain Integration
- **Live contract interaction** via ethers.js
- **Automatic data fetching** from smart contracts
- **Transaction status tracking** and confirmations
- **Gas estimation** and optimization

## 🛠 Technology Stack

- **React** 19.1.1 - Modern UI framework
- **Vite** 7.1.2 - Fast build tool and dev server
- **ethers.js** 6.15.0 - Ethereum JavaScript library
- **React Router** 7.8.1 - Client-side routing
- **CSS3** - Custom responsive styling
- **GitHub Pages** - Static site deployment

## 🚀 Setup & Development

### Prerequisites
- Node.js 18+
- MetaMask browser extension
- BNB testnet tokens

### Installation

```bash
# Clone repository
git clone https://github.com/vivekgh0sh/ProofChain.git
cd ProofChain/ProofAI-Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

The application connects to the deployed smart contract:
- **Contract Address:** `0x5FB23E28eADE3dD32551224E9FAF7BC1c7A53D71`
- **Network:** BNB Smart Chain Testnet (Chain ID: 97)
- **RPC URL:** https://data-seed-prebsc-1-s1.binance.org:8545/

### BNB Testnet Configuration

Add BNB Testnet to MetaMask:
```javascript
Network Name: BNB Smart Chain Testnet
RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
Chain ID: 97
Currency Symbol: tBNB
Block Explorer: https://testnet.bscscan.com
```

## 📱 Application Features

### Landing Page
- **Problem statement** with Soham Parekh case study
- **Solution overview** and value proposition
- **Feature highlights** and use cases
- **Call-to-action** for wallet connection

### User Dashboard
```jsx
Features:
- Profile overview with wallet address
- Employment history timeline
- Active vs historical job records
- Credential collection display
- Trust score and verification status
```

### Employer Dashboard
```jsx
Features:
- Candidate verification interface
- Employment conflict detection
- Risk scoring and recommendations
- Batch verification tools
- Recent verification history
```

### Company Dashboard
```jsx
Features:
- Employment NFT minting interface
- Employee management system
- Company verification status
- Bulk employee onboarding
- Demo data for testing
```

### Company Verification
```jsx
Features:
- Company legitimacy checker
- Trust score analysis
- Red flag detection
- Employee protection tools
- Fraud prevention warnings
```

## 🎨 UI/UX Design

### Design Principles
- **Clean, professional interface** for enterprise users
- **Intuitive navigation** with clear user flows
- **Responsive layout** supporting mobile and desktop
- **Accessibility compliance** with WCAG guidelines
- **Loading states** and error handling

### Color Scheme
- **Primary:** #4f46e5 (Indigo)
- **Success:** #10b981 (Emerald)
- **Warning:** #f59e0b (Amber)
- **Error:** #ef4444 (Red)
- **Background:** Linear gradient (Purple to Blue)

### Typography
- **Font:** Inter, system fonts
- **Headings:** 1.5rem - 2.5rem
- **Body:** 1rem (16px)
- **Small:** 0.875rem (14px)

## 🔧 Development Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Deploy to GitHub Pages
npm run deploy
```

## 🌐 Deployment

### GitHub Pages Deployment

The application is automatically deployed to GitHub Pages via the `gh-pages` package:

```bash
# Build and deploy
npm run deploy
```

### Configuration

```javascript
// package.json
{
  "homepage": "https://vivekgh0sh.github.io/ProofChain",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}

// vite.config.js
export default defineConfig({
  base: '/ProofChain/',
  plugins: [react()]
})
```

## 🔗 Smart Contract Integration

### Contract Connection

```javascript
// App.jsx
const contractAddress = "0x5FB23E28eADE3dD32551224E9FAF7BC1c7A53D71";
const contractABI = contractArtifact.abi;

const connectWallet = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  setContract(contract);
};
```

### Key Functions Used

```javascript
// Employment verification
const conflicts = await contract.checkEmploymentConflicts(address);

// Get user employment history  
const history = await contract.getEmploymentHistory(address);

// Mint employment NFT
const tx = await contract.mintEmploymentNFT(employee, company, position, type, uri);

// Company verification
const verification = await contract.verifyCompanyLegitimacy(companyAddress);
```

## 📊 Performance Optimization

### Bundle Size Optimization
- **Vite bundling** with tree-shaking
- **Code splitting** by routes
- **Lazy loading** for components
- **Asset optimization** (images, fonts)

### Network Optimization
- **Contract call batching** where possible
- **Caching** of blockchain data
- **Loading states** for better UX
- **Error boundaries** for graceful failures

## 🔒 Security Considerations

### Wallet Security
- **Never store private keys** in frontend code
- **Validate all inputs** before blockchain calls
- **Handle connection errors** gracefully
- **Secure RPC endpoints** usage

### Smart Contract Interaction
- **ABI validation** before contract calls
- **Gas limit estimation** for transactions
- **Transaction confirmation** handling
- **Error message interpretation**

## 🧪 Testing

### Manual Testing Checklist
- [ ] Wallet connection/disconnection
- [ ] Network switching to BNB testnet  
- [ ] Contract function calls
- [ ] UI responsiveness across devices
- [ ] Error handling scenarios

### Test Data
Demo wallet addresses for testing:
```javascript
// Legitimate candidate
const cleanCandidate = "0x0987654321098765432109876543210987654321";

// Fraud scenario (Soham Parekh demo)
const fraudCandidate = "0x1234567890123456789012345678901234567890";
```

## 🐛 Common Issues & Solutions

### MetaMask Connection Issues
```javascript
// Check if MetaMask is installed
if (typeof window.ethereum === 'undefined') {
  alert("Please install MetaMask!");
  return;
}

// Handle user rejection
catch (error) {
  if (error.code === 4001) {
    console.log("User rejected connection");
  }
}
```

### Network Configuration
```javascript
// Add BNB testnet programmatically
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x61', // 97 in hex
    chainName: 'BNB Smart Chain Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/']
  }]
});
```

### Contract Interaction Errors
```javascript
// Handle common contract errors
try {
  const tx = await contract.someFunction();
  await tx.wait();
} catch (error) {
  if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
    console.log("Transaction may fail");
  }
  if (error.reason) {
    console.log("Revert reason:", error.reason);
  }
}
```

## 📄 File Structure

```
ProofAI-Frontend/
├── public/
│   ├── favicon.ico           # Site favicon
│   └── index.html           # HTML template
├── src/
│   ├── components/          # React components
│   │   ├── UserDashboard.jsx
│   │   ├── EmployerDashboard.jsx
│   │   ├── CompanyDashboard.jsx
│   │   ├── CompanyVerification.jsx
│   │   └── Footer.jsx
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx
│   │   └── PricingPage.jsx
│   ├── artifacts/          # Contract artifacts
│   │   └── ProofAI.json
│   ├── assets/            # Static assets
│   ├── App.jsx            # Main application
│   ├── App.css            # Global styles
│   ├── index.css          # CSS reset and utilities
│   └── main.jsx           # React entry point
├── package.json           # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/ui-improvement`)
3. Make changes with proper testing
4. Ensure responsive design works
5. Submit pull request with screenshots

---

**Modern. Responsive. Web3-Ready.** ⚡
