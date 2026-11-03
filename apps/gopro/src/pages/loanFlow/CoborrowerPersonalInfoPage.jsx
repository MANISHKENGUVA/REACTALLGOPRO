import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUCARD, AUDATEPICKER } from 'artiqui/dist/router-engine.es.js';
import { EventPublisher } from '../../workflow/EventPublisher';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage } from '../../utils/security';
import {
  COBORROWER_RELATIONSHIP_OPTIONS,
  validateCoborrowerPersonalInfo,
} from './coborrowerPersonalInfoValidation';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import { clearFieldError } from '../../utils/formValidation';
import { useFormDraft } from '../../workflow/useFormDraft';

export default function CoborrowerPersonalInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'COBORROWER-DETAILS-V1-PERSONAL-INFO-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/coborrower-personal-info',
  }), [metadata, searchParams]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Draft: restores this step after a refresh and keeps values while the
  // co-borrower is mid-application; cleared once the backend accepts.
  const {
    values: formData,
    setValues: setFormData,
    clearDraft,
  } = useFormDraft({
    workflowId: workflowMetadata.workflowId,
    actor: workflowMetadata.workflowActor,
    stateId: workflowMetadata.componentViewRenderState,
    initialValues: {
      fullName: '',
      relationship: 'spouse',
      email: '',
      mobileNumber: '',
      panNumber: '',
      dateOfBirth: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => clearFieldError(clearFieldError(prev, name), 'submit'));
  };

  const handleNext = async (event) => {
    event?.preventDefault?.();
    const { errors: nextErrors, data } = validateCoborrowerPersonalInfo(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        searchParams,
        eventType: 'COBORROWER_PERSONAL_INFO_SUBMITTED',
        formData: data,
        workflowMetadata,
      });
      // The backend accepted the step; the draft must not be restored again.
      clearDraft();
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Failed to submit co-borrower information. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Co-borrower · Step 1"
        title="Co-borrower personal details"
        description="Add the person who will support this application. Their details are verified separately."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not save these details">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection title="Identity and contact">
            <div className="gp-form-grid">
              <AUINPUT
                type="text"
                label="Full name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                autoComplete="name"
                error={errors.fullName || ''}
                required
              />
              <AUSELECT
                label="Relationship to primary applicant"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                options={[
                  { label: 'Select relationship', value: '' },
                  ...COBORROWER_RELATIONSHIP_OPTIONS,
                ]}
                error={errors.relationship || ''}
                required
              />
              <AUINPUT
                type="email"
                label="Email address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email || ''}
              />
              <AUINPUT
                type="tel"
                label="Mobile number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                error={errors.mobileNumber || ''}
                required
              />
              <AUINPUT
                type="text"
                label="PAN number"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                autoComplete="off"
                maxLength={10}
                error={errors.panNumber || ''}
                required
              />
              <AUDATEPICKER
                label="Date of birth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                placeholder="Select date of birth"
                disableFuture
                error={errors.dateOfBirth || ''}
              />
            </div>
          </FormSection>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint="The co-borrower will complete their own verification steps."
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
