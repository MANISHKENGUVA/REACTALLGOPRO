import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUCHECKBOX, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { resolveWorkflowRoute } from '../../utils/globalRouterNavigator';
import { z } from "zod";

const initialAddressDetails = {
  flatNo: '',
  building: '',
  street: '',
  landmark: '',
  city: '',
  district: '',
  state: '',
  pincode: '',
  residenceType: '',
  permanentAddressSameAsCurrent: false,
};

const formSchema = z.object({
  flatNo: z.string().min(1, "flatNo is required"),
  building: z.string().min(1, "building is required"),
  street: z.string().min(1, "street is required"),
  landmark: z.string().min(1, "landmark is required"),
  city: z.string().min(1, "city is required"),
  district: z.string().min(1, "district is required"),
  state: z.string().min(1, "state is required"),
  pincode: z.string().min(1, "pincode is required"),
  residenceType: z.string().min(1, "residenceType is required"),
  permanentAddressSameAsCurrent: z.boolean().default(false)
});

export default function AddressInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState(initialAddressDetails);
  const [errors, setErrors] = useState({});

  const workflowMetadata = useMemo(() => {
    return {
      componentViewRenderState: searchParams.get('STATE') || searchParams.get('componentViewRenderState') || metadata?.componentViewRenderState || 'BORROWER-ADDRESS-V1-ADDRESS-INFO-V1',
      componentKey: searchParams.get('COMPONENT_KEY') || searchParams.get('componentKey') || metadata?.componentKey || 'ADDRESS-INFO-V1',
      workflowId: searchParams.get('WORKFLOW_ID') || searchParams.get('workflowId') || metadata?.workflowId || '',
      workflowActor: searchParams.get('WORKFLOW_ACTOR') || searchParams.get('workflowActor') || metadata?.workflowActor || '',
    };
  }, [metadata, searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = async () => {
     const result = formSchema.safeParse(formData);
      if (!result.success) {
    // Validation failed
    console.log(result.error.flatten());
    setErrors(result.error.flatten().fieldErrors);
    return;
  }
     
    if (!formData.flatNo || !formData.city || !formData.pincode || !formData.state) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        eventType: 'ADDRESS_INFO_SUBMITTED',
        formData,
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

      navigate(nextRoute || '/loan-flow/kyc-upload');
    } catch (error) {
      console.error('Workflow event submission error:', error);
      alert('Failed to submit workflow event. Please try again.');
    }
  };

  return (
    <AUCARD className="address-info-page">
      <h2>Address Information</h2>
      <p className="address-info-page__meta">State: BORROWER-ADDRESS-V1-ADDRESS-INFO-V1</p>

      <div className="address-info-page__form">
        <AUINPUT
          type="text"
          label="Flat/House No"
          name="flatNo"
          value={formData.flatNo}
          onChange={handleChange}
          placeholder="Enter flat/house number"
          error={!!errors?.flatNo}
          errormessage={errors?.flatNo?.[0] || ''}
          required
        />

        <AUINPUT
          type="text"
          label="Building Name"
          name="building"
          value={formData.building}
          onChange={handleChange}
          placeholder="Enter building name"
          error={!!errors?.building}
          errormessage={errors?.building?.[0] || ''}
        />

        <AUINPUT
          type="text"
          label="Street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="Enter street address"
          error={!!errors?.street}
          errormessage={errors?.street?.[0] || ''}
        />

        <AUINPUT
          type="text"
          label="Landmark"
          name="landmark"
          value={formData.landmark}
          onChange={handleChange}
          placeholder="Enter nearby landmark"
          error={!!errors?.landmark}
          errormessage={errors?.landmark?.[0] || ''}
        />

        <AUINPUT
          type="text"
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Enter city"
          error={!!errors?.city}
          errormessage={errors?.city?.[0] || ''}
          required
        />

        <AUINPUT
          type="text"
          label="District"
          name="district"
          value={formData.district}
          onChange={handleChange}
          placeholder="Enter district"
          error={!!errors?.district}
          errormessage={errors?.district?.[0] || ''}
        />

        <AUSELECT
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          options={[
            { label: 'Select State', value: '' },
            { label: 'Maharashtra', value: 'maharashtra' },
            { label: 'Karnataka', value: 'karnataka' },
            { label: 'Tamil Nadu', value: 'tamilnadu' },
            { label: 'Telangana', value: 'telangana' },
            { label: 'Delhi', value: 'delhi' },
            { label: 'Other', value: 'other' }
          ]}
          error={!!errors?.state}
          errormessage={errors?.state?.[0] || ''}
          required
        />

        <AUINPUT
          type="text"
          label="Pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Enter pincode"
          error={!!errors?.pincode}
          errormessage={errors?.pincode?.[0] || ''}
          required
        />

        <AUSELECT
          label="Residence Type"
          name="residenceType"
          value={formData.residenceType}
          onChange={handleChange}
          options={[
            { label: 'Select Type', value: '' },
            { label: 'Owned', value: 'owned' },
            { label: 'Rented', value: 'rented' },
            { label: 'With Parents', value: 'with_parents' }
          ]}
          error={!!errors?.residenceType}
          errormessage={errors?.residenceType?.[0] || ''}
        />

        <div className="address-info-page__checkbox-row">
          <AUCHECKBOX
            name="permanentAddressSameAsCurrent"
            checked={formData.permanentAddressSameAsCurrent}
            onChange={handleChange}
          />
          <label>Permanent Address Same as Current</label>
        </div>

        <div className="address-info-page__actions">
          <AUBUTTON variant="primary" onClick={handleNext}>
            Next
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/personal-info')}>
            Back
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
