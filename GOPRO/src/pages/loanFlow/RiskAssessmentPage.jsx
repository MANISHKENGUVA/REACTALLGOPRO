import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUPROGRESS, AUCARD } from 'artiqui/dist/router-engine.es.js';

export default function RiskAssessmentPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [riskLevel, setRiskLevel] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 11;
        } else {
          clearInterval(interval);
          // Risk levels: LOW (60%), MEDIUM (30%), HIGH (10%)
          const random = Math.random();
          let level = 'LOW';
          if (random < 0.1) level = 'HIGH';
          else if (random < 0.4) level = 'MEDIUM';
          
          setRiskLevel(level);
          setAssessmentComplete(true);
          return 100;
        }
      });
    }, 310);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (riskLevel === 'LOW') {
      navigate('/loan-flow/underwriter-review');
    } else if (riskLevel === 'MEDIUM') {
      navigate('/loan-flow/underwriter-review');
    } else {
      navigate('/loan-flow/manager-approval');
    }
  };

  const getRiskColor = (level) => {
    if (level === 'LOW') return { bg: '#d4edda', text: '#155724' };
    if (level === 'MEDIUM') return { bg: '#fff3cd', text: '#856404' };
    return { bg: '#f8d7da', text: '#721c24' };
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Risk Assessment</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-RISK-V1-RISK-ASSESSMENT-V1</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Performing overall risk scoring of your application...
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div>
          <p style={{ marginBottom: '10px', fontWeight: '500' }}>Risk Assessment Progress</p>
          <AUPROGRESS value={progress} />
          <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>{progress}%</p>
        </div>

        {assessmentComplete && (
          <>
            <div style={{
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: getRiskColor(riskLevel).bg,
              color: getRiskColor(riskLevel).text,
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
                {riskLevel} RISK
              </p>
              <p style={{ fontSize: '14px', margin: 0 }}>
                {riskLevel === 'LOW' ? 'Ready for Approval' : riskLevel === 'MEDIUM' ? 'Requires Review' : 'Requires Manager Approval'}
              </p>
            </div>

            <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
              <p style={{ fontWeight: '500', fontSize: '14px', marginBottom: '10px' }}>Risk Factors Analyzed:</p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                • Income Stability Score: {Math.floor(Math.random() * 40) + 60}%
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                • Credit History: Clean
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                • Debt-to-Income Ratio: {(Math.random() * 0.3).toFixed(2)}
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                • Employment Stability: {Math.floor(Math.random() * 10) + 2} years
              </p>
            </div>
          </>
        )}

        {assessmentComplete && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <AUBUTTON variant="primary" onClick={handleNext}>
              {riskLevel === 'HIGH' ? 'Proceed to Manager Approval' : 'Proceed to Underwriter Review'}
            </AUBUTTON>
            <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/cibil-check')}>
              Back
            </AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}
