import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';

export default function BankStatementUploadPage() {
  const navigate = useNavigate();
  const [statements, setStatements] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setStatements(files);
  };

  const handleNext = () => {
    if (statements.length === 0) {
      alert('Please upload at least one bank statement');
      return;
    }

    navigate('/loan-flow/document-upload');
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Bank Statement Upload</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: BORROWER-BANK-V1-BANK-STATEMENT-UPLOAD-V1</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Upload last 6 months bank statements for income analysis.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ 
          border: '2px dashed #ccc', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
            Upload Bank Statements (Last 6 Months) *
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,image/*"
            style={{ width: '100%' }}
          />
          {statements.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontWeight: '500', marginBottom: '10px', fontSize: '14px' }}>Uploaded Files:</p>
              {statements.map((file, idx) => (
                <p key={idx} style={{ color: 'green', fontSize: '14px', margin: '5px 0' }}>
                  ✓ {file.name}
                </p>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            <strong>We analyze:</strong> Average balance, income patterns, expenses, and transaction history
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <AUBUTTON variant="primary" onClick={handleNext}>
            Next
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/bank-details')}>
            Back
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
