import React from 'react';
import { AUCARD, AUBUTTON } from 'artiqui/dist/router-engine.es.js';

export default function ApplicationApprovedPage() {
  return (
    <AUCARD className="loan-flow-card">
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '48px', color: '#28a745', marginBottom: '15px' }}>🎉</div>
        <h2 style={{ color: '#28a745', marginBottom: '10px' }}>Loan Application Approved!</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-STATUS-V1-APPROVED-V1</p>
        <div style={{ backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
          <p style={{ margin: '5px 0' }}><strong>Sanctioned Amount:</strong> ₹ 5,00,000</p>
          <p style={{ margin: '5px 0' }}><strong>Interest Rate:</strong> 11.5% p.a.</p>
          <p style={{ margin: '5px 0' }}><strong>Tenure:</strong> 36 Months</p>
          <p style={{ margin: '5px 0' }}><strong>Disbursement Status:</strong> Completed / Scheduled</p>
        </div>
        <AUBUTTON variant="primary" onClick={() => window.location.href = '/'}>
          Return to Dashboard
        </AUBUTTON>
      </div>
    </AUCARD>
  );
}
