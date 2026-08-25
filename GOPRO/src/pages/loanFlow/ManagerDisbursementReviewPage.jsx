import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON, AUTEXTAREA } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function ManagerDisbursementReviewPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [remarks, setRemarks] = useState('');

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'MANAGER-APPROVAL-V1-DISBURSEMENT-REVIEW-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'DISBURSEMENT-REVIEW-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleDecision = async (decision) => {
    try {
      const payload = {
        eventType: 'MANAGER_DISBURSEMENT_REVIEW_DECISION',
        formData: { decision, remarks },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Disbursement review submission failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/disbursement');
    } catch (err) {
      console.error('Manager disbursement review error:', err);
      navigate('/loan-flow/disbursement');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Manager Review: Manual Disbursement Release Gate</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Disbursement flagged for high-value manual manager sign-off before releasing funds.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <AUTEXTAREA
          label="Disbursement Authorization Remarks"
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter authorization notes..."
          rows={3}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <AUBUTTON variant="primary" onClick={() => handleDecision('APPROVED')}>Authorize Payout Release</AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => handleDecision('REJECTED')}>Reject Payout Release</AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
