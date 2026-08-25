import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCARD, AULISTGROUP } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function LoanOfferPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'LENDER-OFFER-V1-LOAN-OFFER-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'LOAN-OFFER-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleAccept = async () => {
    try {
      const payload = {
        eventType: 'OFFER_ACCEPTED',
        formData: { accepted: true },
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
      navigate(nextRoute || '/loan-flow/manager-approval');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      navigate('/loan-flow/manager-approval');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Sanction Offer Summary</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Review your approved application parameters.
      </p>

      <AULISTGROUP>
        <div style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
          <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>Approved Amount</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#2e7d32' }}>₹5,00,000</p>
        </div>
        <div style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
          <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>Interest Rate</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#333' }}>8.99% p.a.</p>
        </div>
        <div style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
          <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>Tenure</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#333' }}>36 Months</p>
        </div>
        <div style={{ padding: '12px' }}>
          <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>Estimated Monthly EMI</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#333' }}>₹15,899 / month</p>
        </div>
      </AULISTGROUP>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <AUBUTTON variant="primary" onClick={handleAccept}>
          Accept Offer & Proceed
        </AUBUTTON>
        <AUBUTTON variant="outline" onClick={() => navigate('/')}>
          Decline
        </AUBUTTON>
      </div>
    </AUCARD>
  );
}
