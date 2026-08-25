import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUTEXTAREA, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function ManagerDocumentReviewPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [remarks, setRemarks] = useState('');

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'MANAGER-REVIEW-V1-DOCUMENT-REVIEW-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'DOCUMENT-REVIEW-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleDecision = async (decision) => {
    try {
      const payload = {
        eventType: 'MANAGER_DOCUMENT_DECISION',
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
      navigate(nextRoute || '/loan-flow/risk-assessment');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      navigate('/loan-flow/risk-assessment');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Manager Review: Document Verification</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Low image clarity or blur detected on submitted KYC/financial documents.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#e1f5fe', borderRadius: '8px', borderLeft: '4px solid #0288d1' }}>
          <p style={{ margin: 0, fontWeight: '500' }}>Review Status: Manual Document Inspection</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Check bank statements and payslip seal authenticity.
          </p>
        </div>

        <AUTEXTAREA
          label="Document Review Comments"
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter document verification notes..."
          rows={3}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <AUBUTTON variant="primary" onClick={() => handleDecision('APPROVED')}>
            Approve Documents
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => handleDecision('REJECTED')}>
            Reject Documents
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
