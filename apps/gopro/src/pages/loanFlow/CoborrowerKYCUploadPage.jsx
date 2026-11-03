import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { publicErrorMessage, UPLOAD_POLICIES, validateUploadFiles } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import FileUpload from '../../components/ui/FileUpload';

const DOCUMENTS = [
  { name: 'aadhaar', label: 'Aadhaar card', hint: 'A clear image or PDF of the complete Aadhaar card.' },
  { name: 'pan', label: 'PAN card', hint: 'A clear image or PDF of the complete PAN card.' },
];

export default function CoborrowerKYCUploadPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [files, setFiles] = useState({ aadhaar: null, pan: null });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'COBORROWER-KYC-V1-KYC-UPLOAD-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/coborrower-kyc-upload',
  }), [metadata, searchParams]);

  const handleFileChange = (event) => {
    const { name, files: fileList } = event.target;
    setFiles((prev) => ({ ...prev, [name]: fileList?.[0] || null }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      delete next.submit;
      return next;
    });
  };

  const handleNext = async (event) => {
    event?.preventDefault?.();
    const nextErrors = {};
    DOCUMENTS.forEach((document) => {
      if (!files[document.name]) {
        nextErrors[document.name] = `Upload the ${document.label.toLowerCase()}.`;
      }
    });
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const validation = validateUploadFiles(Object.values(files), UPLOAD_POLICIES.identityDocument);
    if (!validation.ok) {
      setErrors({ files: validation.error });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'KYC_UPLOAD_SUBMITTED',
        formData: {
          aadhaarUploaded: files.aadhaar.name,
          panUploaded: files.pan.name,
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/coborrower-face-verification',
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
        eyebrow="Co-borrower · KYC"
        title="Upload the co-borrower's identity documents"
        description="Upload clear images or PDFs of the co-borrower's Aadhaar and PAN cards. Each file can be up to 5 MB."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not submit the documents">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}
        {errors.files ? (
          <InlineAlert tone="error" title="Check your files">
            <p>{errors.files}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection
            title="Identity documents"
            description="Both documents are required. The co-borrower's name must be readable on each document."
          >
            <div className="gp-stack--tight">
              {DOCUMENTS.map((document) => (
                <FileUpload
                  key={document.name}
                  id={`coborrower-kyc-${document.name}`}
                  name={document.name}
                  label={document.label}
                  hint={`${document.hint} PDF, JPG, PNG or WEBP, up to 5 MB.`}
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  required
                  file={files[document.name]}
                  onChange={handleFileChange}
                  error={errors[document.name] || ''}
                />
              ))}
            </div>
          </FormSection>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint="The loan service verifies these documents before the next step."
          >
            <AUBUTTON type="submit" variant="primary" disabled={submitting} loading={submitting} loadingText="Submitting…">
              Submit documents
            </AUBUTTON>
          </FormActions>
        </form>
      </AUCARD>
    </div>
  );
}
