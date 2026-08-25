import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON, AUCHECKBOX } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function BorrowerCreditCheckPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [consentGiven, setConsentGiven] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'BORROWER-CREDIT-V1-CREDIT-CHECK-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'BORROWER-CREDIT-CHECK-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleSubmit = async () => {
    if (!consentGiven) {
      alert('Please provide consent to pull credit bureau score');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        eventType: 'BORROWER_CREDIT_CHECK_SUBMITTED',
        formData: {
          'CREDIT.borrower.consentGiven': true,
        },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Credit check submit failed');

      const result = await response.json();
      const workflowResult = result?.data ?? result;
      const nextRoute = resolveWorkflowRoute(workflowResult);
      navigate(nextRoute || '/loan-flow/underwriter-review');
    } catch (err) {
      console.error('Borrower credit check error:', err);
      navigate('/loan-flow/underwriter-review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Borrower Credit Bureau Pull Consent</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Please authorize us to retrieve your latest credit score and history from credit registries (CIBIL/Experian).
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AUCHECKBOX
            name="consent"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
          />
          <label style={{ fontSize: '14px', cursor: 'pointer' }}>
            I hereby authorize the lender to fetch my credit bureau score & credit report.
          </label>
        </div>

        <AUBUTTON variant="primary" onClick={handleSubmit} disabled={submitting || !consentGiven}>
          {submitting ? 'Initiating Credit Check...' : 'Authorize & Pull Credit Score'}
        </AUBUTTON>
      </div>
    </AUCARD>
  );
}
