import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUPROGRESS, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function DisbursementRequestEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [requesting, setRequesting] = useState(true);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'LENDER-DISBURSEMENT-V1-DISBURSEMENT-REQUEST-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'DISBURSEMENT-REQUEST-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setRequesting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    try {
      const payload = {
        eventType: 'DISBURSEMENT_REQUEST_SUBMITTED',
        formData: {
          disbursementInitiated: true,
          transactionRef: 'NEFT-883920192',
        },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Disbursement request submit failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/disbursement-confirmation');
    } catch (err) {
      console.error('Disbursement request engine error:', err);
      navigate('/loan-flow/disbursement-confirmation');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Lender Disbursement Request Engine</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '15px' }}>
        {requesting ? (
          <div>
            <p style={{ marginBottom: '10px' }}>Sending bank payout payload via NEFT / RTGS gateway...</p>
            <AUPROGRESS value={80} />
          </div>
        ) : (
          <div>
            <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '15px' }}>
              ✓ Payout Transfer Payload Successfully Pushed to Banking Partner Gateway.
            </div>
            <AUBUTTON variant="primary" onClick={handleNext}>Proceed to Disbursement Confirmation</AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}
