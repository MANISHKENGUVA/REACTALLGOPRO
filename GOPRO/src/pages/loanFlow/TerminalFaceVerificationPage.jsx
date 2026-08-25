import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';

export default function TerminalFaceVerificationPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'BORROWER-KYC-V1-TERMINAL-FACEVERIFICATION-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'TERMINAL-FACEVERIFICATION-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  return (
    <AUCARD className="loan-flow-card">
      <h2>Application Under Review</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Metadata: {workflowMetadata.workflowId} | {workflowMetadata.workflowActor} | {workflowMetadata.componentKey}
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px',
        backgroundColor: '#fff3cd',
        borderLeft: '5px solid #ff9800',
        borderRadius: '8px',
        marginTop: '10px'
      }}>
        <div style={{ fontSize: '36px', textAlign: 'center' }}>👨‍💼</div>
        <h3 style={{ margin: 0, textAlign: 'center', color: '#856404' }}>
          Manager Approval Required
        </h3>
        <p style={{ fontSize: '16px', lineHeight: '1.5', textAlign: 'center', color: '#856404', margin: 0 }}>
          Your application is currently under manager approval. Please contact the manager for further processing of your loan application.
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
