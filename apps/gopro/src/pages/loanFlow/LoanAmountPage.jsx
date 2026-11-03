import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUCARD } from 'artiqui/dist/router-engine.es.js';
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

const formSchema = z.object({
  requestedAmount: amountField('Enter a valid requested amount'),
  tenureMonths: z.coerce.number()
    .int('Enter the tenure in whole months')
    .min(1, 'Enter a tenure of at least 1 month'),
});

export default function LoanAmountPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    requestedAmount: '500000',
    tenureMonths: '36',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'LENDER-OFFER-V1-LOAN-AMOUNT-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/loan-amount',
  }), [metadata, searchParams]);

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
        eventType: 'AMOUNT_SELECTED',
        formData: {
          requestedAmount: Number(result.data.requestedAmount),
          tenureMonths: Number(result.data.tenureMonths),
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/underwriter-review',
      });
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Failed to submit the requested amount. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Lender · Offer"
        title="Requested amount and tenure"
        description="Enter the amount you would like to borrow and the repayment period. The lender decides the final offer."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not submit the request">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection
            title="Request details"
            description="The final sanctioned amount, interest rate and EMI are supplied by the lender."
          >
            <div className="gp-form-grid">
              <AUINPUT
                type="number"
                label="Requested amount (₹)"
                name="requestedAmount"
                value={formData.requestedAmount}
                onChange={handleChange}
                placeholder="Enter requested amount"
                inputMode="decimal"
                min="1"
                step="1"
                error={errors.requestedAmount || ''}
                required
              />
              <AUINPUT
                type="number"
                label="Tenure (months)"
                name="tenureMonths"
                value={formData.tenureMonths}
                onChange={handleChange}
                placeholder="Enter tenure in months"
                inputMode="numeric"
                min="1"
                step="1"
                error={errors.tenureMonths || ''}
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
            hint={firstError(errors) ? 'Check the highlighted fields above.' : 'The lender confirms the final offer after review.'}
          >
            <AUBUTTON type="submit" variant="primary" disabled={submitting} loading={submitting} loadingText="Submitting…">
              Continue to offer
            </AUBUTTON>
          </FormActions>
        </form>
      </AUCARD>
    </div>
  );
}
