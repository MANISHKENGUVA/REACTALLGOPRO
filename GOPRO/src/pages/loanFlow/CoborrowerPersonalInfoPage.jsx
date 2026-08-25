import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function CoborrowerPersonalInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    fullName: '',
    relationship: 'spouse',
    email: '',
    mobileNumber: '',
    panNumber: '',
    dateOfBirth: '',
  });

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'COBORROWER-DETAILS-V1-PERSONAL-INFO-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'COBORROWER-PERSONAL-INFO-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (!formData.fullName || !formData.mobileNumber || !formData.panNumber) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        eventType: 'COBORROWER_PERSONAL_INFO_SUBMITTED',
        formData,
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Event submission failed with status ${response.status}`);
      }

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/coborrower-address-info');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      navigate('/loan-flow/coborrower-address-info');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Co-Borrower Personal Details</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Enter personal information of co-applicant.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <AUINPUT
          type="text"
          label="Co-Borrower Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter full name"
          required
        />

        <AUSELECT
          label="Relationship to Primary Applicant"
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
          options={[
            { label: 'Spouse', value: 'spouse' },
            { label: 'Parent', value: 'parent' },
            { label: 'Sibling', value: 'sibling' },
            { label: 'Business Partner', value: 'partner' }
          ]}
        />

        <AUINPUT
          type="email"
          label="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
        />

        <AUINPUT
          type="tel"
          label="Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          placeholder="Enter 10-digit mobile number"
          required
        />

        <AUINPUT
          type="text"
          label="PAN Number"
          name="panNumber"
          value={formData.panNumber}
          onChange={handleChange}
          placeholder="Enter PAN number"
          required
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <AUBUTTON variant="primary" onClick={handleNext}>
            Proceed to Co-Borrower Address
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate(-1)}>
            Back
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
