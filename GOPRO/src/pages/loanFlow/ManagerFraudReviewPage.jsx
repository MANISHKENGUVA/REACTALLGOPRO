import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import { AUBUTTON, AUTEXTAREA, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function ManagerFraudReviewPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [remarks, setRemarks] = useState('');
  const outletContext = useOutletContext();

  const activeWorkflowData = outletContext?.workflowData || metadata;
  const payload = activeWorkflowData?.data ?? activeWorkflowData;

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: payload?.componentviewrenderState || payload?.componentState || searchParams.get('STATE') || 'MANAGER-FRAUD-CHECK-V1-FRAUD-CHECK-PENDING-V1',
      componentKey: payload?.componentKey || payload?.componentviewrender?.componentKey || searchParams.get('COMPONENT_KEY') || 'FRAUD-CHECK-PENDING-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || payload?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || payload?.workflowActor || '',
    };
  }, [metadata, payload, searchParams]);

  const handleDecision = async (decision) => {
    try {
      const payload = {
        eventType: 'MANAGER_FRAUD_DECISION',
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
      navigate(nextRoute || '/loan-flow/document-upload');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      navigate('/loan-flow/document-upload');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Manager Review: Fraud Alert Clear</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Suspicious activity flag raised during automated verification.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#ffe0b2', borderRadius: '8px', borderLeft: '4px solid #f57c00' }}>
          <p style={{ margin: 0, fontWeight: '500' }}>Flag: Address mismatch between Aadhaar & Bank Statement</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Verify physical address proof documents manually before clearing.
          </p>
        </div>

        <AUTEXTAREA
          label="Verification Remarks"
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter audit notes..."
          rows={3}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <AUBUTTON variant="primary" onClick={() => handleDecision('CLEAR')}>
            Mark Fraud Flag Clear
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => handleDecision('REJECTED')}>
            Reject Application
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
