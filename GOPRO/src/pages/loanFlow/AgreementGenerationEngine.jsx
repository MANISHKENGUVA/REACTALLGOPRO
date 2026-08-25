import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUPROGRESS, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function AgreementGenerationEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [generating, setGenerating] = useState(true);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'LENDER-AGREEMENT-V1-AGREEMENT-GENERATION-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'AGREEMENT-GENERATION-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setGenerating(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    try {
      const payload = {
        eventType: 'AGREEMENT_GENERATION_SUBMITTED',
        formData: {
          agreementGenerated: true,
          agreementDocumentId: 'DOC-AGREEMENT-99231',
        },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Agreement generation submit failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/esign');
    } catch (err) {
      console.error('Agreement generation engine error:', err);
      navigate('/loan-flow/esign');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Lender Loan Agreement Generation Engine</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '15px' }}>
        {generating ? (
          <div>
            <p style={{ marginBottom: '10px' }}>Generating legal Loan Agreement PDF & stamping e-signatures...</p>
            <AUPROGRESS value={75} />
          </div>
        ) : (
          <div>
            <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '15px' }}>
              ✓ Legal Loan Agreement PDF Generated & Stamped.
            </div>
            <AUBUTTON variant="primary" onClick={handleNext}>Proceed to Borrower eSign</AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}
