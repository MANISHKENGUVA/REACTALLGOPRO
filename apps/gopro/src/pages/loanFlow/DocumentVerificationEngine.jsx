import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EventPublisher } from '../../workflow/EventPublisher';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage } from '../../utils/security';
import BackendStepPage from '../../components/ui/BackendStepPage';

export default function DocumentVerificationEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'LENDER-DOCUMENT-V1-DOCUMENT-VERIFICATION-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/document-verification',
  }), [metadata, searchParams]);

  const handleNext = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        searchParams,
        eventType: 'DOCUMENT_VERIFICATION_SUBMITTED',
        formData: {},
        workflowMetadata,
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Document verification failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BackendStepPage
      eyebrow="Lender · Documents"
      title="Document verification"
      description="The lender verifies the submitted documents. No document result is produced in the browser."
      checks={[
        'The lender checks the documents against the application.',
        'It returns the authoritative verification result.',
        'The loan service resolves the next workflow step.',
      ]}
      processingTitle="Verifying the documents"
      processingDescription="The lender is checking the submitted documents."
      processingSteps={[
        'Sending the verification request',
        'Waiting for the document result',
        'Resolving the next workflow step',
      ]}
      submitLabel="Submit documents for verification"
      loadingLabel="Verifying…"
      submitting={submitting}
      error={error}
      hint="The verification starts only after you submit."
      onBack={() => navigate(-1)}
      onSubmit={handleNext}
    />
  );
}
