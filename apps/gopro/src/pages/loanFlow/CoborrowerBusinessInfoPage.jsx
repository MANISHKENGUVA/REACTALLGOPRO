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
  requiredText,
  zodFieldErrors,
} from '../../utils/formValidation';
import { useFormDraft } from '../../workflow/useFormDraft';

const formSchema = z.object({
  registrationNumber: requiredText('Enter the business registration number', { max: 40 }),
  annualRevenue: amountField('Enter a valid annual revenue'),
});

export default function CoborrowerBusinessInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'COBORROWER-BUSINESS-V1-BUSINESS-INFO-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/coborrower-business-info',
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
      registrationNumber: '',
      annualRevenue: '',
    },
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
        eventType: 'BUSINESS_INFO_SUBMITTED',
        formData: {
          registrationNumber: result.data.registrationNumber,
          annualRevenue: Number(result.data.annualRevenue),
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/coborrower-bank-details',
      });
      // The backend accepted the step; the draft must not be restored again.
      clearDraft();
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Could not submit the business details. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Co-borrower · Income"
        title="Co-borrower business"
        description="Provide the registered business details used to assess the co-borrower's income."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not save the business details">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection
            title="Business details"
            description="The loan service verifies the registration before the application continues."
          >
            <div className="gp-form-grid">
              <AUINPUT
                type="text"
                label="GST / business registration number"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="Enter registration number"
                autoComplete="off"
                error={errors.registrationNumber || ''}
                required
              />
              <AUINPUT
                type="number"
                label="Annual turnover / revenue (₹)"
                name="annualRevenue"
                value={formData.annualRevenue}
                onChange={handleChange}
                placeholder="e.g. 1200000"
                inputMode="decimal"
                min="0"
                step="1"
                error={errors.annualRevenue || ''}
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
            hint={firstError(errors) ? 'Check the highlighted fields above.' : 'Use the figures from the latest filed returns.'}
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
