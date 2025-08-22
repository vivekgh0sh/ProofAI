// src/pages/HomePage.jsx

import React from 'react';

const HomePage = ({ connectWallet }) => {
  return (
    <div className="homepage-container">
      {/* --- Hero Section --- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Prevent Employment Fraud, Instantly.</h1>
          <p className="subtitle">
            ProofAI is the on-chain verification layer that protects organizations from fraudulent candidates and dual employment.
          </p>
          <button onClick={connectWallet} className="btn-primary btn-hero">
            Access Dashboard
          </button>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="how-it-works-section">
        <h2>A Simple, Trustworthy Process</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Verify Candidate</h3>
            <p>Paste a candidate's wallet address into our dashboard to check for on-chain employment conflicts.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Issue Credentials</h3>
            <p>Authorized companies can mint soulbound Employment NFTs directly to an employee's wallet, creating an immutable record.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Protect Your Company</h3>
            <p>Leverage the blockchain to ensure your next hire is transparent, trustworthy, and fully committed.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;