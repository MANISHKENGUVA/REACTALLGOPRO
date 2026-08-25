import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUCHECKBOX, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';

export default function CoborrowerAddressInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    flatNo: '',
    building: '',
    street: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    residenceType: 'owned',
    permanentAddressSameAsCurrent: true,
  });

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'COBORROWER-ADDRESS-V1-ADDRESS-INFO-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'COBORROWER-ADDRESS-INFO-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleNext = async () => {
    try {
      const payload = {
        eventType: 'ADDRESS_INFO_SUBMITTED',
        formData,
        workflowMetadata,
      };

      const response = await fetch('http://localhost:3000/api/workflow/eventCreaterAndProcesser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Submission failed');

      const result = await response.json();
      const nextRoute = resolveWorkflowRoute(result?.data ?? result);
      navigate(nextRoute || '/loan-flow/coborrower-kyc-upload');
    } catch (err) {
      console.error('Co-borrower address submit error:', err);
      navigate('/loan-flow/coborrower-kyc-upload');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Co-Borrower Address Information</h2>
      <p style={{ color: '#666', marginBottom: '4px' }}>State: {workflowMetadata.componentViewRenderState}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
        <AUINPUT type="text" label="Flat/House No" name="flatNo" value={formData.flatNo} onChange={handleChange} required />
        <AUINPUT type="text" label="Building / Landmark" name="building" value={formData.building} onChange={handleChange} />
        <AUINPUT type="text" label="City" name="city" value={formData.city} onChange={handleChange} required />
        <AUINPUT type="text" label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <AUBUTTON variant="primary" onClick={handleNext}>Next</AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate(-1)}>Back</AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
