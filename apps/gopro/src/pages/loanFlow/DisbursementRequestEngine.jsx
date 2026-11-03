import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EventPublisher } from '../../workflow/EventPublisher';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage } from '../../utils/security';
import BackendStepPage from '../../components/ui/BackendStepPage';

export default function DisbursementRequestEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'LENDER-DISBURSEMENT-V1-DISBURSEMENT-REQUEST-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/disbursement-request',
  }), [metadata, searchParams]);

  const handleNext = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        searchParams,
        eventType: 'DISBURSEMENT_REQUEST_SUBMITTED',
        formData: {},
        workflowMetadata,
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Disbursement request failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BackendStepPage
      eyebrow="Lender · Disbursement"
      title="Disbursement request"
      description="The payout request is sent by the lender to its banking gateway. No transfer is initiated in the browser."
      checks={[
        'The lender sends the payout instruction to the banking gateway.',
        'The gateway returns the authoritative disbursement status.',
        'The loan service resolves the next workflow step.',
      ]}
      processingTitle="Sending the payout request"
      processingDescription="The lender is submitting the payout instruction to the banking gateway."
      processingSteps={[
        'Sending the payout instruction',
        'Waiting for the banking gateway',
        'Resolving the next workflow step',
      ]}
      submitLabel="Request disbursement"
      loadingLabel="Requesting…"
      submitting={submitting}
      error={error}
      hint="The payout request is sent only after you submit."
      onBack={() => navigate(-1)}
      onSubmit={handleNext}
    />
  );
}
