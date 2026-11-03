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
  optionalGstField,
  requiredText,
  zodFieldErrors,
} from '../../utils/formValidation';
import { useFormDraft } from '../../workflow/useFormDraft';

const formSchema = z.object({
  businessName: requiredText('Enter the business name', { max: 120 }),
  annualRevenue: amountField('Enter a valid annual revenue'),
  gstNumber: optionalGstField(),
  itrDocuments: z.array(z.any()).length(2, 'Upload exactly 2 annual ITR documents'),
});

const initialState = {
  businessName: '',
  annualRevenue: '',
  gstNumber: '',
  itrDocuments: [],
};

export default function BusinessInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-BUSINESS-V1-BUSINESS-INFO-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/business-info',
  }), [metadata, searchParams]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Draft: text fields restore after a refresh; uploaded ITR documents are
  // binary and are deliberately not persisted. Cleared once the backend accepts.
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
    setFormData((prev) => ({ ...prev, itrDocuments: Array.from(e.target.files || []) }));
    setErrors((prev) => clearFieldError(clearFieldError(prev, 'itrDocuments'), 'submit'));
  };

  const handleNext = async (event) => {
    event?.preventDefault?.();
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      setErrors(zodFieldErrors(result.error));
      return;
    }

    const validation = validateUploadFiles(formData.itrDocuments, UPLOAD_POLICIES.supportingDocument);
    if (!validation.ok) {
      setErrors({ itrDocuments: validation.error });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'BUSINESS_INFO_SUBMITTED',
        formData: {
          businessName: result.data.businessName,
          annualRevenue: Number(result.data.annualRevenue),
          gstNumber: result.data.gstNumber,
          itrDocuments: formData.itrDocuments.map((file) => file.name),
        },
        workflowMetadata,
      });
      // The backend accepted the step; the draft must not be restored again.
      clearDraft();
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Failed to submit business information. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · Employment"
        title="Business information"
        description="Provide the business details and the last two years of income tax returns used to assess your income."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not save the business information">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection title="Business details">
            <InlineAlert tone="info" title="Minimum revenue">
              <p>Business applicants are expected to report at least ₹5 lakh in annual revenue. The loan service makes the final eligibility decision.</p>
            </InlineAlert>
            <div className="gp-form-grid">
              <AUINPUT
                type="text"
                label="Business name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Enter business name"
                autoComplete="organization"
                error={errors.businessName || ''}
                required
              />
              <AUINPUT
                type="number"
                label="Annual revenue (₹)"
                name="annualRevenue"
                value={formData.annualRevenue}
                onChange={handleChange}
                placeholder="Enter annual revenue"
                inputMode="decimal"
                min="0"
                step="1"
                error={errors.annualRevenue || ''}
                required
              />
              <AUINPUT
                type="text"
                label="GST number (optional)"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="15-character GSTIN"
                autoComplete="off"
                maxLength={15}
                error={errors.gstNumber || ''}
              />
            </div>
          </FormSection>

          <FormSection title="Income tax returns">
            <FileUpload
              id="business-itr"
              name="itrDocuments"
              label="Last 2 years of ITR documents"
              hint="Select exactly 2 files. PDF, JPG, PNG, WEBP, DOC or DOCX, each up to 5 MB."
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              multiple
              required
              files={formData.itrDocuments}
              onChange={handleFilesChange}
              error={errors.itrDocuments || ''}
              actionLabel="Choose ITR documents"
            />
          </FormSection>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint={firstError(errors) ? 'Check the highlighted fields above.' : 'Use the figures from your latest filed returns.'}
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
