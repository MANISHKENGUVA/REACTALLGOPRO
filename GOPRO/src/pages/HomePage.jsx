import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <AUCARD style={{ marginBottom: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#333' }}>
              Welcome to Loan Application
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '16px', marginBottom: '30px' }}>
              Fast, easy, and transparent loan processing
            </p>
            
            <AUBUTTON 
              variant="primary" 
              onClick={() => navigate('/loan-flow/personal-info')}
              style={{ padding: '12px 30px', fontSize: '16px' }}
            >
              Start Loan Application
            </AUBUTTON>
          </div>
        </AUCARD>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <AUCARD>
            <div style={{ padding: '20px' }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>✓ Quick Process</h3>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                Complete your application in just 15 minutes with our streamlined process.
              </p>
            </div>
          </AUCARD>

          <AUCARD>
            <div style={{ padding: '20px' }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>✓ Secure & Safe</h3>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                Your data is encrypted and protected with industry-leading security standards.
              </p>
            </div>
          </AUCARD>

          <AUCARD>
            <div style={{ padding: '20px' }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>✓ Instant Approval</h3>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                Get loan approval within hours with our automated verification system.
              </p>
            </div>
          </AUCARD>
        </div>

        <AUCARD style={{ marginTop: '30px' }}>
          <div style={{ padding: '20px' }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Loan Workflow (LOAN-FLOW-V5)</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: '10px 0' }}>
              Our comprehensive 21-step loan application process includes:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <p style={{ fontWeight: '500', color: '#333', margin: '5px 0' }}>📋 Personal Details</p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Basic information & KYC</p>
              </div>
              <div>
                <p style={{ fontWeight: '500', color: '#333', margin: '5px 0' }}>🏠 Address Verification</p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Address & residence type</p>
              </div>
              <div>
                <p style={{ fontWeight: '500', color: '#333', margin: '5px 0' }}>🆔 Document Upload</p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Aadhaar, PAN, documents</p>
              </div>
              <div>
                <p style={{ fontWeight: '500', color: '#333', margin: '5px 0' }}>👤 Face Verification</p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Liveness & face matching</p>
              </div>
              <div>
                <p style={{ fontWeight: '500', color: '#333', margin: '5px 0' }}>💼 Employment Details</p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Salary or business info</p>
              </div>
              <div>
                <p style={{ fontWeight: '500', color: '#333', margin: '5px 0' }}>🏦 Bank Details</p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Account & statements</p>
              </div>
              <div>
                <p style={{ fontWeight: '500', color: '#333', margin: '5px 0' }}>📊 Credit Analysis</p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Credit score & history</p>
              </div>
              <div>
                <p style={{ fontWeight: '500', color: '#333', margin: '5px 0' }}>⚠️ Risk Assessment</p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Fraud & risk scoring</p>
              </div>
              <div>
                <p style={{ fontWeight: '500', color: '#333', margin: '5px 0' }}>👨‍💼 Manual Review</p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Underwriter & manager</p>
              </div>
              <div>
                <p style={{ fontWeight: '500', color: '#333', margin: '5px 0' }}>💰 Disbursement</p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Final loan transfer</p>
              </div>
            </div>
          </div>
        </AUCARD>
      </div>
    </div>
  );
}
