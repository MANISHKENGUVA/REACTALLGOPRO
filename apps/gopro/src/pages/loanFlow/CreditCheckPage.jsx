import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { publicErrorMessage } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import ProcessingPanel from '../../components/ui/ProcessingPanel';

export default function CreditCheckPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'LENDER-CREDIT-V1-CREDIT-CHECK-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/credit-check',
  }), [metadata, searchParams]);

  const handleNext = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'CREDIT_CHECK_SUBMITTED',
        formData: {
          creditCheckRequested: true,
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/fraud-check',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Failed to submit the credit-check request. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Lender · Credit"
        title="Credit check"
        description="Credit history and score retrieval is performed by the lender's credit-bureau integration. No score is generated in the browser."
      />

      <AUCARD className="loan-flow-card">
        {error ? (
          <InlineAlert tone="error" title="We could not request the credit check">
            <p>{error}</p>
          </InlineAlert>
        ) : null}

        {submitting ? (
          <ProcessingPanel
            title="Requesting the credit check"
            description="The lender is retrieving the authoritative credit-bureau result."
            steps={[
              'Sending the request to the bureau integration',
              'Waiting for the credit score and history',
              'Resolving the next workflow step',
            ]}
          />
        ) : (
          <FormSection
            title="What the credit check covers"
            description="The bureau integration supplies the score and history; this page does not calculate them."
          >
            <ul className="gp-stack--tight">
              <li>The credit score and report are retrieved by the lender.</li>
              <li>The lender decides eligibility and the next workflow step.</li>
              <li>No credit value is estimated or displayed in the browser before the result arrives.</li>
            </ul>
          </FormSection>
        )}

        <FormActions
          secondary={(
            <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
              Back
            </AUBUTTON>
          )}
          hint={submitting ? 'Waiting for the bureau integration…' : 'The check starts only after you submit.'}
        >
          <AUBUTTON
            variant="primary"
            disabled={submitting}
            loading={submitting}
            loadingText="Checking…"
            onClick={handleNext}
          >
            Submit credit check
          </AUBUTTON>
        </FormActions>
      </AUCARD>
    </div>
  );
}
