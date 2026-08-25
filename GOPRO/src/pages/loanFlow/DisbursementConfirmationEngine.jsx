import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUPROGRESS, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function DisbursementConfirmationEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [confirming, setConfirming] = useState(true);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'LENDER-DISBURSEMENT-V1-DISBURSEMENT-CONFIRMATION-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'DISBURSEMENT-CONFIRMATION-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setConfirming(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    try {
      const payload = {
        eventType: 'DISBURSEMENT_CONFIRMED',
        formData: {
          disbursementStatus: 'SUCCESS',
          utrNumber: 'UTR-991204859123',
        },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Disbursement confirmation failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/approved');
    } catch (err) {
      console.error('Disbursement confirmation engine error:', err);
      navigate('/loan-flow/approved');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Disbursement Confirmation Engine</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '15px' }}>
        {confirming ? (
          <div>
            <p style={{ marginBottom: '10px' }}>Waiting for bank UTR ACK webhook notification...</p>
            <AUPROGRESS value={95} />
          </div>
        ) : (
          <div>
            <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '15px' }}>
              ✓ Bank Payout Confirmed! UTR: UTR-991204859123
            </div>
            <AUBUTTON variant="primary" onClick={handleNext}>View Final Loan Approval</AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}
