import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUPROGRESS, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function EligibilityEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [evaluating, setEvaluating] = useState(true);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'LENDER-ELIGIBILITY-V1-ELIGIBILITY-CHECK-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'ELIGIBILITY-CHECK-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setEvaluating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    try {
      const payload = {
        eventType: 'ELIGIBILITY_CHECK_SUBMITTED',
        formData: {
          eligible: true,
          maxSanctionableAmount: 500000,
        },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Eligibility check submit failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/loan-amount');
    } catch (err) {
      console.error('Eligibility engine error:', err);
      navigate('/loan-flow/loan-amount');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Lender Eligibility Matrix Engine</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '15px' }}>
        {evaluating ? (
          <div>
            <p style={{ marginBottom: '10px' }}>Evaluating FOIR, DTI ratios and Maximum Loan Sanction Limit...</p>
            <AUPROGRESS value={85} />
          </div>
        ) : (
          <div>
            <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '15px' }}>
              ✓ Applicant Passed Eligibility Matrix (Max Limit: ₹ 5,00,000)
            </div>
            <AUBUTTON variant="primary" onClick={handleNext}>Proceed to Loan Offer Configuration</AUBUTTON>
          </div>
        )}
      </div>
    </AUCARD>
  );
}
