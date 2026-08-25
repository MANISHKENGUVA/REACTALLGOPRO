import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON, AUTEXTAREA } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function FraudCheckPendingPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [remarks, setRemarks] = useState('');

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'MANAGER-FRAUD-CHECK-V1-FRAUD-CHECK-PENDING-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'FRAUD-CHECK-PENDING-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleDecision = async (decision) => {
    try {
      const payload = {
        eventType: 'FRAUD_CHECK_PENDING_DECISION',
        formData: { decision, remarks },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Fraud check pending submission failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/manager-approval');
    } catch (err) {
      console.error('Fraud check pending error:', err);
      navigate('/loan-flow/manager-approval');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Manager Review: Post-Offer Fraud Check Pending</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Offer accepted by borrower. Secondary post-offer fraud scan pending manager verification.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <AUTEXTAREA
          label="Fraud Audit Remarks"
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter fraud audit remarks..."
          rows={3}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <AUBUTTON variant="primary" onClick={() => handleDecision('APPROVED')}>Clear Fraud Flag & Pass</AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => handleDecision('REJECTED')}>Reject Due to Fraud</AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
