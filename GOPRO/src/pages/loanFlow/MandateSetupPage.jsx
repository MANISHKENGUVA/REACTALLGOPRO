import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function MandateSetupPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [authMode, setAuthMode] = useState('netbanking');

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'LENDER-MANDATE-V1-MANDATE-SETUP-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'MANDATE-SETUP-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleNext = async () => {
    try {
      const payload = {
        eventType: 'MANDATE_REGISTERED',
        formData: { authMode },
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
      navigate('/loan-flow/disbursement');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Automated Payment Mandate (eNACH)</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Set up recurring payment mandate for automated repayments.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <AUSELECT
          label="Select Authentication Method"
          name="authMode"
          value={authMode}
          onChange={(e) => setAuthMode(e.target.value)}
          options={[
            { label: 'Net Banking', value: 'netbanking' },
            { label: 'Debit Card', value: 'debitcard' },
            { label: 'Aadhaar OTP', value: 'aadhaar' }
          ]}
        />

        <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Mandate registration ensures seamless automated payment processing with zero manual effort.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <AUBUTTON variant="primary" onClick={handleNext}>
            Authorize Mandate & Proceed
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate(-1)}>
            Back
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
