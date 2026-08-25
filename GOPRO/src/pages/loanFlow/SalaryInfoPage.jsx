import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUCARD } from 'artiqui/dist/router-engine.es.js';

export default function SalaryInfoPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    companyInfo: '',
    payslips: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, payslips: files }));
  };

  const handleNext = () => {
    if (!formData.monthlyIncome || formData.payslips.length === 0) {
      alert('Please provide monthly income and upload payslips');
      return;
    }

    const income = parseFloat(formData.monthlyIncome);

    if (income >= 50000) {
      navigate('/loan-flow/bank-details');
    } else {
      navigate('/loan-flow/bank-details'); // Can also offer co-borrower option
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Salary Information</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-SALARY-V1-SALARY-INFO-V1</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <AUINPUT
          type="number"
          label="Monthly Income (in ₹)"
          name="monthlyIncome"
          value={formData.monthlyIncome}
          onChange={handleChange}
          placeholder="Enter monthly income"
          required
        />

        <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>Minimum Income Required:</strong> ₹50,000/month
          </p>
        </div>

        <AUINPUT
          type="text"
          label="Company Information"
          name="companyInfo"
          value={formData.companyInfo}
          onChange={handleChange}
          placeholder="Enter company details"
        />

        <div style={{ 
          border: '2px dashed #ccc', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
            Upload Last 3 Months Payslips *
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,image/*"
            style={{ width: '100%' }}
          />
          {formData.payslips.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              {formData.payslips.map((file, idx) => (
                <p key={idx} style={{ color: 'green', fontSize: '14px', margin: '5px 0' }}>
                  ✓ {file.name}
                </p>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <AUBUTTON variant="primary" onClick={handleNext}>
            Next
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/employment-info')}>
            Back
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
