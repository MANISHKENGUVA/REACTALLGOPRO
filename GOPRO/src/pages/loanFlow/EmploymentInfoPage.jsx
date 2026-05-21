import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { useLoanContext } from '../../context/LoanContext';

export default function EmploymentInfoPage() {
  const navigate = useNavigate();
  const { loanApplicationData, updateEmploymentDetails } = useLoanContext();
  const [formData, setFormData] = useState(loanApplicationData.employmentDetails);

  const employmentType = loanApplicationData.personalDetails.employmentType;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (employmentType === 'salaried') {
      updateEmploymentDetails(formData);
      navigate('/loan-flow/salary-info');
    } else if (employmentType === 'business') {
      updateEmploymentDetails(formData);
      navigate('/loan-flow/business-info');
    } else {
      alert('Employment type not supported');
    }
  };

  if (employmentType === 'salaried') {
    return (
      <AUCARD className="loan-flow-card">
        <h2>Employment Information</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-EMPLOYMENT-V1-EMPLOYMENT-INFO-V1</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
            <AUBUTTON variant="primary" onClick={handleNext}>
              Next
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
        <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-EMPLOYMENT-V1-EMPLOYMENT-INFO-V1</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px', marginBottom: '10px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              You selected Business Owner as employment type. Fill in your business details.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <AUBUTTON variant="primary" onClick={() => navigate('/loan-flow/business-info')}>
              Proceed to Business Details
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
