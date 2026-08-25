import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function CoborrowerKYCUploadPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'COBORROWER-KYC-V1-KYC-UPLOAD-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'COBORROWER-KYC-UPLOAD-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleNext = async () => {
    try {
      const payload = {
        eventType: 'KYC_UPLOAD_SUBMITTED',
        formData: {
          aadharUploaded: true,
          panUploaded: true,
        },
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('KYC submission failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/coborrower-face-verification');
    } catch (err) {
      console.error('Co-borrower KYC upload submit error:', err);
      navigate('/loan-flow/coborrower-face-verification');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Co-Borrower KYC Upload</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
        Upload Co-Borrower Aadhaar and PAN documents.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ padding: '15px', border: '1px dashed #ccc', borderRadius: '8px' }}>
          <label style={{ fontWeight: '500', display: 'block', marginBottom: '8px' }}>Aadhaar Card Upload *</label>
          <input type="file" />
        </div>
        <div style={{ padding: '15px', border: '1px dashed #ccc', borderRadius: '8px' }}>
          <label style={{ fontWeight: '500', display: 'block', marginBottom: '8px' }}>PAN Card Upload *</label>
          <input type="file" />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <AUBUTTON variant="primary" onClick={handleNext}>Submit KYC Documents</AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate(-1)}>Back</AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
