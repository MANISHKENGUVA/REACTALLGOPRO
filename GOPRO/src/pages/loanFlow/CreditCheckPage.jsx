import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUPROGRESS, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function CreditCheckPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [checkComplete, setCheckComplete] = useState(false);
  const [creditScore, setCreditScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'BORROWER-CREDIT-V1-CREDIT-CHECK-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'CREDIT-CHECK-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 10;
        } else {
          clearInterval(interval);
          // Simulate credit score
          const score = Math.floor(Math.random() * (750 - 600 + 1)) + 600;
          setCreditScore(score);
          setCheckComplete(true);
          return 100;
        }
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const handleNext = async () => {
    setSubmitting(true);
    try {
      const payload = {
        eventType: 'CREDIT_CHECK_SUBMITTED',
        formData: {
          creditScore,
          checkComplete: true,
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
      // Fallback navigation if processor server is offline
      
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Credit Check</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Checking your credit history and score...
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div>
          <p style={{ marginBottom: '10px', fontWeight: '500' }}>Credit Check Progress</p>
          <AUPROGRESS value={progress} />
          <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>{progress}%</p>
        </div>

        {checkComplete && (
          <>
            <div style={{
              padding: '15px',
              borderRadius: '8px',
              backgroundColor: '#d4edda',
              color: '#155724',
              textAlign: 'center'
            }}>
              <p style={{ fontWeight: '500', marginBottom: '5px', fontSize: '20px' }}>
                Credit Score: {creditScore}
              </p>
              <p style={{ fontSize: '14px', margin: 0 }}>
                {creditScore >= 750 ? 'Excellent' : creditScore >= 700 ? 'Good' : 'Fair'}
              </p>
            </div>

            <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                ✓ No defaults in last 12 months
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                ✓ All EMIs cleared on time
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                ✓ No legal proceedings
              </p>
            </div>
          </>
        )}

        {checkComplete && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <AUBUTTON variant="primary" onClick={handleNext} disabled={submitting}>
              {submitting ? 'Processing...' : 'Proceed to Fraud Check'}
            </AUBUTTON>
            <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/document-upload')}>
              Back
            </AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}

