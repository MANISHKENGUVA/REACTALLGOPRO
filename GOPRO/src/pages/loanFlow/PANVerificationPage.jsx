import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUPROGRESS, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { useLoanContext } from '../../context/LoanContext';

export default function PANVerificationPage() {
  const navigate = useNavigate();
  const { loanApplicationData, updateVerificationStatus } = useLoanContext();
  const [progress, setProgress] = useState(0);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 15;
        } else {
          clearInterval(interval);
          // Simulate verification (90% success for valid PAN)
          const isSuccess = true; // Assuming PAN is valid
          setVerificationResult(isSuccess ? 'success' : 'failed');
          setVerificationComplete(true);
          updateVerificationStatus({ panVerification: isSuccess });
          return 100;
        }
      });
    }, 300);

    return () => clearInterval(interval);
  }, [updateVerificationStatus]);

  const handleNext = () => {
    if (verificationResult === 'success') {
      navigate('/loan-flow/aadhar-verification');
    } else {
      navigate('/');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>PAN Verification</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-KYC-V1-PAN-VERIFICATION-V1</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Verifying your PAN with tax authorities...
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div>
          <p style={{ marginBottom: '10px', fontWeight: '500' }}>Verification Progress</p>
          <AUPROGRESS value={progress} />
          <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>{progress}%</p>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px', borderLeft: '4px solid #0066cc' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>PAN:</strong> {loanApplicationData.personalDetails.panNumber}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
            <strong>Name:</strong> {loanApplicationData.personalDetails.fullName}
          </p>
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
                <p style={{ fontWeight: '500', marginBottom: '5px' }}>✓ PAN Verified Successfully</p>
                <p style={{ fontSize: '14px', margin: 0 }}>Status: Active | No blacklist record</p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: '500', marginBottom: '5px' }}>✗ PAN Verification Failed</p>
                <p style={{ fontSize: '14px', margin: 0 }}>Your application has been rejected</p>
              </>
            )}
          </div>
        )}

        {verificationComplete && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <AUBUTTON variant="primary" onClick={handleNext}>
              {verificationResult === 'success' ? 'Proceed to Aadhaar Verification' : 'Back to Home'}
            </AUBUTTON>
            <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/face-verification')}>
              Back
            </AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}
