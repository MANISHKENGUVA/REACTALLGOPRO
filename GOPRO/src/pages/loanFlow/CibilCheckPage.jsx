import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUPROGRESS, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function CibilCheckPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [checkComplete, setCheckComplete] = useState(false);
  const [cibilScore, setCibilScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'RISKENGINE-CIBIL-V1-CIBIL-CHECK-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'CIBIL-CHECK-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 14;
        } else {
          clearInterval(interval);
          const score = Math.floor(Math.random() * (900 - 600 + 1)) + 600;
          setCibilScore(score);
          setCheckComplete(true);
          return 100;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  const handleNext = async () => {
    setSubmitting(true);
    try {
      const payload = {
        eventType: 'CIBIL_CHECK_SUBMITTED',
        formData: {
          cibilScore,
          verified: true,
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

      navigate(nextRoute || '/loan-flow/risk-assessment');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      alert('Failed to submit workflow event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>CIBIL Score Check</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Fetching and analyzing CIBIL score...
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div>
          <p style={{ marginBottom: '10px', fontWeight: '500' }}>CIBIL Check Progress</p>
          <AUPROGRESS value={progress} />
          <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>{progress}%</p>
        </div>

        {checkComplete && (
          <>
            <div style={{
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: '#d4edda',
              color: '#155724',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
                {cibilScore}
              </p>
              <p style={{ fontSize: '14px', margin: 0 }}>
                {cibilScore >= 750 ? 'Excellent CIBIL Score' : cibilScore >= 700 ? 'Good CIBIL Score' : 'Average CIBIL Score'}
              </p>
            </div>

            <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                ✓ Credit Account Details: Verified
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                ✓ Inquiry History: Clean
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                ✓ Payment Behavior: Good
              </p>
            </div>
          </>
        )}

        {checkComplete && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <AUBUTTON variant="primary" onClick={handleNext} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Proceed to Risk Assessment'}
            </AUBUTTON>
            <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/fraud-check')}>
              Back
            </AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}
