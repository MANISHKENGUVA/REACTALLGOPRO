import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUTEXTAREA, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function ManagerEligibilityReviewPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [remarks, setRemarks] = useState('');

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'MANAGER-REVIEW-V1-ELIGIBILITY-REVIEW-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'ELIGIBILITY-REVIEW-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleDecision = async (decision) => {
    try {
      const payload = {
        eventType: 'MANAGER_ELIGIBILITY_DECISION',
        formData: { decision, remarks },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Event submission failed with status ${response.status}`);
      }

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/underwriter-review');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      navigate('/loan-flow/underwriter-review');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Manager Review: Eligibility Override</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Income-to-Debt ratio is slightly above threshold. Manual eligibility review required.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '8px', borderLeft: '4px solid #ab47bc' }}>
          <p style={{ margin: 0, fontWeight: '500' }}>Review Status: Eligibility Exception</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Check collateral support or existing relationship history for approval.
          </p>
        </div>

        <AUTEXTAREA
          label="Eligibility Decision Rationale"
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter override or rejection notes..."
          rows={3}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <AUBUTTON variant="primary" onClick={() => handleDecision('APPROVED')}>
            Approve Eligibility Override
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => handleDecision('REJECTED')}>
            Reject Application
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
