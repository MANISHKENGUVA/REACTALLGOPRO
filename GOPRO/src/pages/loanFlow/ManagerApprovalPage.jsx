import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUCARD, AULISTGROUP } from 'artiqui/dist/router-engine.es.js';
import { useLoanContext } from '../../context/LoanContext';

export default function ManagerApprovalPage() {
  const navigate = useNavigate();
  const { loanApplicationData } = useLoanContext();
  const [approvalStatus, setApprovalStatus] = useState('pending');
  const [approvalDecision, setApprovalDecision] = useState(null);

  useEffect(() => {
    // Simulate manager approval (95% approval)
    const timer = setTimeout(() => {
      const isApproved = Math.random() > 0.05;
      setApprovalDecision(isApproved ? 'approved' : 'rejected');
      setApprovalStatus(isApproved ? 'approved' : 'rejected');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (approvalDecision === 'approved') {
      navigate('/loan-flow/disbursement');
    } else {
      navigate('/');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Manager Final Approval</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Final sanctioning by loan manager...
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
