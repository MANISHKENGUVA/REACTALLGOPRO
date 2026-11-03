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
import TextArea from '../../components/ui/TextArea';
import StatusBadge from '../../components/ui/StatusBadge';

export default function ManagerFraudReviewPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [remarks, setRemarks] = useState('');
  const [decision, setDecision] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'MANAGER-FRAUD-CHECK-V1-FRAUD-CHECK-PENDING-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/manager-fraud-review',
  }), [metadata, searchParams]);

  const handleDecision = async (nextDecision) => {
    if (submitting) return;
    setError('');
    setDecision(nextDecision);
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'MANAGER_FRAUD_DECISION',
        formData: { decision: nextDecision, remarks },
        workflowMetadata,
        fallbackRoute: '/loan-flow/document-upload',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'We could not record the fraud review decision. Please try again.'));
      setSubmitting(false);
      setDecision('');
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Manager · Fraud review"
        title="Fraud review"
        description="The loan service routed this application to a manual fraud review. Record whether the fraud flag can be cleared or the application must be rejected."
        meta={(
          <>
            <StatusBadge tone="warning">Decision required</StatusBadge>
            <StatusBadge tone="neutral">Manager only</StatusBadge>
          </>
        )}
      />

      <AUCARD className="loan-flow-card">
        {error ? (
          <InlineAlert tone="error" title="Decision not recorded">
            <p>{error}</p>
          </InlineAlert>
        ) : null}

        <InlineAlert tone="warning" title="Backend-requested fraud review">
          <p>
            Fraud signals and case details are supplied by the loan service. They are not
            generated or inferred in this browser.
          </p>
        </InlineAlert>

        <FormSection
          title="Review notes"
          description="Optional notes are sent with the decision for the audit record."
        >
          <TextArea
            id="manager-fraud-remarks"
            name="remarks"
            label="Verification remarks"
            hint="Describe the checks you performed or the reason for the decision."
            value={remarks}
            rows={4}
            onChange={(event) => setRemarks(event.target.value)}
            disabled={submitting}
          />
        </FormSection>

        <InlineAlert tone="warning" title="Irreversible workflow decision">
          <p>
            Clearing the flag allows the application to continue. Rejecting ends this application
            at the fraud review step. The loan service applies the decision.
          </p>
        </InlineAlert>

        <FormActions
          primary={(
            <>
              <AUBUTTON
                variant="primary"
                onClick={() => handleDecision('CLEAR')}
                disabled={submitting}
                loading={submitting && decision === 'CLEAR'}
                loadingText="Clearing…"
              >
                Mark fraud flag clear
              </AUBUTTON>
              <AUBUTTON
                variant="danger"
                onClick={() => handleDecision('REJECTED')}
                disabled={submitting}
                loading={submitting && decision === 'REJECTED'}
                loadingText="Rejecting…"
              >
                Reject application
              </AUBUTTON>
            </>
          )}
          secondary={(
            <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
              Back
            </AUBUTTON>
          )}
          hint="The decision is recorded against your manager account."
        />
      </AUCARD>
    </div>
  );
}
