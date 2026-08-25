import React from 'react';
import { AUCARD, AUBUTTON } from 'artiqui/dist/router-engine.es.js';

export default function ApplicationCancelledPage() {
  return (
    <AUCARD className="loan-flow-card">
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '48px', color: '#ff9800', marginBottom: '15px' }}>⚠️</div>
        <h2 style={{ color: '#d35400', marginBottom: '10px' }}>Loan Application Cancelled</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-STATUS-V1-CANCELLED-V1</p>
        <p style={{ color: '#555', marginBottom: '20px' }}>
          This loan application has been cancelled by the applicant or expired.
        </p>
        <AUBUTTON variant="outline" onClick={() => window.location.href = '/'}>
          Back to Home
        </AUBUTTON>
      </div>
    </AUCARD>
  );
}
