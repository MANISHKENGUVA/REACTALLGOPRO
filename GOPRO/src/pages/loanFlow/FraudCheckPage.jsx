import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUPROGRESS, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { useLoanContext } from '../../context/LoanContext';

export default function FraudCheckPage() {
  const navigate = useNavigate();
  const { updateVerificationStatus } = useLoanContext();
  const [progress, setProgress] = useState(0);
  const [checkComplete, setCheckComplete] = useState(false);
  const [fraudResult, setFraudResult] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 12;
        } else {
          clearInterval(interval);
          setFraudResult('clean');
          setCheckComplete(true);
          updateVerificationStatus({ fraudCheck: true });
          return 100;
        }
      });
    }, 320);

    return () => clearInterval(interval);
  }, [updateVerificationStatus]);

  const handleNext = () => {
    navigate('/loan-flow/cibil-check');
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Fraud Detection Check</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: RISKENGINE-FRAUD-V1-FRAUD-CHECK-V1</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Performing fraud detection analysis...
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div>
          <p style={{ marginBottom: '10px', fontWeight: '500' }}>Fraud Check Progress</p>
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
              <p style={{ fontWeight: '500', marginBottom: '5px' }}>✓ No Fraud Detected</p>
              <p style={{ fontSize: '14px', margin: 0 }}>Application Status: Clean</p>
            </div>

            <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                ✓ Document authenticity verified
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                ✓ No duplicate applications found
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                ✓ Income verification passed
              </p>
            </div>
          </>
        )}

        {checkComplete && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <AUBUTTON variant="primary" onClick={handleNext}>
              Proceed to CIBIL Check
            </AUBUTTON>
            <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/credit-check')}>
              Back
            </AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}
