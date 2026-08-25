import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON, AUINPUT } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function CoborrowerBankDetailsPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
  });

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'COBORROWER-BANK-V1-BANK-DETAILS-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'COBORROWER-BANK-DETAILS-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    try {
      const payload = {
        eventType: 'BANK_DETAILS_SUBMITTED',
        formData: {
          'BANK.accountNumber.valid': true,
          'BANK.ifsc.valid': true,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName,
        },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Bank details submission failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      // Merges back to Borrower Credit Check page
      navigate(nextRoute || '/loan-flow/borrower-credit-check');
    } catch (err) {
      console.error('Co-borrower bank details submit error:', err);
      navigate('/loan-flow/borrower-credit-check');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Co-Borrower Bank Details</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
        <AUINPUT type="text" label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} required />
        <AUINPUT type="text" label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
        <AUINPUT type="text" label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} required />
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <AUBUTTON variant="primary" onClick={handleNext}>Submit Co-Borrower Bank Details</AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate(-1)}>Back</AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
