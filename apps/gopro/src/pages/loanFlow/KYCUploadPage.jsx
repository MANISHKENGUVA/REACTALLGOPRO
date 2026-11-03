import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { EventPublisher } from '../../workflow/EventPublisher';
import { SessionManager } from '../../workflow/SessionManager';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage, UPLOAD_POLICIES, validateUploadFiles } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import FileUpload from '../../components/ui/FileUpload';

const DOCUMENTS = [
  { name: 'aadhaarFront', label: 'Aadhaar card — front side', hint: 'The side showing your photo and Aadhaar number.' },
  { name: 'aadhaarBack', label: 'Aadhaar card — back side', hint: 'The side showing your address.' },
  { name: 'panCard', label: 'PAN card — front side', hint: 'A clear photo or scan of the complete card.' },
];

export default function KYCUploadPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
  });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-KYC-V1-KYC-UPLOAD-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/kyc-upload',
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
    setUploading(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        searchParams,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'KYC_UPLOAD_SUBMITTED',
        formData: {
          aadhaarFront: files.aadhaarFront.name,
          aadhaarBack: files.aadhaarBack.name,
          panCard: files.panCard.name,
        },
        workflowMetadata,
      });
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Error submitting documents. Please try again.') });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · KYC"
        title="Upload your identity documents"
        description="Upload clear, colour images or PDFs of your Aadhaar and PAN cards. Each file can be up to 5 MB."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not submit your documents">
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
            description="All three documents are required. Make sure the whole card is visible and the text is readable."
          >
            <div className="gp-stack--tight">
              {DOCUMENTS.map((document) => (
                <FileUpload
                  key={document.name}
                  id={`kyc-${document.name}`}
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
            hint="Your documents are used only for identity verification."
          >
            <AUBUTTON type="submit" variant="primary" disabled={uploading} loading={uploading} loadingText="Submitting…">
              Submit documents
            </AUBUTTON>
          </FormActions>
        </form>
      </AUCARD>
    </div>
  );
}
