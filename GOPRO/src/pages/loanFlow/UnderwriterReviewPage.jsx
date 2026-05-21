import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUCARD, AULISTGROUP } from 'artiqui/dist/router-engine.es.js';
import { useLoanContext } from '../../context/LoanContext';

export default function UnderwriterReviewPage() {
  const navigate = useNavigate();
  const { loanApplicationData } = useLoanContext();
  const [reviewStatus, setReviewStatus] = useState('reviewing');
  const [reviewDecision, setReviewDecision] = useState(null);

  useEffect(() => {
    // Simulate underwriter review (90% approval)
    const timer = setTimeout(() => {
      const isApproved = Math.random() > 0.1;
      setReviewDecision(isApproved ? 'approved' : 'rejected');
      setReviewStatus(isApproved ? 'approved' : 'rejected');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (reviewDecision === 'approved') {
      navigate('/loan-flow/manager-approval');
    } else {
      navigate('/');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Underwriter Review</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: UNDERWRITER-REVIEW-V1-UNDERWRITER-CHECK-V1</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Manual review by underwriter team...
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {reviewStatus === 'reviewing' && (
          <div style={{
            padding: '30px',
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <div style={{ animation: 'spin 1s linear infinite', marginBottom: '15px', fontSize: '32px' }}>⏳</div>
            <p style={{ fontWeight: '500', marginBottom: '5px' }}>Review in Progress</p>
            <p style={{ fontSize: '14px', color: '#666' }}>Our underwriter is reviewing your application...</p>
          </div>
        )}

        {reviewStatus === 'approved' && (
          <>
            <div style={{
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: '#d4edda',
              color: '#155724',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0' }}>
                ✓ Approved by Underwriter
              </p>
            </div>

            <AULISTGROUP>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>Loan Amount Recommended</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                  ₹{loanApplicationData.personalDetails.loanPurpose ? '5,00,000' : '3,00,000'}
                </p>
              </div>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>Recommended Tenure</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                  60 months
                </p>
              </div>
              <div style={{ padding: '10px' }}>
                <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>Recommended Interest Rate</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                  8.5% - 9.5% p.a.
                </p>
              </div>
            </AULISTGROUP>
          </>
        )}

        {reviewStatus === 'rejected' && (
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
              Your application does not meet our current lending criteria.
            </p>
          </div>
        )}

        {(reviewStatus === 'approved' || reviewStatus === 'rejected') && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <AUBUTTON 
              variant="primary" 
              onClick={handleNext}
              disabled={reviewStatus === 'rejected'}
            >
              {reviewStatus === 'approved' ? 'Proceed to Manager Approval' : 'Back to Home'}
            </AUBUTTON>
            {reviewStatus === 'approved' && (
              <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/risk-assessment')}>
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
