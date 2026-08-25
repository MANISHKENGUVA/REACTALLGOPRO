import React, { useMemo } from 'react';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';

export default function ApplicationRejectedPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const outletContext = useOutletContext();

  const activeWorkflowData = outletContext?.workflowData || metadata;
  const payload = activeWorkflowData?.data ?? activeWorkflowData;

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: payload?.componentviewrenderState || payload?.componentState || searchParams.get('STATE') || searchParams.get('componentViewRenderState') || 'BORROWER-STATUS-V1-REJECTED-V1',
      componentKey: payload?.componentKey || payload?.componentviewrender?.componentKey || searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || 'REJECTED-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || payload?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || payload?.workflowActor || '',
    };
  }, [metadata, payload, searchParams]);

  return (
    <AUCARD className="loan-flow-card">
      <h2 style={{ color: '#d32f2f' }}>Application Rejected</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>
        State: {workflowMetadata.componentViewRenderState}
      </p>
      {workflowMetadata.workflowId && (
        <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
          Workflow ID: {workflowMetadata.workflowId} | Actor: {workflowMetadata.workflowActor}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: '24px',
          backgroundColor: '#ffebee',
          borderLeft: '5px solid #d32f2f',
          borderRadius: '8px',
          marginTop: '10px',
        }}
      >
        <div style={{ fontSize: '42px', textAlign: 'center' }}>❌</div>
        <h3 style={{ margin: 0, textAlign: 'center', color: '#c62828' }}>
          Loan Application Status: Rejected
        </h3>
        <p style={{ fontSize: '15px', lineHeight: '1.6', textAlign: 'center', color: '#555', margin: 0 }}>
          We regret to inform you that your application could not be approved at this time.
          This decision was reached based on current risk assessment parameters and credit evaluation guidelines.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '15px' }}>
          <AUBUTTON variant="primary" onClick={() => navigate('/')}>
            Back to Home
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
