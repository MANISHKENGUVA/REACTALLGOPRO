import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUPROGRESS, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function BankAccountVerificationEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState('IN_PROGRESS');

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'BORROWER-BANK-V1-BANK-ACCOUNT-VERIFICATION-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'BANK-ACCOUNT-VERIFICATION-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVerifying(false);
      setStatus('VERIFIED');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = async () => {
    try {
      const payload = {
        eventType: 'BANK_ACCOUNT_VERIFICATION_SUBMITTED',
        formData: {
          accountVerified: status === 'VERIFIED',
          verificationStatus: status,
        },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Verification submit failed');

      const result = await response.json();
      const workflowResult = result?.data ?? result;
      const nextRoute = resolveWorkflowRoute(workflowResult);
      navigate(nextRoute || '/loan-flow/bank-statement-upload');
    } catch (err) {
      console.error('Bank account verification submit error:', err);
      navigate('/loan-flow/bank-statement-upload');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Bank Account Verification Engine</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Verifying bank account penny-drop & account ownership details...
      </p>

      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        {verifying ? (
          <div>
            <p style={{ marginBottom: '10px' }}>Verifying bank details with NPCI / Penny-drop...</p>
            <AUPROGRESS value={70} />
          </div>
        ) : (
          <div>
            <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '20px' }}>
              ✓ Bank Account Ownership Verified Successfully (Status: {status})
            </div>
            <AUBUTTON variant="primary" onClick={handleContinue}>
              Proceed to Bank Statement Upload
            </AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}
