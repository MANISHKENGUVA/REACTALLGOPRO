import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUCHECKBOX, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { EventPublisher } from '../../workflow/EventPublisher';
import { SessionManager } from '../../workflow/SessionManager';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage } from '../../utils/security';
import { z } from 'zod';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import {
  clearFieldError,
  firstError,
  pincodeField,
  requiredText,
  zodFieldErrors,
} from '../../utils/formValidation';
import { useFormDraft } from '../../workflow/useFormDraft';

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
  flatNo: requiredText('Enter the flat or house number', { max: 40 }),
  building: requiredText('Enter the building name', { max: 80 }),
  street: requiredText('Enter the street', { max: 120 }),
  landmark: requiredText('Enter a nearby landmark', { max: 120 }),
  city: requiredText('Enter the city', { max: 60 }),
  district: requiredText('Enter the district', { max: 60 }),
  state: requiredText('Select a state', { max: 60 }),
  pincode: pincodeField(),
  residenceType: requiredText('Select a residence type', { max: 40 }),
  permanentAddressSameAsCurrent: z.boolean(),
});

export default function AddressInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-ADDRESS-V1-ADDRESS-INFO-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/address-info',
  }), [metadata, searchParams]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Draft: restores this step after a refresh and keeps values while the
  // applicant is mid-application; cleared as soon as the backend accepts.
  const {
    values: formData,
    setValues: setFormData,
    clearDraft,
  } = useFormDraft({
    workflowId: workflowMetadata.workflowId,
    actor: workflowMetadata.workflowActor,
    stateId: workflowMetadata.componentViewRenderState,
    initialValues: initialAddressDetails,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => clearFieldError(clearFieldError(prev, name), 'submit'));
  };

  const handleNext = async (event) => {
    event?.preventDefault?.();
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      setErrors(zodFieldErrors(result.error));
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        searchParams,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'ADDRESS_INFO_SUBMITTED',
        formData: result.data,
        workflowMetadata,
      });
      // The backend accepted the step; the draft must not be restored again.
      clearDraft();
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'We could not save this address. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Step 2 · Borrower"
        title="Address"
        description="Use the address where you currently live. Your permanent address can be the same."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not save this address">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection
            title="Current address"
            description="This is used for correspondence and verification."
          >
            <div className="gp-form-grid">
              <AUINPUT
                type="text"
                label="Flat / house number"
                name="flatNo"
                value={formData.flatNo}
                onChange={handleChange}
                placeholder="e.g. 4B"
                autoComplete="address-line2"
                error={errors.flatNo || ''}
                required
              />
              <AUINPUT
                type="text"
                label="Building name"
                name="building"
                value={formData.building}
                onChange={handleChange}
                placeholder="Enter building name"
                autoComplete="address-line1"
                error={errors.building || ''}
                required
              />
              <AUINPUT
                type="text"
                label="Street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Enter street"
                autoComplete="address-line3"
                error={errors.street || ''}
                required
              />
              <AUINPUT
                type="text"
                label="Landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Nearby landmark"
                error={errors.landmark || ''}
                required
              />
              <AUINPUT
                type="text"
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                autoComplete="address-level2"
                error={errors.city || ''}
                required
              />
              <AUINPUT
                type="text"
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter district"
                autoComplete="address-level1"
                error={errors.district || ''}
                required
              />
              <AUSELECT
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                options={[
                  { label: 'Select state', value: '' },
                  { label: 'Maharashtra', value: 'maharashtra' },
                  { label: 'Karnataka', value: 'karnataka' },
                  { label: 'Tamil Nadu', value: 'tamilnadu' },
                  { label: 'Telangana', value: 'telangana' },
                  { label: 'Delhi', value: 'delhi' },
                  { label: 'Other', value: 'other' },
                ]}
                error={errors.state || ''}
                required
              />
              <AUINPUT
                type="text"
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                error={errors.pincode || ''}
                required
              />
              <AUSELECT
                label="Residence type"
                name="residenceType"
                value={formData.residenceType}
                onChange={handleChange}
                options={[
                  { label: 'Select type', value: '' },
                  { label: 'Owned', value: 'owned' },
                  { label: 'Rented', value: 'rented' },
                  { label: 'With parents', value: 'with_parents' },
                ]}
                error={errors.residenceType || ''}
                required
              />
            </div>
          </FormSection>

          <AUCHECKBOX
            id="permanent-address-same"
            name="permanentAddressSameAsCurrent"
            checked={formData.permanentAddressSameAsCurrent}
            onChange={handleChange}
            label="My permanent address is the same as my current address"
          />

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint={firstError(errors) ? 'Check the highlighted fields above.' : 'You can review this address later.'}
          >
            <AUBUTTON type="submit" variant="primary" disabled={submitting} loading={submitting} loadingText="Submitting…">
              Save and continue
            </AUBUTTON>
          </FormActions>
        </form>
      </AUCARD>
    </div>
  );
}
