import React, { useMemo } from 'react';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function DisbursementFailedPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const outletContext = useOutletContext();

  const activeWorkflowData = outletContext?.workflowData || metadata;
  const payload = activeWorkflowData?.data ?? activeWorkflowData;

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: payload?.componentviewrenderState || payload?.componentState || searchParams.get('STATE') || searchParams.get('componentViewRenderState') || 'LENDER-DISBURSEMENT-V1-DISBURSEMENT-FAILED-V1',
      componentKey: payload?.componentKey || payload?.componentviewrender?.componentKey || searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || 'DISBURSEMENT-FAILED-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || payload?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || payload?.workflowActor || '',
    };
  }, [metadata, payload, searchParams]);

  const handleRetry = async () => {
    try {
      const payload = {
        eventType: 'RETRY_DISBURSEMENT',
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
      navigate(nextRoute || '/loan-flow/disbursement');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      navigate('/loan-flow/bank-details');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2 style={{ color: '#c62828' }}>Disbursement Failed</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        The automated transfer attempt failed due to banking network or IFSC details error.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px', borderLeft: '4px solid #ef5350' }}>
          <p style={{ margin: 0, fontWeight: '500', color: '#c62828' }}>
            Reason: Invalid account number / bank server timeout.
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#555' }}>
            Please re-verify your bank account credentials or click Retry to re-submit disbursement request.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <AUBUTTON variant="primary" onClick={handleRetry}>
            Retry Transfer
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/bank-details')}>
            Update Bank Details
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
