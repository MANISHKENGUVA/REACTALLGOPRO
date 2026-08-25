import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCARD, AULISTGROUP } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function ManagerApprovalPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [approvalStatus, setApprovalStatus] = useState('pending');
  const [approvalDecision, setApprovalDecision] = useState(null);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'FINAL-APPROVAL-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  useEffect(() => {
    // Simulate manager approval (95% approval)
    const timer = setTimeout(() => {
      const isApproved = Math.random() > 0.05;
      setApprovalDecision(isApproved ? 'approved' : 'rejected');
      setApprovalStatus(isApproved ? 'approved' : 'rejected');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    if (approvalDecision !== 'approved') {
      navigate('/');
      return;
    }

    try {
      const payload = {
        eventType: 'MANAGER_APPROVAL_SUBMITTED',
        formData: {
          approvalStatus,
          approvalDecision,
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

      navigate(nextRoute || '/loan-flow/disbursement');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      alert('Failed to submit workflow event. Please try again.');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Manager Final Approval</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Metadata: {workflowMetadata.workflowId} | {workflowMetadata.workflowActor} | {workflowMetadata.componentKey}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {approvalStatus === 'pending' && (
          <div style={{
            padding: '30px',
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <div style={{ animation: 'spin 1s linear infinite', marginBottom: '15px', fontSize: '32px' }}>⏳</div>
            <p style={{ fontWeight: '500', marginBottom: '5px' }}>Awaiting Manager Approval</p>
            <p style={{ fontSize: '14px', color: '#666' }}>Your application is with the sanctioning manager...</p>
          </div>
        )}

        {approvalStatus === 'approved' && (
          <>
            <div style={{
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: '#d4edda',
              color: '#155724',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0' }}>
                ✓ LOAN APPROVED
              </p>
              <p style={{ fontSize: '14px', margin: 0 }}>Congratulations! Your loan has been sanctioned.</p>
            </div>

            <AULISTGROUP>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>Loan Amount</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '16px', color: '#2e7d32', fontWeight: '500' }}>
                  ₹5,00,000
                </p>
              </div>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>Interest Rate</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                  9.2% p.a.
                </p>
              </div>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>Tenure</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                  60 months
                </p>
              </div>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>Monthly EMI</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '16px', color: '#2e7d32', fontWeight: '500' }}>
                  ₹10,145
                </p>
              </div>
              <div style={{ padding: '10px' }}>
                <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>Total Amount Payable</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                  ₹6,08,700
                </p>
              </div>
            </AULISTGROUP>
          </>
        )}

        {approvalStatus === 'rejected' && (
          <div style={{
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0' }}>
              ✗ Application Rejected
            </p>
            <p style={{ fontSize: '14px', margin: 0 }}>
              Unfortunately, your application could not be sanctioned at this time.
            </p>
          </div>
        )}

        {(approvalStatus === 'approved' || approvalStatus === 'rejected') && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <AUBUTTON 
              variant="primary" 
              onClick={handleNext}
              disabled={approvalStatus === 'rejected'}
            >
              {approvalStatus === 'approved' ? 'Proceed to Disbursement' : 'Back to Home'}
            </AUBUTTON>
            {approvalStatus === 'approved' && (
              <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/underwriter-review')}>
                Back
              </AUBUTTON>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AUCARD>
  );
}
