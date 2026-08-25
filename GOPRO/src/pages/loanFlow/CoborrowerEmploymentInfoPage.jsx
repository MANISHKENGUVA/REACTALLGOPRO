import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON, AUINPUT, AUSELECT } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function CoborrowerEmploymentInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    companyName: '',
    designation: '',
    workingSince: '',
    isActive: true,
    employmentType: 'salaried',
  });

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'COBORROWER-EMPLOYMENT-V1-EMPLOYMENT-INFO-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'COBORROWER-EMPLOYMENT-INFO-V1',
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
        eventType: 'EMPLOYMENT_INFO_SUBMITTED',
        formData,
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Employment submission failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      const fallback = formData.employmentType === 'business' ? '/loan-flow/coborrower-business-info' : '/loan-flow/coborrower-salary-info';
      navigate(nextRoute || fallback);
    } catch (err) {
      console.error('Co-borrower employment submit error:', err);
      const fallback = formData.employmentType === 'business' ? '/loan-flow/coborrower-business-info' : '/loan-flow/coborrower-salary-info';
      navigate(fallback);
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Co-Borrower Employment Details</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
        <AUSELECT
          label="Employment Type"
          name="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          options={[
            { label: 'Salaried', value: 'salaried' },
            { label: 'Business Owner / Self Employed', value: 'business' }
          ]}
        />
        <AUINPUT type="text" label="Company / Employer Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
        <AUINPUT type="text" label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <AUBUTTON variant="primary" onClick={handleNext}>Next</AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate(-1)}>Back</AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
