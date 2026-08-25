import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function ESignPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'LENDER-AGREEMENT-V1-ESIGN-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'ESIGN-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleSendOtp = () => {
    setOtpSent(true);
    alert('OTP sent to registered mobile number for E-Sign verification.');
  };

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      alert('Please enter valid 4-digit E-Sign OTP');
      return;
    }

    try {
      const payload = {
        eventType: 'ESIGN_COMPLETED',
        formData: { otp },
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
      navigate(nextRoute || '/loan-flow/bank-details');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      navigate('/loan-flow/bank-details');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Aadhaar E-Sign Verification</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Sign agreement digitally via Aadhaar OTP authentication.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px', borderLeft: '4px solid #0066cc' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Agreement document package generated. Click below to request Aadhaar OTP.
          </p>
        </div>

        {!otpSent ? (
          <AUBUTTON variant="primary" onClick={handleSendOtp}>
            Request Aadhaar E-Sign OTP
          </AUBUTTON>
        ) : (
          <>
            <AUINPUT
              type="text"
              label="Enter 4-Digit OTP"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
            <AUBUTTON variant="primary" onClick={handleVerify}>
              Verify & Complete E-Sign
            </AUBUTTON>
          </>
        )}
      </div>
    </AUCARD>
  );
}
