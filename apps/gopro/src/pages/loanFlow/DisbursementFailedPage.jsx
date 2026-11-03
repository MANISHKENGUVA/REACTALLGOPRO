import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { publicErrorMessage } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import StatusHero from '../../components/ui/StatusHero';
import InlineAlert from '../../components/ui/InlineAlert';
import FormActions from '../../components/ui/FormActions';

export default function DisbursementFailedPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'LENDER-DISBURSEMENT-V1-DISBURSEMENT-FAILED-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/disbursement-failed',
  }), [metadata, searchParams]);

  const handleRetry = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'RETRY_DISBURSEMENT',
        formData: {},
        workflowMetadata,
        fallbackRoute: '/loan-flow/disbursement',
      });
    } catch (submitError) {
      setError(publicErrorMessage(submitError, 'Failed to submit the retry request. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · Disbursement"
        title="Disbursement failed"
        description="The backend reported that the disbursement attempt did not succeed."
      />

      <AUCARD className="loan-flow-card">
        {error ? (
          <InlineAlert tone="error" title="We could not submit the retry">
            <p>{error}</p>
          </InlineAlert>
        ) : null}

        <StatusHero tone="danger" title="The transfer did not complete">
          <p>Failure details are provided by the backend. Check the bank details or retry the request.</p>
        </StatusHero>

        <InlineAlert tone="info" title="Before retrying">
          <p>
            If the account details were wrong, go back and update them first. Retrying sends a new
            disbursement request to the loan service; it does not move money from this page.
          </p>
        </InlineAlert>

        <FormActions
          secondary={(
            <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
              Update bank details
            </AUBUTTON>
          )}
          hint="A retry is a new backend request and may take time to settle."
        >
          <AUBUTTON variant="primary" onClick={handleRetry} disabled={submitting} loading={submitting} loadingText="Retrying…">
            Retry transfer
          </AUBUTTON>
        </FormActions>
      </AUCARD>
    </div>
  );
}
