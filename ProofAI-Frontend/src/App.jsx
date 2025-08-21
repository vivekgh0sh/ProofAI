import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import contractArtifact from './artifacts/ProofAI.json';

// 1. PASTE YOUR NEW FINAL CONTRACT ADDRESS HERE
const contractAddress = "0x4F43a3507737b034eaE43C763aE0E31E046d9328";
const contractABI = contractArtifact.abi;

function App() {
  const [account, setAccount] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [message, setMessage] = useState("Please connect your wallet.");

  const connectWallet = async () => { /* ... (no change) ... */ 
    if (typeof window.ethereum === 'undefined') {
      setMessage("Please install MetaMask!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      setMessage(`Connected: ${address}`);
    } catch (error) {
      setMessage("Failed to connect wallet.");
    }
  };

  const fetchCredentials = async () => {
    if (!account) { setMessage("Please connect wallet first."); return; }
    try {
      setMessage("Fetching credentials from blockchain...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const tokenIds = await contract.getCredentialsByOwner(account);
      setMessage("Found credentials! Fetching details...");

      // Fetch metadata for each token ID
      let fetchedCredentials = [];
      for (const id of tokenIds) {
        const metadataUri = await contract.tokenURI(id);
        const metadataResponse = await fetch(metadataUri);
        const metadata = await metadataResponse.json();
        metadata.tokenId = id.toString();
        fetchedCredentials.push(metadata);
      }

      setCredentials(fetchedCredentials);
      setMessage(fetchedCredentials.length > 0 ? "Credentials loaded." : "No credentials found.");
    } catch (error) {
      console.error("Error fetching:", error);
      setMessage("Error fetching credentials.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔐 ProofAI Verifiable Credentials</h1>
        <p className="message">{message}</p>

        {!account ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <button onClick={fetchCredentials}>Fetch My Credentials</button>
        )}

        <div className="credentials-grid">
          {credentials.map((cred, index) => (
            <div key={index} className="credential-card">
              <img src={cred.image} alt={cred.name} />
              <h3>{cred.name}</h3>
              <p>{cred.description}</p>
              <div className="attributes">
                {cred.attributes.map((attr, idx) => (
                  <div key={idx} className="attribute">
                    <strong>{attr.trait_type}:</strong> {attr.value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;