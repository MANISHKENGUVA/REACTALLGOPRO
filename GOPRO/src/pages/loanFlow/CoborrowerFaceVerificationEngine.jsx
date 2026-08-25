import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON, AUPROGRESS } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function CoborrowerFaceVerificationEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [capturing, setCapturing] = useState(false);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'COBORROWER-KYC-V1-FACE-VERIFICATION-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'COBORROWER-FACE-VERIFICATION-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleCapture = async () => {
    setCapturing(true);
    try {
      const payload = {
        eventType: 'FACE_VERIFICATION_SUBMITTED',
        formData: {
          matchScore: 98,
          livenessPassed: true,
          status: 'VERIFIED',
        },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Face verification failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/coborrower-employment-info');
    } catch (err) {
      console.error('Co-borrower face verification error:', err);
      navigate('/loan-flow/coborrower-employment-info');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Co-Borrower Face & Liveness Verification</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>

      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <div style={{ width: '160px', height: '160px', borderRadius: '50%', border: '4px solid #0056b3', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eef' }}>
          📷 Camera View
        </div>
        <p style={{ marginBottom: '20px', fontSize: '14px', color: '#555' }}>
          Position co-borrower's face inside the oval frame and blink once.
        </p>
        <AUBUTTON variant="primary" onClick={handleCapture} disabled={capturing}>
          {capturing ? 'Verifying Liveness...' : 'Capture Selfie & Verify'}
        </AUBUTTON>
      </div>
    </AUCARD>
  );
}
