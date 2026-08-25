import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';

export default function DocumentUploadPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);
  };

  const handleNext = () => {
    navigate('/loan-flow/credit-check');
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Additional Documents Upload</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-DOCUMENTS-V1-DOCUMENT-UPLOAD-V1</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Upload any additional supporting documents (ITR, Form-16, Property docs, etc.)
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ 
          border: '2px dashed #ccc', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
            Upload Additional Documents (Optional)
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,image/*"
            style={{ width: '100%' }}
          />
          {documents.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontWeight: '500', marginBottom: '10px', fontSize: '14px' }}>Uploaded Files:</p>
              {documents.map((file, idx) => (
                <p key={idx} style={{ color: 'green', fontSize: '14px', margin: '5px 0' }}>
                  ✓ {file.name}
                </p>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            <strong>Acceptable Documents:</strong> ITR, Form-16, Salary slips, Property docs, Previous loan statements
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <AUBUTTON variant="primary" onClick={handleNext}>
            Proceed to Credit Check
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/bank-statement-upload')}>
            Back
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
