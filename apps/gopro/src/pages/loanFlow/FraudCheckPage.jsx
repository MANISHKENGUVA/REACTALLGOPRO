import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { publicErrorMessage } from '../../utils/security';
import BackendStepPage from '../../components/ui/BackendStepPage';

export default function FraudCheckPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'LENDER-FRAUD-V1-FRAUD-CHECK-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/fraud-check',
  }), [metadata, searchParams]);

  const handleNext = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'FRAUD_CHECK_SUBMITTED',
        formData: {
          fraudCheckRequested: true,
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/cibil-check',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Failed to submit the fraud-check request. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BackendStepPage
      eyebrow="Lender · Fraud"
      title="Fraud detection check"
      description="Fraud screening is performed by the lender. No clean or pass result is generated in the browser."
      checks={[
        'The application is screened by the lender fraud service.',
        'The service returns the authoritative fraud result.',
        'The loan service decides whether a manager review is required.',
      ]}
      processingTitle="Running the fraud screening"
      processingDescription="The lender fraud service is screening the application."
      processingSteps={[
        'Sending the screening request',
        'Waiting for the fraud result',
        'Resolving the next workflow step',
      ]}
      submitLabel="Submit fraud check"
      loadingLabel="Screening…"
      submitting={submitting}
      error={error}
      hint="The screening starts only after you submit."
      onBack={() => navigate(-1)}
      onSubmit={handleNext}
    />
  );
}
