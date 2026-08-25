import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function KYCUploadPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null
  });
  const [uploading, setUploading] = useState(false);

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'BORROWER-KYC-V1-KYC-UPLOAD-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'KYC-UPLOAD-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

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
      const payload = {
        eventType: 'KYC_UPLOAD_SUBMITTED',
        formData: {
          aadhaarFront: files.aadhaarFront?.name || null,
          aadhaarBack: files.aadhaarBack?.name || null,
          panCard: files.panCard?.name || null,
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

      navigate(nextRoute || '/loan-flow/face-verification');
    } catch (error) {
      console.error('Workflow event submission error:', error);
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
