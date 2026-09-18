import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function BankStatementUploadPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [statements, setStatements] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'BORROWER-BANK-V1-BANK-STATEMENT-UPLOAD-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'BANK-STATEMENT-UPLOAD-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setStatements(files);
  };

  const handleNext = async () => {
    if (statements.length === 0) {
      alert('Please upload at least one bank statement');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        eventType: 'BANK_STATEMENT_UPLOADED',
        formData: {
          uploaded: true,
          statementValid: true,
          statementCount: statements.length,
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

      navigate(nextRoute || '/loan-flow/document-upload');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      alert('Failed to submit workflow event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Bank Statement Upload</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>State: {workflowMetadata.componentViewRenderState}</p>
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
          <AUBUTTON variant="primary" onClick={handleNext} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Next'}
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/bank-details')}>
            Back
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
