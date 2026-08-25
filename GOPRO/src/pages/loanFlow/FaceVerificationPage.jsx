import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUPROGRESS, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function FaceVerificationPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [progress, setProgress] = useState(0);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'BORROWER-KYC-V1-FACE-VERIFICATION-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'FACE-VERIFICATION-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  useEffect(() => {
    // Simulate face verification process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 10;
        } else {
          clearInterval(interval);
          // Simulate success (80% success rate)
          const isSuccess = Math.random() > 0.2;
          setVerificationResult(isSuccess ? 'success' : 'failed');
          setVerificationComplete(true);
          return 100;
        }
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const handleNext = async () => {
    try {
      const payload = {
        eventType: 'FACE_VERIFICATION_SUBMITTED',
        formData: {
          verificationResultAsked:true  ,
        },
        workflowMetadata,
      };

      console.log('Submitting workflow event:', payload);

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Event submission failed with status ${response.status}`);
      }

      const result = await response.json();
      const workflowResult = result?.data ?? result;
      const nextRoute = resolveWorkflowRoute(workflowResult);
      navigate(nextRoute);
    } catch (error) {
      console.error('Workflow event submission error:', error);
      alert('Failed to submit workflow event. Please try again.');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Face Verification</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-KYC-V1-FACE-VERIFICATION-V1</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Performing liveness check and face matching with your documents...
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div>
          <p style={{ marginBottom: '10px', fontWeight: '500' }}>Verification Progress</p>
          <AUPROGRESS value={progress} />
          <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>{progress}%</p>
        </div>

        {verificationComplete && (
          <div style={{
            padding: '15px',
            borderRadius: '8px',
            backgroundColor: verificationResult === 'success' ? '#d4edda' : '#f8d7da',
            color: verificationResult === 'success' ? '#155724' : '#721c24',
            textAlign: 'center'
          }}>
            {verificationResult === 'success' ? (
              <>
                <p style={{ fontWeight: '500', marginBottom: '5px' }}>✓ Verification Successful</p>
                <p style={{ fontSize: '14px', margin: 0 }}>Match Score: 92% | Liveness: Passed</p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: '500', marginBottom: '5px' }}>✗ Verification Failed</p>
                <p style={{ fontSize: '14px', margin: 0 }}>Your case has been escalated to manager approval</p>
              </>
            )}
          </div>
        )}

        {verificationComplete && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <AUBUTTON variant="primary" onClick={handleNext}>
              {verificationResult === 'success' ? 'Proceed to PAN Verification' : 'Proceed to Manager Approval'}
            </AUBUTTON>
            <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/kyc-upload')}>
              Back
            </AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}
