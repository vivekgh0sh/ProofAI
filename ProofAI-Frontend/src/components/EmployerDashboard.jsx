// src/components/EmployerDashboard.jsx
import React, { useState } from 'react';

const EmployerDashboard = ({ account, contract }) => {
  const [candidateAddress, setCandidateAddress] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyCandidate = async () => {
    if (!contract || !candidateAddress) {
      setError('Please enter a valid wallet address.');
      return;
    }
    setLoading(true);
    setError('');
    setVerificationResult(null);

    try {
      // Call the two main verification functions on the smart contract
      const conflictData = await contract.checkEmploymentConflicts(candidateAddress);
      const activeJobs = await contract.getActiveEmployments(candidateAddress);

      // Format the results for display
      const result = {
        hasConflicts: conflictData.hasConflicts,
        activeFullTimeCount: Number(conflictData.activeFullTimeCount),
        activeJobs: activeJobs
      };
      setVerificationResult(result);

    } catch (err) {
      console.error("Verification failed:", err);
      setError("Verification failed. The address might not exist or have a profile.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const bigIntTimestamp = BigInt(timestamp);
    return new Date(Number(bigIntTimestamp * 1000n)).toLocaleDateString();
  };

  return (
    <div className="dashboard-container">
      <h1>🔍 Employment Verification Center</h1>
      <p>Enter a candidate's wallet address to check for employment conflicts.</p>

      <div className="verification-form">
        <input
          type="text"
          placeholder="0x... candidate wallet address"
          value={candidateAddress}
          onChange={(e) => setCandidateAddress(e.target.value)}
        />
        <button onClick={verifyCandidate} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Candidate'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {verificationResult && (
        <div className="results-container">
          <h2>Verification Results for <span className="address-highlight">{`${candidateAddress.slice(0, 6)}...${candidateAddress.slice(-4)}`}</span></h2>
          <div className={`result-card ${verificationResult.hasConflicts ? 'conflict' : 'no-conflict'}`}>
            <h3>Conflict Status</h3>
            <p className="status-text">
              {verificationResult.hasConflicts ? '🔴 CONFLICT DETECTED' : '✅ NO CONFLICTS FOUND'}
            </p>
            <p>
              This address has <strong>{verificationResult.activeFullTimeCount}</strong> active full-time job(s) recorded on-chain.
            </p>
          </div>

          <div className="result-card">
            <h3>Active Employments ({verificationResult.activeJobs.length})</h3>
            {verificationResult.activeJobs.length > 0 ? (
              verificationResult.activeJobs.map((job, index) => (
                <div key={index} className="job-details">
                  <strong>{job.position}</strong> at {job.companyName} ({job.employmentType})
                  <span>Started: {formatDate(job.startDate)}</span>
                </div>
              ))
            ) : <p>No active employments found.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;