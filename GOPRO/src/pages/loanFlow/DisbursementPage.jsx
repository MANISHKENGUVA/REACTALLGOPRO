import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUPROGRESS, AUCARD } from 'artiqui/dist/router-engine.es.js';

export default function DisbursementPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [disbursementComplete, setDisbursementComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 8;
        } else {
          clearInterval(interval);
          setDisbursementComplete(true);
          return 100;
        }
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <AUCARD className="loan-flow-card">
      <h2>Loan Disbursement</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: DISBURSEMENT-PAYMENT-V1-LOAN-DISBURSEMENT-V1</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Processing loan disbursement to your bank account...
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div>
          <p style={{ marginBottom: '10px', fontWeight: '500' }}>Disbursement Progress</p>
          <AUPROGRESS value={progress} />
          <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>{progress}%</p>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            ✓ Account verification complete
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            ✓ Microdeposit confirmed
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            ✓ Fund transfer initiated
          </p>
        </div>

        {disbursementComplete && (
          <>
            <div style={{
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: '#d4edda',
              color: '#155724',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
                ✓ LOAN DISBURSED
              </p>
              <p style={{ fontSize: '14px', margin: 0 }}>
                ₹5,00,000 has been transferred to your account
              </p>
            </div>

            <div style={{ 
              padding: '15px', 
              backgroundColor: '#fff9e6', 
              borderRadius: '8px', 
              borderLeft: '4px solid #ff9800'
            }}>
              <p style={{ fontWeight: '500', marginBottom: '10px', fontSize: '14px' }}>Next Steps:</p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                • You will receive an SMS with transaction confirmation
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                • Loan account details will be sent via email
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                • Your first EMI is due on {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toDateString()}
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                • Download your loan agreement from your account
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <AUBUTTON 
                variant="primary" 
                onClick={() => navigate('/')}
              >
                Go to Dashboard
              </AUBUTTON>
              <AUBUTTON 
                variant="outline" 
                onClick={() => navigate('/loan-flow/manager-approval')}
              >
                Back
              </AUBUTTON>
            </div>
          </>
        )}
      </div>
    </AUCARD>
  );
}
