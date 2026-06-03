import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUTEXTAREA, AUCARD } from 'artiqui/dist/router-engine.es.js';


export default function PersonalInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const metaData = location.state;
  console.log('Route Meta Data received in Node Page:', metaData);
  const [formData, setFormData] = useState({
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
    loanPurpose: ''
  });

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
      console.log('Form data submitted:', formData);
      const data = {
        
        currentStepEVENT:"PERSONAL_INFO_COMPLETED",
        metaData:{
          ...metaData,
          
        },
        data:{
          PERSONALDETAILS:{
            fullName:formData.fullName,
            fathersName:formData.fathersName,
            mothersName:formData.mothersName,
            dateOfBirth:formData.dateOfBirth,
            gender:formData.gender,
            maritalStatus:formData.maritalStatus,
            email:formData.email,
            mobileNumber:formData.mobileNumber,
            panNumber:formData.panNumber,
            aadhaarNumber:formData.aadhaarNumber,
            employmentType:formData.employmentType,
            monthlyIncome:formData.monthlyIncome,
            loanPurpose:formData.loanPurpose
          }
        }
       
      }


     

      const engineResponse = await fetch('http://localhost:5000/api/engine/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!engineResponse.ok) {
        throw new Error(`Engine request failed with status ${engineResponse.status}`);
      }

      const payLoad = await engineResponse.json();
      console.log('payLoad from backend', payLoad);
    } catch (error) {
      console.error('Failed to submit personal information:', error);
      alert('Unable to continue right now. Please try again.');
    }
  };

  const validateForm = () => {
    return formData.fullName && formData.email && formData.mobileNumber && 
           formData.panNumber && formData.dateOfBirth && formData.employmentType;
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Personal Information</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-DETAILS-V1-PERSONAL-INFO-V1</p>
     <pre>{JSON.stringify(metaData, null, 2)}</pre>
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

        <AUINPUT
          type="date"
          label="Date of Birth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
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
