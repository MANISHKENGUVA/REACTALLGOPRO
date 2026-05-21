import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { useLoanContext } from '../../context/LoanContext';

export default function BusinessInfoPage() {
  const navigate = useNavigate();
  const { loanApplicationData, updateBusinessDetails } = useLoanContext();
  const [formData, setFormData] = useState(loanApplicationData.businessDetails);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, itrDocuments: files }));
  };

  const handleNext = () => {
    if (!formData.businessName || !formData.annualRevenue) {
      alert('Please fill all required fields');
      return;
    }

    const revenue = parseFloat(formData.annualRevenue);
    if (revenue < 500000) {
      alert('Minimum annual revenue required is ₹5 Lakhs');
      return;
    }

    updateBusinessDetails(formData);
    navigate('/loan-flow/bank-details');
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Business Information</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-BUSINESS-V1-BUSINESS-INFO-V1</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <AUINPUT
          type="text"
          label="Business Name"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          placeholder="Enter business name"
          required
        />

        <AUINPUT
          type="number"
          label="Annual Revenue (in ₹)"
          name="annualRevenue"
          value={formData.annualRevenue}
          onChange={handleChange}
          placeholder="Enter annual revenue"
          required
        />

        <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>Minimum Revenue Required:</strong> ₹5 Lakhs/annum
          </p>
        </div>

        <AUINPUT
          type="text"
          label="GST Number"
          name="gstNumber"
          value={formData.gstNumber}
          onChange={handleChange}
          placeholder="Enter GST number (optional)"
        />

        <div style={{ 
          border: '2px dashed #ccc', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
            Upload Last 2 Years ITR Documents *
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,image/*"
            style={{ width: '100%' }}
          />
          {formData.itrDocuments.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              {formData.itrDocuments.map((file, idx) => (
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
