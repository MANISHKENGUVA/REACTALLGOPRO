import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EventPublisher } from '../../workflow/EventPublisher';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage } from '../../utils/security';
import BackendStepPage from '../../components/ui/BackendStepPage';

export default function InterestRateEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'LENDER-OFFER-V1-INTEREST-RATE-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/interest-rate',
  }), [metadata, searchParams]);

  const handleNext = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        searchParams,
        eventType: 'INTEREST_RATE_CALCULATED',
        formData: {},
        workflowMetadata,
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Interest-rate calculation failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BackendStepPage
      eyebrow="Lender · Pricing"
      title="Interest rate pricing"
      description="The interest rate is calculated by the lender. It is not displayed until the backend returns it."
      checks={[
        'The lender pricing engine calculates the applicable rate.',
        'The authoritative rate is returned to the loan service.',
        'The loan service resolves the next workflow step.',
      ]}
      processingTitle="Requesting the interest rate"
      processingDescription="The lender pricing engine is calculating the applicable rate."
      processingSteps={[
        'Sending the pricing request',
        'Waiting for the calculated rate',
        'Resolving the next workflow step',
      ]}
      submitLabel="Request interest rate"
      loadingLabel="Calculating…"
      submitting={submitting}
      error={error}
      hint="The browser does not calculate or estimate an interest rate."
      onBack={() => navigate(-1)}
      onSubmit={handleNext}
    />
  );
}
