import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { SessionManager } from '../../workflow/SessionManager';
import { z } from 'zod';
import { EventPublisher } from '../../workflow/EventPublisher';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import {
  clearFieldError,
  firstError,
  optionalText,
  zodFieldErrors,
} from '../../utils/formValidation';
import { useFormDraft } from '../../workflow/useFormDraft';

const formSchema = z.object({
  employmentType: z.enum(['salaried', 'business'], {
    error: 'Select an employment type',
  }),
  companyName: optionalText({ max: 120, message: 'Company name is too long' }),
  designation: optionalText({ max: 80, message: 'Designation is too long' }),
  yearsOfExperience: z.string().trim(),
}).superRefine((value, ctx) => {
  if (value.employmentType !== 'salaried') return;
  if (!value.companyName) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyName'], message: 'Enter the company name' });
  }
  if (!value.designation) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['designation'], message: 'Enter your designation' });
  }
  const years = Number(value.yearsOfExperience);
  if (value.yearsOfExperience === '' || !Number.isFinite(years) || years < 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['yearsOfExperience'], message: 'Enter valid years of experience' });
  }
});

const initialState = {
  companyName: '',
  designation: '',
  yearsOfExperience: '',
  employmentType: 'salaried',
};

export default function EmploymentInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-EMPLOYMENT-V1-EMPLOYMENT-INFO-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/employment-info',
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
    initialValues: initialState,
  });

  const isBusiness = formData.employmentType === 'business';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        eventType: 'EMPLOYMENT_INFO_SUBMITTED',
        formData: result.data,
        workflowMetadata,
      });
      // The backend accepted the step; the draft must not be restored again.
      clearDraft();
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Failed to submit employment information. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · Step 4"
        title="Employment"
        description="Tell us how you earn. Salaried applicants continue to salary details; business owners continue to business details."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not save your employment details">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection title="Employment type and employer">
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

              {isBusiness ? (
                <div className="gp-form-grid__full">
                  <InlineAlert tone="info" title="Business details come next">
                    <p>Continue to enter the business name, annual revenue and registration details.</p>
                  </InlineAlert>
                </div>
              ) : (
                <>
                  <AUINPUT
                    type="text"
                    label="Company name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    autoComplete="organization"
                    error={errors.companyName || ''}
                    required
                  />
                  <AUINPUT
                    type="text"
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Enter your designation"
                    autoComplete="organization-title"
                    error={errors.designation || ''}
                    required
                  />
                  <AUINPUT
                    type="number"
                    label="Years of experience"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    error={errors.yearsOfExperience || ''}
                    required
                  />
                </>
              )}
            </div>
          </FormSection>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint={firstError(errors) ? 'Check the highlighted fields above.' : 'These details help the loan service assess repayment capacity.'}
          >
            <AUBUTTON type="submit" variant="primary" disabled={submitting} loading={submitting} loadingText="Submitting…">
              {isBusiness ? 'Continue to business details' : 'Save and continue'}
            </AUBUTTON>
          </FormActions>
        </form>
      </AUCARD>
    </div>
  );
}
