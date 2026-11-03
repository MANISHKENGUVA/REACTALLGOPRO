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

export default function ManagerEligibilityReviewPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [remarks, setRemarks] = useState('');
  const [decision, setDecision] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'MANAGER-REVIEW-V1-ELIGIBILITY-REVIEW-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/manager-eligibility-review',
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
        eventType: 'MANAGER_ELIGIBILITY_DECISION',
        formData: { decision: nextDecision, remarks },
        workflowMetadata,
        fallbackRoute: '/loan-flow/underwriter-review',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'We could not record the eligibility decision. Please try again.'));
      setSubmitting(false);
      setDecision('');
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Manager · Eligibility"
        title="Eligibility review"
        description="The loan service requested a manual eligibility review. Record whether the application may proceed despite the flagged eligibility outcome."
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

        <InlineAlert tone="warning" title="Backend-requested eligibility review">
          <p>
            Eligibility factors and any exception reasons are supplied by the loan service. They
            are not calculated or inferred in this browser.
          </p>
        </InlineAlert>

        <FormSection
          title="Review notes"
          description="Optional notes are sent with the decision for the audit record."
        >
          <TextArea
            id="manager-eligibility-remarks"
            name="remarks"
            label="Eligibility decision rationale"
            hint="Describe the reason for the override or rejection."
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
                Approve eligibility override
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
