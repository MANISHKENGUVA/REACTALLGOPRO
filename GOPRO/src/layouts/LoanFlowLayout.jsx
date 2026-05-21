import React from 'react';
import { Outlet } from 'react-router-dom';
import { AUSTEPPER, AUCARD } from 'artiqui/dist/router-engine.es.js';

const steps = [
  'Personal Info',
  'Address',
  'KYC Upload',
  'KYC Verification',
  'Employment',
  'Bank Details',
  'Risk Assessment',
  'Approval',
  'Disbursement'
];

export default function LoanFlowLayout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <AUCARD style={{ marginBottom: '30px' }}>
          <h1 style={{ marginBottom: '20px' }}>Loan Application Journey</h1>
          <AUSTEPPER 
            steps={steps} 
            activeStep={1}
            orientation="horizontal"
          />
        </AUCARD>
        
        <div style={{ marginTop: '30px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
