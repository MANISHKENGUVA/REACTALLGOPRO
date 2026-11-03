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

export default function ManagerDocumentReviewPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [remarks, setRemarks] = useState('');
  const [decision, setDecision] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'MANAGER-REVIEW-V1-DOCUMENT-REVIEW-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/manager-document-review',
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
        eventType: 'MANAGER_DOCUMENT_DECISION',
        formData: { decision: nextDecision, remarks },
        workflowMetadata,
        fallbackRoute: '/loan-flow/risk-assessment',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'We could not record the document review decision. Please try again.'));
      setSubmitting(false);
      setDecision('');
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Manager · Document review"
        title="Document verification review"
        description="The loan service routed this application to a manual document review. Record whether the submitted documents can be accepted."
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

        <InlineAlert tone="warning" title="Backend-requested document review">
          <p>
            Document concerns and case details are supplied by the loan service. They are not
            generated or inferred in this browser.
          </p>
        </InlineAlert>

        <FormSection
          title="Review notes"
          description="Optional notes are sent with the decision for the audit record."
        >
          <TextArea
            id="manager-document-remarks"
            name="remarks"
            label="Document review comments"
            hint="Record which documents were checked and any concerns."
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
                Approve documents
              </AUBUTTON>
              <AUBUTTON
                variant="danger"
                onClick={() => handleDecision('REJECTED')}
                disabled={submitting}
                loading={submitting && decision === 'REJECTED'}
                loadingText="Rejecting…"
              >
                Reject documents
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
