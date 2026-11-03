import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EventPublisher } from '../../workflow/EventPublisher';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage } from '../../utils/security';
import BackendStepPage from '../../components/ui/BackendStepPage';

export default function DisbursementConfirmationEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'LENDER-DISBURSEMENT-V1-DISBURSEMENT-CONFIRMATION-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/disbursement-confirmation',
  }), [metadata, searchParams]);

  const handleNext = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        searchParams,
        eventType: 'DISBURSEMENT_CONFIRMED',
        formData: {},
        workflowMetadata,
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Disbursement confirmation failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BackendStepPage
      eyebrow="Lender · Disbursement"
      title="Disbursement confirmation"
      description="The payout status and transaction reference are supplied by the lender. Nothing is generated in the browser."
      checks={[
        'The lender retrieves the disbursement status from the banking gateway.',
        'The transaction reference and payout status come from the backend.',
        'The loan service resolves the final workflow state.',
      ]}
      processingTitle="Requesting disbursement confirmation"
      processingDescription="The lender is retrieving the authoritative payout status."
      processingSteps={[
        'Requesting the payout status',
        'Waiting for the transaction reference',
        'Resolving the final workflow state',
      ]}
      submitLabel="Confirm disbursement status"
      loadingLabel="Confirming…"
      submitting={submitting}
      error={error}
      hint="The status is read from the lender; it is never assumed by this page."
      onBack={() => navigate(-1)}
      onSubmit={handleNext}
    />
  );
}
