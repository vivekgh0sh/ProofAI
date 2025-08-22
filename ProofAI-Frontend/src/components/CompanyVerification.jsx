// src/components/CompanyVerification.jsx

import { useState } from 'react';
import { ethers } from 'ethers';

const CompanyVerification = ({ contract }) => {
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyReport, setCompanyReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!contract) {
      setError("Please connect your wallet first.");
      return;
    }
    // Basic validation for Ethereum address format
    if (!ethers.isAddress(companyAddress)) {
      setError("Invalid wallet address format. Please check and try again.");
      return;
    }

    setIsLoading(true);
    setError('');
    setCompanyReport(null);

    try {
      // This is the call to our smart contract!
      const report = await contract.verifyCompanyLegitimacy(companyAddress);
      const profile = await contract.companyProfiles(companyAddress);

      // We process the data returned from the contract into a more usable format
      const formattedReport = {
        isVerified: report.isVerified,
        trustScore: Number(report.trustScore), // Convert BigInt to Number
        warnings: report.warnings,
        companyName: profile.companyName,
        riskLevel: Number(report.trustScore) > 70 && report.warnings.length === 0 ? 'LOW' : 'HIGH'
      };

      setCompanyReport(formattedReport);

    } catch (err) {
      console.error("Error verifying company:", err);
      setError("Failed to fetch company report. The address might not be a registered company or a network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>🛡️ Protect Yourself from Fraudulent Companies</h2>
      <p>Before accepting an offer or connecting your wallet, enter a company's wallet address to check its on-chain reputation.</p>
      
      <div className="verification-form">
        <input
          type="text"
          placeholder="Enter company wallet address to verify"
          value={companyAddress}
          onChange={(e) => setCompanyAddress(e.target.value)}
        />
        <button onClick={handleVerify} disabled={isLoading || !companyAddress}>
          {isLoading ? 'Verifying...' : 'Check Company'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {companyReport && (
        <div className="results-container">
          <h3>Verification Report for: <span className="address-highlight">{companyReport.companyName || companyAddress}</span></h3>
          
          <div className={`result-card ${companyReport.riskLevel.toLowerCase()}`}>
            <div className="status-text">
              Risk Level: {companyReport.riskLevel}
            </div>
            <p><strong>Trust Score:</strong> {companyReport.trustScore} / 100</p>
            
            {companyReport.warnings.length > 0 && (
              <div className="warnings-section">
                <h4>⚠️ Red Flags Found:</h4>
                <ul>
                  {companyReport.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="recommendation">
              {companyReport.riskLevel === 'LOW' ? 
                "✅ This company is verified and has a good on-chain reputation." : 
                "❌ High risk detected. Proceed with extreme caution."
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyVerification;