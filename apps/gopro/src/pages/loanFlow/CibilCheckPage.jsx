import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { publicErrorMessage } from '../../utils/security';
import BackendStepPage from '../../components/ui/BackendStepPage';

export default function CibilCheckPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'RISKENGINE-CIBIL-V1-CIBIL-CHECK-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/cibil-check',
  }), [metadata, searchParams]);

  const handleNext = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'CIBIL_CHECK_SUBMITTED',
        formData: {
          cibilCheckRequested: true,
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/risk-assessment',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Failed to submit the CIBIL check request. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BackendStepPage
      eyebrow="Lender · CIBIL"
      title="CIBIL score check"
      description="The credit bureau lookup is performed by the lender. No CIBIL score is generated or asserted in the browser."
      checks={[
        'The lender requests the credit-bureau score and history.',
        'The bureau returns the authoritative result to the loan service.',
        'The loan service resolves the next workflow step.',
      ]}
      processingTitle="Requesting the CIBIL check"
      processingDescription="The lender is waiting for the credit-bureau response."
      processingSteps={[
        'Sending the lookup request',
        'Waiting for the CIBIL response',
        'Resolving the next workflow step',
      ]}
      submitLabel="Submit CIBIL check"
      loadingLabel="Checking…"
      submitting={submitting}
      error={error}
      hint="The bureau lookup starts only after you submit."
      onBack={() => navigate(-1)}
      onSubmit={handleNext}
    />
  );
}
