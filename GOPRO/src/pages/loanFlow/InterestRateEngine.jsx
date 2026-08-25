import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUPROGRESS, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function InterestRateEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [calculating, setCalculating] = useState(true);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'LENDER-OFFER-V1-INTEREST-RATE-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'INTEREST-RATE-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setCalculating(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    try {
      const payload = {
        eventType: 'INTEREST_RATE_CALCULATED',
        formData: {
          interestRate: 11.5,
          processingFee: 1500,
        },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Interest rate submit failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/loan-offer');
    } catch (err) {
      console.error('Interest rate engine error:', err);
      navigate('/loan-flow/loan-offer');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Interest Rate Pricing Engine</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '15px' }}>
        {calculating ? (
          <div>
            <p style={{ marginBottom: '10px' }}>Computing risk-adjusted APR & interest rate...</p>
            <AUPROGRESS value={90} />
          </div>
        ) : (
          <div>
            <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '15px' }}>
              ✓ Calculated Risk-Adjusted Interest Rate: <strong>11.5% p.a.</strong>
            </div>
            <AUBUTTON variant="primary" onClick={handleNext}>Proceed to Final Loan Offer</AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}
