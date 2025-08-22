// src/App.jsx

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import './index.css';

// Import Pages
import HomePage from './pages/HomePage';

// Import Components
import UserDashboard from './components/UserDashboard';
import EmployerDashboard from './components/EmployerDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import CompanyVerification from './components/CompanyVerification';
import Footer from './components/Footer'; // <-- ADD THIS LINE
import PricingPage from "./pages/PricingPage";
import contractArtifact from './artifacts/ProofAI.json';
const contractAddress = "0x5FB23E28eADE3dD32551224E9FAF7BC1c7A53D71"; // <-- IMPORTANT: Use your latest address
const contractABI = contractArtifact.abi;

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const navigate = useNavigate();

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

      // On successful connection, navigate to the user dashboard
      navigate('/user');
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand"><h1>🔐 ProofAI</h1></div>
        <div className="nav-links">
          {/* This part of the navbar can be improved later to show different links based on login status */}
          <NavLink to="/">Home</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          {account && <NavLink to="/user">My Profile</NavLink>}
          {account && <NavLink to="/employer">Employer Verify</NavLink>}
          {account && <NavLink to="/verify-company">Verify Company</NavLink>}
          {account && <NavLink to="/company">Company Hub</NavLink>}
        </div>
        <div className="wallet-info">
          {account ? (
            <p>Connected: {`${account.slice(0, 6)}...${account.slice(-4)}`}</p>
          ) : (
            <button onClick={connectWallet} className="btn-primary">Connect Wallet</button>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage connectWallet={connectWallet} />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          {/* Protected Routes - only accessible when `account` is not null */}
          <Route path="/user" element={account ? <UserDashboard account={account} contract={contract} signer={signer} /> : <Navigate to="/" />} />
          <Route path="/employer" element={account ? <EmployerDashboard account={account} contract={contract} /> : <Navigate to="/" />} />
          <Route path="/company" element={account ? <CompanyDashboard account={account} contract={contract} signer={signer} /> : <Navigate to="/" />} />
          <Route path="/verify-company" element={account ? <CompanyVerification account={account} contract={contract} /> : <Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

// Keep the AppWrapper for the router's basename
const AppWrapper = () => (
  <Router basename="/ProofAI">
    <App />
  </Router>
);

export default AppWrapper;