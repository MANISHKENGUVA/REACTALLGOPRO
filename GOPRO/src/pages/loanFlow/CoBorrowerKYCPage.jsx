import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';

export default function CoBorrowerKYCPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null
  });

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList.length > 0) {
      setFiles(prev => ({ ...prev, [name]: fileList[0] }));
    }
  };

  const handleNext = () => {
    if (!files.aadhaarFront || !files.aadhaarBack || !files.panCard) {
      alert('Please upload all required documents');
      return;
    }
    navigate('/loan-flow/guarantor-kyc');
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Co-Borrower KYC Upload</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: COBORROWER-KYC-V1-KYC-UPLOAD-V1</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ 
          border: '2px dashed #ccc', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
            Aadhaar Card - Front Side *
          </label>
          <input
            type="file"
            name="aadhaarFront"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            style={{ width: '100%' }}
          />
          {files.aadhaarFront && (
            <p style={{ color: 'green', marginTop: '10px', fontSize: '14px' }}>
              ✓ {files.aadhaarFront.name}
            </p>
          )}
        </div>

        <div style={{ 
          border: '2px dashed #ccc', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
            Aadhaar Card - Back Side *
          </label>
          <input
            type="file"
            name="aadhaarBack"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            style={{ width: '100%' }}
          />
          {files.aadhaarBack && (
            <p style={{ color: 'green', marginTop: '10px', fontSize: '14px' }}>
              ✓ {files.aadhaarBack.name}
            </p>
          )}
        </div>

        <div style={{ 
          border: '2px dashed #ccc', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
            PAN Card - Front Side *
          </label>
          <input
            type="file"
            name="panCard"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            style={{ width: '100%' }}
          />
          {files.panCard && (
            <p style={{ color: 'green', marginTop: '10px', fontSize: '14px' }}>
              ✓ {files.panCard.name}
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
