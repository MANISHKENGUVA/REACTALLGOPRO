import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import { AUBUTTON, AUTEXTAREA, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function ManagerCreditExceptionPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [remarks, setRemarks] = useState('');
  const outletContext = useOutletContext();

  const activeWorkflowData = outletContext?.workflowData || metadata;
  const payload = activeWorkflowData?.data ?? activeWorkflowData;

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: payload?.componentviewrenderState || payload?.componentState || searchParams.get('STATE') || 'MANAGER-REVIEW-V1-CREDIT-EXCEPTION-V1',
      componentKey: payload?.componentKey || payload?.componentviewrender?.componentKey || searchParams.get('COMPONENT_KEY') || 'CREDIT-EXCEPTION-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || payload?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || payload?.workflowActor || '',
    };
  }, [metadata, payload, searchParams]);

  const handleDecision = async (decision) => {
    try {
      const payload = {
        eventType: 'MANAGER_CREDIT_EXCEPTION_DECISION',
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
      navigate(nextRoute || '/loan-flow/fraud-check');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      navigate('/loan-flow/fraud-check');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Manager Review: Credit Exception</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Credit score is within exception range (600–700). Manager decision required.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#fff8e1', borderRadius: '8px', borderLeft: '4px solid #ffa000' }}>
          <p style={{ margin: 0, fontWeight: '500' }}>Exception Flag: Fair Credit Score (645)</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Applicant has zero late payments in the past 6 months. Manual credit override requested.
          </p>
        </div>

        <AUTEXTAREA
          label="Manager Notes & Justification"
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter override rationale or refusal remarks..."
          rows={3}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <AUBUTTON variant="primary" onClick={() => handleDecision('APPROVED')}>
            Approve Exception Override
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => handleDecision('REJECTED')}>
            Reject Application
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
