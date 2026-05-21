import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUPROGRESS, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { useLoanContext } from '../../context/LoanContext';

export default function CibilCheckPage() {
  const navigate = useNavigate();
  const { updateVerificationStatus } = useLoanContext();
  const [progress, setProgress] = useState(0);
  const [checkComplete, setCheckComplete] = useState(false);
  const [cibilScore, setCibilScore] = useState(null);

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
          updateVerificationStatus({ cibilCheck: true });
          return 100;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, [updateVerificationStatus]);

  const handleNext = () => {
    navigate('/loan-flow/risk-assessment');
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>CIBIL Score Check</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: RISKENGINE-CIBIL-V1-CIBIL-CHECK-V1</p>
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
            <AUBUTTON variant="primary" onClick={handleNext}>
              Proceed to Risk Assessment
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
