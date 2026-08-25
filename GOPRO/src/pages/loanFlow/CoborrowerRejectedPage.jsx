import React from 'react';
import { AUCARD, AUBUTTON } from 'artiqui/dist/router-engine.es.js';

export default function CoborrowerRejectedPage() {
  return (
    <AUCARD className="loan-flow-card">
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '48px', color: '#dc3545', marginBottom: '15px' }}>❌</div>
        <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Co-Borrower Eligibility Rejected</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>State: COBORROWER-STATUS-V1-REJECTED-V1</p>
        <p style={{ color: '#555', marginBottom: '20px' }}>
          The co-borrower evaluation failed credit or fraud eligibility criteria.
        </p>
        <AUBUTTON variant="outline" onClick={() => window.location.href = '/'}>
          Return to Dashboard
        </AUBUTTON>
      </div>
    </AUCARD>
  );
}
