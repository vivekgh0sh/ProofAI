// src/components/CompanyDashboard.jsx
import React, { useState, useEffect } from 'react';

const CompanyDashboard = ({ account, contract, signer }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employeeAddress: '',
    position: '',
    employmentType: 'full-time',
    companyName: 'ProofAI Demo Corp' // You can pre-fill or make this an input
  });

  // Check if the connected wallet is an authorized company
  useEffect(() => {
    const checkAuthorization = async () => {
      if (contract && account) {
        try {
          const authorized = await contract.authorizedCompanies(account);
          setIsAuthorized(authorized);
        } catch (error) {
          console.error('Error checking authorization:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    checkAuthorization();
  }, [contract, account]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMintNFT = async (e) => {
    e.preventDefault();
    if (!contract || !signer) {
      alert('Please connect your wallet.');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.mintEmploymentNFT(
        formData.employeeAddress,
        formData.companyName,
        formData.position,
        formData.employmentType,
        "https://gist.githubusercontent.com/vivekgh0sh/496601df7f5388a49f3ac4c9beced37e/raw/85bcb7f4ffa95fe7159277a69e1c6784c7adec04/credential-1.json" // Using your Gist for demo metadata
      );
      await tx.wait();
      alert('Employment NFT minted successfully!');
      setFormData({ ...formData, employeeAddress: '', position: '' }); // Reset form
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint Employment NFT. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isAuthorized) {
    return <div className="dashboard-container"><p>Checking authorization...</p></div>;
  }

  // If the user is not an authorized company, show this message
  if (!isAuthorized) {
    return (
      <div className="dashboard-container unauthorized-card">
        <h2>⛔️ Authorization Required</h2>
        <p>Your connected wallet ({account}) is not authorized to mint employment NFTs.</p>
        <p>In a real application, the platform owner would use the `authorizeCompany` function to whitelist your company's official wallet.</p>
      </div>
    );
  }

  // If they are authorized, show the minting form
  return (
    <div className="dashboard-container">
      <h1>🏢 Company Minting Hub</h1>
      <p>Issue new, on-chain employment records for your employees.</p>

      <form className="minting-form" onSubmit={handleMintNFT}>
        <h3>Mint New Employment NFT</h3>
        <div className="form-group">
          <label htmlFor="employeeAddress">Employee Wallet Address</label>
          <input
            type="text"
            id="employeeAddress"
            name="employeeAddress"
            placeholder="0x..."
            value={formData.employeeAddress}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="position">Position / Job Title</label>
          <input
            type="text"
            id="position"
            name="position"
            placeholder="e.g., Software Engineer"
            value={formData.position}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="employmentType">Employment Type</label>
          <select
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleInputChange}
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <button type="submit" className="mint-button" disabled={loading}>
          {loading ? 'Minting...' : 'Mint Employment NFT'}
        </button>
      </form>
    </div>
  );
};

export default CompanyDashboard;