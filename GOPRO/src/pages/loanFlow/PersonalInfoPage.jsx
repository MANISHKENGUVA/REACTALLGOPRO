import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUTEXTAREA, AUCARD ,AUDATEPICKER } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function PersonalInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const loanApplicationData = {
    personalDetails: {
      fullName: '',
      fathersName: '',
      mothersName: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      email: '',
      mobileNumber: '',
      panNumber: '',
      aadhaarNumber: '',
      employmentType: '',
      monthlyIncome: '',
      loanPurpose: '',
    },
  };
  const [formData, setFormData] = useState(loanApplicationData.personalDetails);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'BORROWER-DETAILS-V1-PERSONAL-INFO-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'PERSONAL-INFO-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (!validateForm()) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        eventType: 'PERSONAL_INFO_SUBMITTED',
        formData,
        workflowMetadata,
      };

      console.log('Submitting workflow event:', payload);

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Event submission failed with status ${response.status}`);
      }

      const result = await response.json();
      const workflowResult = result?.data ?? result;
      const nextRoute = resolveWorkflowRoute(workflowResult);

      navigate(nextRoute);
    } catch (error) {
      console.error('Workflow event submission error:', error);
      alert('Failed to submit workflow event. Please try again.');
    }
  };

  const validateForm = () => {
    return formData.fullName && formData.email && formData.mobileNumber && 
           formData.panNumber && formData.dateOfBirth && formData.employmentType;
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Personal Information</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Metadata: {workflowMetadata.workflowId} | {workflowMetadata.workflowActor} | {workflowMetadata.componentKey}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <AUINPUT
          type="text"
          label="Full Name (as per PAN)"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />

        <AUINPUT
          type="text"
          label="Father's Name"
          name="fathersName"
          value={formData.fathersName}
          onChange={handleChange}
          placeholder="Enter father's name"
        />

        <AUINPUT
          type="text"
          label="Mother's Name"
          name="mothersName"
          value={formData.mothersName}
          onChange={handleChange}
          placeholder="Enter mother's name"
        />

        <AUDATEPICKER
          label="Date of Birth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          placeholder="Select date of birth"
          disableFuture={true}
        />


        <AUSELECT
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={[
            { label: 'Select Gender', value: '' },
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' }
          ]}
        />

        <AUSELECT
          label="Marital Status"
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleChange}
          options={[
            { label: 'Select Status', value: '' },
            { label: 'Single', value: 'single' },
            { label: 'Married', value: 'married' },
            { label: 'Divorced', value: 'divorced' },
            { label: 'Widowed', value: 'widowed' }
          ]}
        />

        <AUINPUT
          type="email"
          label="Email ID"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <AUINPUT
          type="tel"
          label="Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          placeholder="Enter mobile number"
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

        <AUINPUT
          type="text"
          label="Aadhaar Number"
          name="aadhaarNumber"
          value={formData.aadhaarNumber}
          onChange={handleChange}
          placeholder="Enter Aadhaar number"
        />

        <AUSELECT
          label="Employment Type"
          name="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          options={[
            { label: 'Select Employment Type', value: '' },
            { label: 'Salaried', value: 'salaried' },
            { label: 'Business Owner', value: 'business' },
            { label: 'Others', value: 'others' }
          ]}
          required
        />

        <AUINPUT
          type="number"
          label="Approximate Monthly Income"
          name="monthlyIncome"
          value={formData.monthlyIncome}
          onChange={handleChange}
          placeholder="Enter monthly income"
        />

        <AUTEXTAREA
          label="Loan Purpose"
          name="loanPurpose"
          value={formData.loanPurpose}
          onChange={handleChange}
          placeholder="Describe the purpose of the loan"
          rows="4"
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <AUBUTTON variant="primary" onClick={handleNext}>
            Next
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate('/')}>
            Cancel
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
