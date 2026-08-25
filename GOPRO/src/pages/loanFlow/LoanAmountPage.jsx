import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function LoanAmountPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [requestedAmount, setRequestedAmount] = useState('500000');
  const [tenureMonths, setTenureMonths] = useState('36');

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'LENDER-OFFER-V1-LOAN-AMOUNT-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'LOAN-AMOUNT-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleNext = async () => {
    try {
      const payload = {
        eventType: 'AMOUNT_SELECTED',
        formData: { requestedAmount, tenureMonths },
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
      <h2>Requested Amount & Tenure</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Select your desired amount and repayment duration.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <AUINPUT
          type="number"
          label="Requested Amount (₹)"
          name="requestedAmount"
          value={requestedAmount}
          onChange={(e) => setRequestedAmount(e.target.value)}
          placeholder="Enter requested amount"
          required
        />

        <AUINPUT
          type="number"
          label="Tenure (Months)"
          name="tenureMonths"
          value={tenureMonths}
          onChange={(e) => setTenureMonths(e.target.value)}
          placeholder="Enter tenure in months"
          required
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <AUBUTTON variant="primary" onClick={handleNext}>
            Proceed to Offer Selection
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate(-1)}>
            Back
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
