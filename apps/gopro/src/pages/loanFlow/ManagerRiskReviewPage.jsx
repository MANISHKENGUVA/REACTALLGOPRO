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

export default function ManagerRiskReviewPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [remarks, setRemarks] = useState('');
  const [decision, setDecision] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'MANAGER-REVIEW-V1-RISK-REVIEW-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/manager-risk-review',
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
        eventType: 'MANAGER_RISK_REVIEW_DECISION',
        formData: { decision: nextDecision, remarks },
        workflowMetadata,
        fallbackRoute: '/loan-flow/manager-approval',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'We could not record the risk review decision. Please try again.'));
      setSubmitting(false);
      setDecision('');
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Manager · Risk review"
        title="Risk assessment review"
        description="A manual manager decision is required for this risk review. The assessment shown to reviewers is supplied by the loan service."
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

        <InlineAlert tone="warning" title="Backend-requested risk review">
          <p>
            Risk signals, assessment details and any exception reasons are supplied by the loan
            service. They are not calculated or inferred in this browser.
          </p>
        </InlineAlert>

        <FormSection
          title="Review notes"
          description="Optional notes are sent with the decision for the audit record."
        >
          <TextArea
            id="manager-risk-remarks"
            name="remarks"
            label="Risk mitigation remarks"
            hint="Describe any mitigation considered for this decision."
            value={remarks}
            rows={4}
            onChange={(event) => setRemarks(event.target.value)}
            disabled={submitting}
          />
        </FormSection>

        <InlineAlert tone="info" title="Manager authorization">
          <p>
            The loan service verifies your manager role and the current application state before
            accepting this decision.
          </p>
        </InlineAlert>

        <FormActions
          primary={(
            <>
              <AUBUTTON
                variant="primary"
                onClick={() => handleDecision('APPROVED')}
                disabled={submitting}
                loading={submitting && decision === 'APPROVED'}
                loadingText="Approving…"
              >
                Approve risk override
              </AUBUTTON>
              <AUBUTTON
                variant="danger"
                onClick={() => handleDecision('REJECTED')}
                disabled={submitting}
                loading={submitting && decision === 'REJECTED'}
                loadingText="Rejecting…"
              >
                Reject risk override
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
