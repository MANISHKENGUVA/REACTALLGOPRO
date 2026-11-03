import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON, AUINPUT } from 'artiqui/dist/router-engine.es.js';
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
  amountField,
  clearFieldError,
  firstError,
  zodFieldErrors,
} from '../../utils/formValidation';
import { useFormDraft } from '../../workflow/useFormDraft';

const formSchema = z.object({
  monthlyIncome: amountField('Enter a valid monthly income'),
});

export default function CoborrowerSalaryInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'COBORROWER-SALARY-V1-SALARY-INFO-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/coborrower-salary-info',
  }), [metadata, searchParams]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Draft: restores the monthly income after a refresh; cleared on accept.
  const {
    values: formData,
    setValues: setFormData,
    clearDraft,
  } = useFormDraft({
    workflowId: workflowMetadata.workflowId,
    actor: workflowMetadata.workflowActor,
    stateId: workflowMetadata.componentViewRenderState,
    initialValues: { monthlyIncome: '' },
  });

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
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'SALARY_INFO_SUBMITTED',
        formData: {
          monthlyIncome: Number(result.data.monthlyIncome),
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/coborrower-bank-details',
      });
      // The backend accepted the step; the draft must not be restored again.
      clearDraft();
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Could not submit the salary details. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Co-borrower · Income"
        title="Co-borrower salary"
        description="Enter the co-borrower's monthly salary. The loan service evaluates co-borrower eligibility from this value."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not save the salary">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection title="Monthly income">
            <InlineAlert tone="info" title="Co-borrower income requirement">
              <p>Co-borrower eligibility requires a monthly income of at least ₹30,000.</p>
            </InlineAlert>
            <div className="gp-form-grid gp-form-grid--single">
              <AUINPUT
                type="number"
                label="Monthly salary (₹)"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                placeholder="e.g. 45000"
                inputMode="decimal"
                min="0"
                step="1"
                error={errors.monthlyIncome || ''}
                required
              />
            </div>
          </FormSection>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint={firstError(errors) ? 'Check the salary above.' : 'The loan service decides the outcome from this value.'}
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
