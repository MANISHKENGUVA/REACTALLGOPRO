import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { z } from 'zod';
import { EventPublisher } from '../../workflow/EventPublisher';
import { SessionManager } from '../../workflow/SessionManager';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage, UPLOAD_POLICIES, validateUploadFiles } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import FileUpload from '../../components/ui/FileUpload';
import {
  amountField,
  clearFieldError,
  firstError,
  optionalText,
  zodFieldErrors,
} from '../../utils/formValidation';
import { useFormDraft } from '../../workflow/useFormDraft';

const formSchema = z.object({
  monthlyIncome: amountField('Provide a valid monthly income'),
  companyInfo: optionalText({ max: 200, message: 'Company information is too long' }),
  payslips: z.array(z.any()).length(3, 'Upload exactly 3 monthly payslips'),
});

const initialState = {
  monthlyIncome: '',
  companyInfo: '',
  payslips: [],
};

export default function SalaryInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-SALARY-V1-SALARY-INFO-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/salary-info',
  }), [metadata, searchParams]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Draft: text fields restore after a refresh; uploaded payslips are binary
  // and are deliberately not persisted (re-select on resume). Cleared on accept.
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => clearFieldError(clearFieldError(prev, name), 'submit'));
  };

  const handleFilesChange = (e) => {
    setFormData((prev) => ({ ...prev, payslips: Array.from(e.target.files || []) }));
    setErrors((prev) => clearFieldError(clearFieldError(prev, 'payslips'), 'submit'));
  };

  const handleNext = async (event) => {
    event?.preventDefault?.();
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      setErrors(zodFieldErrors(result.error));
      return;
    }

    const validation = validateUploadFiles(formData.payslips, UPLOAD_POLICIES.supportingDocument);
    if (!validation.ok) {
      setErrors({ payslips: validation.error });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'SALARY_INFO_SUBMITTED',
        formData: {
          monthlyIncome: Number(result.data.monthlyIncome),
          companyInfo: result.data.companyInfo,
          payslips: formData.payslips.map((file) => file.name),
        },
        workflowMetadata,
      });
      // The backend accepted the step; the draft must not be restored again.
      clearDraft();
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Failed to submit salary information. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · Employment"
        title="Salary information"
        description="Provide your monthly income and the last three months of payslips."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not save your salary information">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection title="Income and employer">
            <InlineAlert tone="info" title="Minimum income">
              <p>Salaried applicants are expected to earn at least ₹50,000 per month. The loan service makes the final eligibility decision.</p>
            </InlineAlert>
            <div className="gp-form-grid">
              <AUINPUT
                type="number"
                label="Monthly income (₹)"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                placeholder="Enter monthly income"
                inputMode="decimal"
                min="0"
                step="1"
                error={errors.monthlyIncome || ''}
                required
              />
              <AUINPUT
                type="text"
                label="Company information"
                name="companyInfo"
                value={formData.companyInfo}
                onChange={handleChange}
                placeholder="Employer name or a short description"
                autoComplete="organization"
                error={errors.companyInfo || ''}
              />
            </div>
          </FormSection>

          <FormSection title="Payslips">
            <FileUpload
              id="salary-payslips"
              name="payslips"
              label="Last 3 monthly payslips"
              hint="Select exactly 3 files. PDF, JPG, PNG, WEBP, DOC or DOCX, each up to 5 MB."
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              multiple
              required
              files={formData.payslips}
              onChange={handleFilesChange}
              error={errors.payslips || ''}
              actionLabel="Choose payslips"
            />
          </FormSection>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint={firstError(errors) ? 'Check the highlighted fields above.' : 'Upload one payslip for each of the last three months.'}
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
