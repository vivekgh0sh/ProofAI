// src/components/PricingPage.jsx

import React from 'react';

const PricingPage = () => {
  return (
    <div className="dashboard-container">
      <div className="pricing-header">
        <h2>Enterprise Pricing</h2>
        <p>Simple, transparent pricing to prevent fraud and protect your organization.</p>
      </div>
      
      <div className="pricing-tiers">
        <div className="tier starter">
          <h3>Starter</h3>
          <div className="price">$0.50<span>/verification</span></div>
          <ul>
            <li>Basic Fraud Detection</li>
            <li>Employment Conflict Alerts</li>
            <li>On-Chain Verification</li>
            <li>API Access</li>
          </ul>
          <div className="minimum">$99/month minimum spend</div>
          <button className="btn-secondary">Get Started</button>
        </div>
        
        <div className="tier professional popular">
          <div className="popular-badge">MOST POPULAR</div>
          <h3>Professional</h3>
          <div className="price">$1.25<span>/verification</span></div>
          <ul>
            <li>Advanced AI Analysis</li>
            <li>Real-Time Monitoring</li>
            <li>Bulk Verification Tools</li>
            <li>Priority Email Support</li>
          </ul>
          <div className="minimum">$299/month minimum spend</div>
          <button className="btn-primary">Choose Professional</button>
        </div>
        
        <div className="tier enterprise">
          <h3>Enterprise</h3>
          <div className="price">Custom<span>pricing</span></div>
          <ul>
            <li>White-Label Solution</li>
            <li>Custom Integrations (Workday, etc.)</li>
            <li>Dedicated Success Manager</li>
            <li>99.9% Uptime SLA</li>
          </ul>
          <div className="minimum">Annual Contract</div>
          <button className="btn-secondary">Contact Sales</button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;