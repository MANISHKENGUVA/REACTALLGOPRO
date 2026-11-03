import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EventPublisher } from '../../workflow/EventPublisher';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage } from '../../utils/security';
import BackendStepPage from '../../components/ui/BackendStepPage';

export default function EligibilityEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'LENDER-ELIGIBILITY-V1-ELIGIBILITY-CHECK-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/eligibility-check',
  }), [metadata, searchParams]);

  const handleNext = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        searchParams,
        eventType: 'ELIGIBILITY_CHECK_SUBMITTED',
        formData: {},
        workflowMetadata,
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Eligibility evaluation failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BackendStepPage
      eyebrow="Lender · Eligibility"
      title="Eligibility check"
      description="Eligibility limits are calculated by the lender. The browser does not calculate or display a limit before the backend returns one."
      checks={[
        'The lender eligibility matrix evaluates the application.',
        'It returns the authoritative eligibility decision.',
        'The loan service resolves the next workflow step.',
      ]}
      processingTitle="Evaluating eligibility"
      processingDescription="The lender eligibility matrix is evaluating the application."
      processingSteps={[
        'Sending the evaluation request',
        'Waiting for the eligibility decision',
        'Resolving the next workflow step',
      ]}
      submitLabel="Submit eligibility check"
      loadingLabel="Evaluating…"
      submitting={submitting}
      error={error}
      hint="Eligibility is decided by the lender, not by this page."
      onBack={() => navigate(-1)}
      onSubmit={handleNext}
    />
  );
}
