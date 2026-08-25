import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUCARD } from 'artiqui/dist/router-engine.es.js';

export default function BankDetailsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
  });
  const [cancelledCheque, setCancelledCheque] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setCancelledCheque(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (!formData.accountNumber || !formData.ifscCode || !formData.bankName || !cancelledCheque) {
      alert('Please fill all required fields');
      return;
    }

    navigate('/loan-flow/bank-statement-upload');
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Bank Details</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-BANK-V1-BANK-DETAILS-V1</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Provide your bank account details for loan disbursement and repayment.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <AUINPUT
          type="text"
          label="Account Number"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="Enter account number"
          required
        />

        <AUINPUT
          type="text"
          label="IFSC Code"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleChange}
          placeholder="Enter IFSC code (e.g., SBIN0001234)"
          required
        />

        <AUINPUT
          type="text"
          label="Bank Name"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          placeholder="Enter bank name"
          required
        />

        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            <strong>Note:</strong> Account will be verified via OTP and micro-deposits
          </p>
        </div>

        <div style={{ 
          border: '2px dashed #ccc', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
            Upload Cancelled Cheque / Bank Statement *
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,.pdf"
            style={{ width: '100%' }}
          />
          {cancelledCheque && (
            <p style={{ color: 'green', marginTop: '10px', fontSize: '14px' }}>
              ✓ {cancelledCheque.name}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <AUBUTTON variant="primary" onClick={handleNext}>
            Next
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate(-1)}>
            Back
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
