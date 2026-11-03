import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { publicErrorMessage, UPLOAD_POLICIES, validateUploadFiles } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import FileUpload from '../../components/ui/FileUpload';

export default function DocumentUploadPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-DOCUMENTS-V1-DOCUMENT-UPLOAD-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/document-upload',
  }), [metadata, searchParams]);

  const handleFileChange = (event) => {
    setDocuments(Array.from(event.target.files || []));
    setErrors({});
  };

  const handleNext = async (event) => {
    event?.preventDefault?.();
    if (documents.length) {
      const validation = validateUploadFiles(documents, UPLOAD_POLICIES.supportingDocument);
      if (!validation.ok) {
        setErrors({ documents: validation.error });
        return;
      }
    }

    setErrors({});
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'DOCUMENT_UPLOAD_SUBMITTED',
        formData: {
          documentCount: documents.length,
          documentNames: documents.map((file) => file.name),
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/loan-consent',
      });
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Failed to submit the documents. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · Documents"
        title="Add supporting documents"
        description="Upload any documents that support your application. This step is optional; you can continue without adding files."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not submit the documents">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}
        {errors.documents ? (
          <InlineAlert tone="error" title="Check your files">
            <p>{errors.documents}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection title="Supporting documents">
            <FileUpload
              id="supporting-documents"
              name="documents"
              label="Additional supporting documents"
              hint="Optional. Up to 10 files. PDF, JPG, PNG, WEBP, DOC or DOCX, each up to 5 MB."
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              multiple
              files={documents}
              onChange={handleFileChange}
              error={errors.documents || ''}
              actionLabel="Choose documents"
            />
          </FormSection>

          <InlineAlert tone="info" title="Useful documents">
            <p>ITR, Form-16, salary slips, property documents or statements from a previous loan.</p>
          </InlineAlert>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint={documents.length ? `${documents.length} file${documents.length === 1 ? '' : 's'} selected.` : 'No files selected — you can continue.'}
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
