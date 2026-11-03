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
import SummaryList from '../../components/ui/SummaryList';

export default function LoanOfferPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'LENDER-OFFER-V1-LOAN-OFFER-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/loan-offer',
  }), [metadata, searchParams]);

  const handleAccept = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'OFFER_ACCEPTED',
        formData: { accepted: true },
        workflowMetadata,
        fallbackRoute: '/loan-flow/manager-approval',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Failed to submit the offer acceptance. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Lender · Offer"
        title="Sanction offer summary"
        description="Review the sanction parameters supplied by the lender before accepting the offer."
      />

      <AUCARD className="loan-flow-card">
        {error ? (
          <InlineAlert tone="error" title="We could not accept the offer">
            <p>{error}</p>
          </InlineAlert>
        ) : null}

        <FormSection title="Offer parameters">
          <SummaryList
            items={[
              { id: 'amount', label: 'Approved amount', value: 'Backend-provided' },
              { id: 'rate', label: 'Interest rate', value: 'Backend-provided' },
              { id: 'tenure', label: 'Tenure', value: 'Backend-provided' },
              { id: 'emi', label: 'Estimated monthly EMI', value: 'Backend-provided' },
            ]}
          />
        </FormSection>

        <InlineAlert tone="info" title="Values come from the lender">
          <p>
            No amount, rate, tenure or EMI is calculated or confirmed in the browser. Accepting
            sends your decision to the loan service, which decides the next step.
          </p>
        </InlineAlert>

        <FormActions
          secondary={(
            <AUBUTTON type="button" variant="outline" onClick={() => navigate('/')}>
              Decline and return home
            </AUBUTTON>
          )}
          hint="Declining leaves the application without an accepted offer."
        >
          <AUBUTTON onClick={handleAccept} variant="primary" disabled={submitting} loading={submitting} loadingText="Submitting…">
            Accept offer and continue
          </AUBUTTON>
        </FormActions>
      </AUCARD>
    </div>
  );
}
