// src/components/UserDashboard.jsx
import React, { useState, useEffect } from 'react';

const UserDashboard = ({ account, contract }) => {
  const [credentials, setCredentials] = useState([]);
  const [employmentHistory, setEmploymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // This function will be called when the component loads
    if (contract && account) {
      loadUserData();
    }
  }, [contract, account]); // The effect re-runs if contract or account changes

  const loadUserData = async () => {
    try {
      setLoading(true);
      setMessage('Fetching your on-chain data...');

      // Fetch the simple credential NFTs (like we did before)
      const credTokenIds = await contract.getCredentialsByOwner(account);
      let fetchedCredentials = [];
      for (const id of credTokenIds) {
        const metadataUri = await contract.tokenURI(id);
        // In a real app, you'd fetch the metadata. For now, we'll just show the ID.
        fetchedCredentials.push({ tokenId: id.toString(), name: `Credential #${id}` });
      }
      setCredentials(fetchedCredentials);

      // Fetch the detailed employment history
      const history = await contract.getEmploymentHistory(account);
      setEmploymentHistory(history);

      setMessage('Data loaded successfully!');
    } catch (error) {
      console.error('Error loading user data:', error);
      setMessage('Could not load user data.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    // The contract returns timestamps in seconds, so we multiply by 1000 for JavaScript
    const bigIntTimestamp = BigInt(timestamp);
    if (bigIntTimestamp === 0n) return 'Present';
    return new Date(Number(bigIntTimestamp * 1000n)).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Loading Your Verifiable Profile...</h2>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Your Verifiable Profile</h1>
      <p className="wallet-address">Wallet: {account}</p>

      {/* Employment History Section */}
      <section className="profile-section">
        <h2>📚 Employment History</h2>
        {employmentHistory.length > 0 ? (
          <div className="timeline">
            {employmentHistory.map((job, index) => (
              <div key={index} className="timeline-item">
                <h3>{job.position}</h3>
                <h4>{job.companyName}</h4>
                <p className="employment-period">
                  {formatDate(job.startDate)} - {formatDate(job.endDate)}
                </p>
                <span className="employment-type">{job.employmentType}</span>
              </div>
            ))}
          </div>
        ) : <p>No employment history found on-chain.</p>}
      </section>

      {/* Credentials Section */}
      <section className="profile-section">
        <h2>🎓 Other Credentials</h2>
        {credentials.length > 0 ? (
          <div className="credentials-grid">
            {credentials.map((cred, index) => (
              <div key={index} className="credential-card">
                <h4>{cred.name}</h4>
              </div>
            ))}
          </div>
        ) : <p>No other credentials found on-chain.</p>}
      </section>
    </div>
  );
};

export default UserDashboard;