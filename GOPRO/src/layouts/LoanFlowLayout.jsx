import React from 'react';
import { Outlet, useLoaderData, useSearchParams } from 'react-router-dom';
import { AUSTEPPER, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { SessionManager } from '../workflow/SessionManager';

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
  const loaderData = useLoaderData();
  const workflowData = loaderData?.workflowData;
  const [searchParams] = useSearchParams();
  // Surface-only: shows recovered sessionId; never gates rendering (no global login).
  const activeSessionId = SessionManager.getSessionId(searchParams);
  const activeMeta = SessionManager.getSessionMeta();

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
          {activeSessionId ? (
            <p style={{ color: '#888', fontSize: '12px', marginTop: '10px' }}>
              Workflow session: {activeSessionId}
              {activeMeta?.status ? ` (${activeMeta.status})` : ''}
            </p>
          ) : null}
        </AUCARD>
        
        <div style={{ marginTop: '30px' }}>
          <Outlet context={{ workflowData }} />
        </div>
      </div>
    </div>
  );
}
