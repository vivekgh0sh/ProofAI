import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { ethers } from 'ethers';

// Import the new components
import UserDashboard from './components/UserDashboard';
import EmployerDashboard from './components/EmployerDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import contractArtifact from './artifacts/ProofAI.json';

// Your final contract address
const contractAddress = "0x175c4c40695ee7fd113F06d972987D13E3571E0c";
const contractABI = contractArtifact.abi;

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

      setAccount(address);
      setSigner(signer);
      setContract(contractInstance);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>🔐 ProofAI</h1>
          </div>
          <div className="nav-links">
            <NavLink to="/user">My Profile</NavLink>
            <NavLink to="/employer">Employer Verify</NavLink>
            <NavLink to="/company">Company Hub</NavLink>
          </div>
          <div className="wallet-info">
            {account ? (
              <p>Connected: {`${account.slice(0, 6)}...${account.slice(-4)}`}</p>
            ) : (
              <button onClick={connectWallet}>Connect Wallet</button>
            )}
          </div>
        </nav>

        <main className="main-content">
          {account ? (
            <Routes>
              <Route path="/user" element={<UserDashboard account={account} contract={contract} signer={signer} />} />
              <Route path="/employer" element={<EmployerDashboard account={account} contract={contract} />} />
              <Route path="/company" element={<CompanyDashboard account={account} contract={contract} signer={signer} />} />
              {/* Default route */}
              <Route path="/" element={<UserDashboard account={account} contract={contract} signer={signer} />} />
            </Routes>
          ) : (
            <div className="connect-wallet-prompt">
              <h2>Welcome to the Employment Fraud Prevention Platform</h2>
              <p>Please connect your wallet to continue.</p>
              <button onClick={connectWallet}>Connect Wallet</button>
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;