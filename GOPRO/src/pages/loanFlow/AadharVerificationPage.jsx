import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUPROGRESS, AUCARD } from 'artiqui/dist/router-engine.es.js';

export default function AadharVerificationPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

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

  const handleNext = () => {
    if (verificationResult === 'success') {
      navigate('/loan-flow/employment-info');
    } else {
      navigate('/');
    }
  };

  const statusClass = verificationResult === 'success'
    ? 'aadhar-verification-page__status-message--success'
    : 'aadhar-verification-page__status-message--error';

  return (
    <AUCARD className="aadhar-verification-page">
      <h2>Aadhaar Verification</h2>
      <p className="aadhar-verification-page__meta">State: BORROWER-KYC-V1-AADHAR-VERIFICATION-V1</p>
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
            <AUBUTTON variant="primary" onClick={handleNext}>
              {verificationResult === 'success' ? 'Proceed to Employment Info' : 'Back to Home'}
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
