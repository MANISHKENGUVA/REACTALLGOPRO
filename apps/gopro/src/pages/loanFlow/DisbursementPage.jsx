import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { publicErrorMessage } from '../../utils/security';
import BackendStepPage from '../../components/ui/BackendStepPage';

export default function DisbursementPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'DISBURSEMENT-PAYMENT-V1-LOAN-DISBURSEMENT-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/disbursement',
  }), [metadata, searchParams]);

  const handleDashboard = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'DISBURSEMENT_CONFIRMED',
        formData: {
          disbursementConfirmationRequested: true,
        },
        workflowMetadata,
        fallbackRoute: '/',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Failed to confirm the disbursement status. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BackendStepPage
      eyebrow="Borrower · Disbursement"
      title="Loan disbursement"
      description="Disbursement status is maintained by the lender. Amount, bank confirmation and transaction references are never generated in the browser."
      checks={[
        'Bank-account verification and payout status are checked by the loan service.',
        'The lender decides whether disbursement succeeded or failed.',
        'The final result is shown on the state supplied by the backend.',
      ]}
      processingTitle="Confirming disbursement status"
      processingDescription="The loan service is retrieving the authoritative disbursement result."
      processingSteps={[
        'Checking the payout status',
        'Waiting for the lender response',
        'Resolving the final workflow state',
      ]}
      submitLabel="Confirm disbursement status"
      loadingLabel="Confirming…"
      submitting={submitting}
      error={error}
      hint="No progress percentage is shown because the browser cannot know the lender's status."
      onBack={() => navigate(-1)}
      onSubmit={handleDashboard}
    />
  );
}
