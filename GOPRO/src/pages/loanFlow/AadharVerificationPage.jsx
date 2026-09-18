import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUPROGRESS, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function AadharVerificationPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'BORROWER-KYC-V1-AADHAR-VERIFICATION-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'AADHAR-VERIFICATION-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 12;
        } else {
          clearInterval(interval);
          const isSuccess = true;
          setVerificationResult(isSuccess ? 'success' : 'failed');
          setVerificationComplete(true);
          return 100;
        }
      });
    }, 350);

    return () => clearInterval(interval);
  }, []);

  const handleNext = async () => {
    if (verificationResult !== 'success') {
      navigate('/');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        eventType: 'AADHAR_VERIFICATION_COMPLETED',
        formData: {
          aadharStatus: 'VERIFIED',
          mobileLinked: true,
          verificationResult,
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

      navigate(nextRoute || '/loan-flow/employment-info');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      alert('Failed to submit workflow event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusClass = verificationResult === 'success'
    ? 'aadhar-verification-page__status-message--success'
    : 'aadhar-verification-page__status-message--error';

  return (
    <AUCARD className="aadhar-verification-page">
      <h2>Aadhaar Verification</h2>
      <p className="aadhar-verification-page__meta">State: {workflowMetadata.componentViewRenderState}</p>
      <p className="aadhar-verification-page__meta--secondary">
        Verifying your Aadhaar and mobile linkage with UIDAI...
      </p>

      <div className="aadhar-verification-page__content">
        <div>
          <p className="aadhar-verification-page__header">Verification Progress</p>
          <AUPROGRESS value={progress} />
          <p className="aadhar-verification-page__progress-text">{progress}%</p>
        </div>

        <div className="aadhar-verification-page__detail-panel">
          <p>✓ Aadhaar Validity Check: In Progress</p>
          <p>✓ Mobile Linkage Check: In Progress</p>
        </div>

        {verificationComplete && (
          <div className={`aadhar-verification-page__status-message ${statusClass}`}>
            {verificationResult === 'success' ? (
              <>
                <p className="aadhar-verification-page__status-title">✓ Aadhaar Verified Successfully</p>
                <p className="aadhar-verification-page__status-text">Aadhaar Valid | Mobile Linked</p>
              </>
            ) : (
              <>
                <p className="aadhar-verification-page__status-title">✗ Aadhaar Verification Failed</p>
                <p className="aadhar-verification-page__status-text">Your application has been rejected</p>
              </>
            )}
          </div>
        )}

        {verificationComplete && (
          <div className="aadhar-verification-page__actions">
            <AUBUTTON variant="primary" onClick={handleNext} disabled={submitting}>
              {submitting ? 'Submitting...' : (verificationResult === 'success' ? 'Proceed to Employment Info' : 'Back to Home')}
            </AUBUTTON>
            <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/pan-verification')}>
              Back
            </AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}
