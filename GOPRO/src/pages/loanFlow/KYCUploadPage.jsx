import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { useLoanContext } from '../../context/LoanContext';

export default function KYCUploadPage() {
  const navigate = useNavigate();
  const { updateKYCDocuments } = useLoanContext();
  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null
  });
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList.length > 0) {
      setFiles(prev => ({ ...prev, [name]: fileList[0] }));
    }
  };

  const handleNext = async () => {
    if (!files.aadhaarFront || !files.aadhaarBack || !files.panCard) {
      alert('Please upload all required documents');
      return;
    }

    setUploading(true);
    try {
      // Simulate document upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateKYCDocuments(files);
      navigate('/loan-flow/face-verification');
    } catch (error) {
      alert('Error uploading documents: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>KYC Document Upload</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-KYC-V1-KYC-UPLOAD-V1</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Upload clear, colored scans of your identity documents. Max file size: 5MB each.
      </p>

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
          <AUBUTTON 
            variant="primary" 
            onClick={handleNext}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Next'}
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/address-info')}>
            Back
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
