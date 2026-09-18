import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function EmploymentInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    designation: '',
    yearsOfExperience: '',
    employmentType: 'salaried',
  });

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'BORROWER-EMPLOYMENT-V1-EMPLOYMENT-INFO-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'EMPLOYMENT-INFO-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const employmentType = formData.employmentType || 'salaried';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    setSubmitting(true);
    try {
      const payload = {
        eventType: 'EMPLOYMENT_INFO_SUBMITTED',
        formData: {
          ...formData,
          isActive: true,
        },
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

      const fallbackRoute = employmentType === 'salaried' ? '/loan-flow/salary-info' : '/loan-flow/business-info';
      navigate(nextRoute || fallbackRoute);
    } catch (error) {
      console.error('Workflow event submission error:', error);
      alert('Failed to submit workflow event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (employmentType === 'salaried') {
    return (
      <AUCARD className="loan-flow-card">
        <h2>Employment Information</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>State: {workflowMetadata.componentViewRenderState}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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

          <AUINPUT
            type="text"
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />

          <AUINPUT
            type="text"
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Enter your designation"
            required
          />

          <AUINPUT
            type="number"
            label="Years of Experience"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            placeholder="Enter years of experience"
            required
          />

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <AUBUTTON variant="primary" onClick={handleNext} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Next'}
            </AUBUTTON>
            <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/aadhar-verification')}>
              Back
            </AUBUTTON>
          </div>
        </div>
      </AUCARD>
    );
  }

  if (employmentType === 'business') {
    return (
      <AUCARD className="loan-flow-card">
        <h2>Employment Information</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>State: {workflowMetadata.componentViewRenderState}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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

          <div style={{ padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px', marginBottom: '10px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              You selected Business Owner as employment type. Fill in your business details.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <AUBUTTON variant="primary" onClick={handleNext} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Proceed to Business Details'}
            </AUBUTTON>
            <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/aadhar-verification')}>
              Back
            </AUBUTTON>
          </div>
        </div>
      </AUCARD>
    );
  }

  return (
    <AUCARD className="loan-flow-card">
      <h2>Employment Information</h2>
      <p style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '12px', borderRadius: '4px' }}>
        Your selected employment type is not eligible for this loan. Please contact support.
      </p>
    </AUCARD>
  );
}
