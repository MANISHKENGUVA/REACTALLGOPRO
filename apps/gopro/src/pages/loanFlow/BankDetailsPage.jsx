import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { z } from 'zod';
import { EventPublisher } from '../../workflow/EventPublisher';
import { SessionManager } from '../../workflow/SessionManager';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage, UPLOAD_POLICIES, validateUploadFile } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import FileUpload from '../../components/ui/FileUpload';
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

export default function BankDetailsPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-BANK-V1-BANK-DETAILS-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/bank-details',
  }), [metadata, searchParams]);

  const [submitting, setSubmitting] = useState(false);
  const [cancelledCheque, setCancelledCheque] = useState(null);
  const [errors, setErrors] = useState({});

  // Draft: account text fields restore after a refresh; the cancelled-cheque
  // image is binary and is deliberately not persisted. Cleared on accept.
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

  const handleFileChange = (e) => {
    setCancelledCheque(e.target.files?.[0] || null);
    setErrors((prev) => clearFieldError(clearFieldError(prev, 'cheque'), 'submit'));
  };

  const handleNext = async (event) => {
    event?.preventDefault?.();
    const result = formSchema.safeParse(formData);
    const nextErrors = result.success ? {} : zodFieldErrors(result.error);
    if (!cancelledCheque) {
      nextErrors.cheque = 'Upload a cancelled cheque or bank statement.';
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const validation = validateUploadFile(cancelledCheque, UPLOAD_POLICIES.supportingDocument);
    if (!validation.ok) {
      setErrors({ cheque: validation.error });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        searchParams,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'BANK_DETAILS_SUBMITTED',
        formData: {
          accountNumber: result.data.accountNumber,
          ifscCode: result.data.ifscCode,
          bankName: result.data.bankName,
          chequeFileName: cancelledCheque.name,
        },
        workflowMetadata,
      });
      // The backend accepted the step; the draft must not be restored again.
      clearDraft();
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Failed to submit bank details. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · Bank"
        title="Bank details"
        description="Provide the account used for disbursement and repayment. The loan service verifies the account before the application continues."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not save the bank details">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection title="Account details">
            <div className="gp-form-grid">
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
            </div>
          </FormSection>

          <FormSection title="Account proof">
            <FileUpload
              id="cancelled-cheque"
              name="cancelledCheque"
              label="Cancelled cheque or bank statement"
              hint="PDF, JPG, PNG or WEBP, up to 5 MB. The account number and IFSC must be visible."
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              required
              file={cancelledCheque}
              onChange={handleFileChange}
              error={errors.cheque || ''}
              actionLabel="Choose file"
            />
          </FormSection>

          <InlineAlert tone="info" title="Verification">
            <p>The account is verified by the loan service before disbursement. Enter the details exactly as they appear on the cheque or statement.</p>
          </InlineAlert>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint={firstError(errors) ? 'Check the highlighted fields above.' : 'IFSC is an 11-character code printed on the cheque book.'}
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
