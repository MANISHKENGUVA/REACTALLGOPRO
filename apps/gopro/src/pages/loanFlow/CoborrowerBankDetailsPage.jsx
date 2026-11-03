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
  clearFieldError,
  firstError,
  ifscField,
  requiredText,
  zodFieldErrors,
} from '../../utils/formValidation';
import { useFormDraft } from '../../workflow/useFormDraft';

const formSchema = z.object({
  bankName: requiredText('Enter the bank name', { max: 80 }),
  accountNumber: z.string()
    .trim()
    .regex(/^\d{9,18}$/, 'Enter a valid account number (9–18 digits)'),
  ifscCode: ifscField(),
});

export default function CoborrowerBankDetailsPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'COBORROWER-BANK-V1-BANK-DETAILS-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/coborrower-bank-details',
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
      accountNumber: '',
      ifscCode: '',
      bankName: '',
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
        eventType: 'BANK_DETAILS_SUBMITTED',
        formData: result.data,
        workflowMetadata,
        fallbackRoute: '/loan-flow/borrower-credit-check',
      });
      // The backend accepted the step; the draft must not be restored again.
      clearDraft();
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Could not submit the bank details. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Co-borrower · Bank"
        title="Co-borrower bank details"
        description="Provide the account the co-borrower will use for repayment. The loan service verifies it before the application continues."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not save the bank details">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection title="Account details">
            <InlineAlert tone="info" title="Verification">
              <p>These details are verified by the loan service. Enter them exactly as they appear on the bank record.</p>
            </InlineAlert>
            <div className="gp-form-grid">
              <AUINPUT
                type="text"
                label="Bank name"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
                autoComplete="organization"
                error={errors.bankName || ''}
                required
              />
              <AUINPUT
                type="text"
                label="Account number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
                inputMode="numeric"
                autoComplete="off"
                maxLength={18}
                error={errors.accountNumber || ''}
                required
              />
              <AUINPUT
                type="text"
                label="IFSC code"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="e.g. SBIN0001234"
                autoComplete="off"
                maxLength={11}
                error={errors.ifscCode || ''}
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
            hint={firstError(errors) ? 'Check the highlighted fields above.' : 'IFSC is an 11-character code printed on the cheque book.'}
          >
            <AUBUTTON type="submit" variant="primary" disabled={submitting} loading={submitting} loadingText="Submitting…">
              Submit and continue
            </AUBUTTON>
          </FormActions>
        </form>
      </AUCARD>
    </div>
  );
}
