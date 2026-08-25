import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function LoanConsentPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [agreed, setAgreed] = useState(false);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'BORROWER-CONSENT-V1-LOAN-CONSENT-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'LOAN-CONSENT-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleNext = async () => {
    if (!agreed) {
      alert('Please accept the consent terms to proceed');
      return;
    }

    try {
      const payload = {
        eventType: 'CONSENT_SUBMITTED',
        formData: { agreed },
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
      navigate(nextRoute || '/loan-flow/credit-check');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      navigate('/loan-flow/credit-check');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Application Consent</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Please review and accept the application terms and credit check consent.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          maxHeight: '180px',
          overflowY: 'auto',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Terms & Conditions Consent Declaration:</p>
          <p style={{ margin: '0 0 10px 0' }}>
            1. I hereby authorize the institution to fetch credit bureau reports and verify provided identity details.
          </p>
          <p style={{ margin: '0 0 10px 0' }}>
            2. I confirm that all financial and personal disclosures made during this application are true and accurate.
          </p>
          <p style={{ margin: 0 }}>
            3. I consent to receiving communication via SMS, Email, and WhatsApp regarding application updates.
          </p>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          I have read and agree to all terms and consent declarations above.
        </label>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <AUBUTTON variant="primary" onClick={handleNext} disabled={!agreed}>
            Accept & Continue
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/document-upload')}>
            Back
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
