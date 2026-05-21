import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUPROGRESS, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { useLoanContext } from '../../context/LoanContext';

export default function CreditCheckPage() {
  const navigate = useNavigate();
  const { updateVerificationStatus } = useLoanContext();
  const [progress, setProgress] = useState(0);
  const [checkComplete, setCheckComplete] = useState(false);
  const [creditScore, setCreditScore] = useState(null);

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
          updateVerificationStatus({ creditCheck: true });
          return 100;
        }
      });
    }, 300);

    return () => clearInterval(interval);
  }, [updateVerificationStatus]);

  const handleNext = () => {
    navigate('/loan-flow/fraud-check');
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Credit Check</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-CREDIT-V1-CREDIT-CHECK-V1</p>
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
            <AUBUTTON variant="primary" onClick={handleNext}>
              Proceed to Fraud Check
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
