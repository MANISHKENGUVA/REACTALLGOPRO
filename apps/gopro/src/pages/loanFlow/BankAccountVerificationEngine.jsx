import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EventPublisher } from '../../workflow/EventPublisher';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage } from '../../utils/security';
import BackendStepPage from '../../components/ui/BackendStepPage';

export default function BankAccountVerificationEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-BANK-V1-BANK-ACCOUNT-VERIFICATION-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/bank-account-verification',
  }), [metadata, searchParams]);

  const handleContinue = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        searchParams,
        eventType: 'BANK_ACCOUNT_VERIFICATION_SUBMITTED',
        formData: {},
        workflowMetadata,
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Bank account verification failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BackendStepPage
      eyebrow="Borrower · Bank"
      title="Bank account verification"
      description="Account ownership and penny-drop checks are performed by the bank or NPCI integration. No verification status is produced in the browser."
      checks={[
        'The bank confirms that the account belongs to the applicant.',
        'A penny-drop check confirms that the account can receive funds.',
        'The loan service resolves the next workflow step.',
      ]}
      processingTitle="Verifying the bank account"
      processingDescription="The bank is performing the ownership and penny-drop checks."
      processingSteps={[
        'Sending the verification request',
        'Waiting for the bank response',
        'Resolving the next workflow step',
      ]}
      submitLabel="Submit bank account verification"
      loadingLabel="Verifying…"
      submitting={submitting}
      error={error}
      hint="The bank performs the verification only after you submit."
      onBack={() => navigate(-1)}
      onSubmit={handleContinue}
    />
  );
}
