import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON, AUINPUT } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function CoborrowerBusinessInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    registrationNumber: '',
    annualRevenue: '',
    registrationExists: true,
    registrationVerified: true,
  });

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'COBORROWER-BUSINESS-V1-BUSINESS-INFO-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'COBORROWER-BUSINESS-INFO-V1',
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
        eventType: 'BUSINESS_INFO_SUBMITTED',
        formData: {
          registrationNumber: formData.registrationNumber,
          annualRevenue: Number(formData.annualRevenue),
          registrationExists: formData.registrationExists,
          registrationVerified: formData.registrationVerified,
        },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Business info submission failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/coborrower-bank-details');
    } catch (err) {
      console.error('Co-borrower business submit error:', err);
      navigate('/loan-flow/coborrower-bank-details');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Co-Borrower Business Information</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
        <AUINPUT type="text" label="GST / Business Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required />
        <AUINPUT type="number" label="Annual Turnover / Revenue (₹)" name="annualRevenue" value={formData.annualRevenue} onChange={handleChange} required />
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <AUBUTTON variant="primary" onClick={handleNext}>Next</AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate(-1)}>Back</AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
