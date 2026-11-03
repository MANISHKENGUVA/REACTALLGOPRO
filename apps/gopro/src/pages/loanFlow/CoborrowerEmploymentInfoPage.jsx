import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON, AUINPUT, AUSELECT, AUCHECKBOX } from 'artiqui/dist/router-engine.es.js';
import { z } from 'zod';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { publicErrorMessage } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import {
  clearFieldError,
  firstError,
  optionalText,
  requiredText,
  zodFieldErrors,
} from '../../utils/formValidation';
import { useFormDraft } from '../../workflow/useFormDraft';

const formSchema = z.object({
  employmentType: z.enum(['salaried', 'business'], {
    error: 'Select an employment type',
  }),
  companyName: requiredText('Enter the company or employer name', { max: 120 }),
  designation: optionalText({ max: 80, message: 'Designation is too long' }),
  workingSince: optionalText({ max: 20, message: 'Enter the date as MM/YYYY' }),
  isActive: z.boolean(),
});

const initialState = {
  companyName: '',
  designation: '',
  workingSince: '',
  isActive: true,
  employmentType: 'salaried',
};

export default function CoborrowerEmploymentInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'COBORROWER-EMPLOYMENT-V1-EMPLOYMENT-INFO-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/coborrower-employment-info',
  }), [metadata, searchParams]);

  const [errors, setErrors] = useState({});

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
    initialValues: initialState,
  });
  const [submitting, setSubmitting] = useState(false);

  const isBusiness = formData.employmentType === 'business';

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

    const fallbackRoute = result.data.employmentType === 'business'
      ? '/loan-flow/coborrower-business-info'
      : '/loan-flow/coborrower-salary-info';

    setErrors({});
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'EMPLOYMENT_INFO_SUBMITTED',
        formData: result.data,
        workflowMetadata,
        fallbackRoute,
      });
      // The backend accepted the step; the draft must not be restored again.
      clearDraft();
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Could not submit the employment details. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Co-borrower · Step 3"
        title="Co-borrower employment"
        description="Tell us how the co-borrower earns. The next step depends on the type selected."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not save these details">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection
            title="Employment details"
            description={isBusiness
              ? 'Business owners continue to business details.'
              : 'Salaried applicants continue to salary details.'}
          >
            <div className="gp-form-grid">
              <AUSELECT
                label="Employment type"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                options={[
                  { label: 'Salaried', value: 'salaried' },
                  { label: 'Business owner / self-employed', value: 'business' },
                ]}
                error={errors.employmentType || ''}
                required
              />
              <AUINPUT
                type="text"
                label={isBusiness ? 'Business / employer name' : 'Company / employer name'}
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder={isBusiness ? 'Enter business name' : 'Enter company name'}
                autoComplete="organization"
                error={errors.companyName || ''}
                required
              />
              <AUINPUT
                type="text"
                label={isBusiness ? 'Role in the business' : 'Designation'}
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder={isBusiness ? 'e.g. Owner' : 'Enter your designation'}
                autoComplete="organization-title"
                error={errors.designation || ''}
              />
              <AUINPUT
                type="text"
                label={isBusiness ? 'Business operating since' : 'Working since'}
                name="workingSince"
                value={formData.workingSince}
                onChange={handleChange}
                placeholder="MM/YYYY"
                inputMode="numeric"
                maxLength={7}
                helperText="Optional — enter the month and year, for example 04/2021."
                error={errors.workingSince || ''}
              />
            </div>
          </FormSection>

          <AUCHECKBOX
            id="coborrower-employment-active"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            label={isBusiness
              ? 'The business is currently active'
              : 'The co-borrower currently works here'}
          />

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint={firstError(errors) ? 'Check the highlighted fields above.' : 'You can review these details later.'}
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
