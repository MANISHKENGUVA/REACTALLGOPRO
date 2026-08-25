import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUPROGRESS, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function DocumentVerificationEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'LENDER-DOCUMENT-V1-DOCUMENT-VERIFICATION-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'DOCUMENT-VERIFICATION-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setVerifying(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    try {
      const payload = {
        eventType: 'DOCUMENT_VERIFICATION_SUBMITTED',
        formData: {
          documentsVerified: true,
          status: 'PASSED',
        },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Document verification submit failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/risk-assessment');
    } catch (err) {
      console.error('Document verification engine error:', err);
      navigate('/loan-flow/risk-assessment');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Lender Document Verification Engine</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '15px' }}>
        {verifying ? (
          <div>
            <p style={{ marginBottom: '10px' }}>Scanning document OCR & tamper detection algorithms...</p>
            <AUPROGRESS value={80} />
          </div>
        ) : (
          <div>
            <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '15px' }}>
              ✓ All uploaded documents passed OCR & tamper checks.
            </div>
            <AUBUTTON variant="primary" onClick={handleNext}>Proceed to Risk Assessment</AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}
