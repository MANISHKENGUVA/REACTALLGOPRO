import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUPROGRESS } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function VerificationPendingPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dots, setDots] = useState('');

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'BORROWER-KYC-V1-VERIFICATION-PENDING-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'VERIFICATION-PENDING-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      if (!workflowMetadata.workflowId || !workflowMetadata.workflowActor) {
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/workflow-navigator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            WORKFLOW_ID: workflowMetadata.workflowId,
            WORKFLOW_ACTOR: workflowMetadata.workflowActor,
          }),
        });

        if (!response.ok) return;

        const result = await response.json();
        const workflowResult = result?.data ?? result;
        const componentKey = workflowResult?.componentviewrender?.componentKey;

        if (componentKey && componentKey !== 'VERIFICATION-PENDING-V1' && componentKey !== 'BORROWER-KYC-V1-VERIFICATION-PENDING-V1') {
          const nextRoute = resolveWorkflowRoute(workflowResult);
          navigate(nextRoute);
        }
      } catch (err) {
        console.error('Polling navigator failed:', err);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [workflowMetadata, navigate]);

  return (
    <AUCARD className="loan-flow-card">
      <h2>KYC Verification In Progress</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Please wait while our automated system verifies your facial identity and KYC records{dots}
      </p>

      <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <div style={{ marginBottom: '20px' }}>
          <AUPROGRESS value={65} />
        </div>
        <p style={{ color: '#0056b3', fontWeight: '500' }}>
          Checking Liveness & Match Score with Credit Registries...
        </p>
        <p style={{ color: '#888', fontSize: '12px', marginTop: '10px' }}>
          Do not refresh or close this window.
        </p>
      </div>
    </AUCARD>
  );
}
