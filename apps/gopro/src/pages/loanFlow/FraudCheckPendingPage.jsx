import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
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

export default function FraudCheckPendingPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [decision, setDecision] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'MANAGER-FRAUD-CHECK-V1-FRAUD-CHECK-PENDING-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/fraud-check-pending',
  }), [metadata, searchParams]);

  const handleDecision = async (nextDecision) => {
    setError('');
    setDecision(nextDecision);
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'FRAUD_CHECK_PENDING_DECISION',
        formData: { decision: nextDecision, remarks },
        workflowMetadata,
        fallbackRoute: '/loan-flow/manager-approval',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Failed to submit the fraud review decision. Please try again.'));
      setSubmitting(false);
      setDecision('');
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Manager · Fraud review"
        title="Post-offer fraud check pending"
        description="The backend placed this application in a post-offer fraud review and requires a manager decision."
        meta={<StatusBadge tone="warning">Decision required</StatusBadge>}
      />

      <AUCARD className="loan-flow-card">
        {error ? (
          <InlineAlert tone="error" title="We could not record the decision">
            <p>{error}</p>
          </InlineAlert>
        ) : null}

        <FormSection
          title="Fraud audit remarks"
          description="Remarks are optional, but they are sent with the decision for the audit record."
        >
          <TextArea
            id="fraud-audit-remarks"
            name="remarks"
            label="Audit remarks"
            hint="Describe the checks you performed or the reason for the decision."
            value={remarks}
            rows={4}
            onChange={(event) => setRemarks(event.target.value)}
          />
        </FormSection>

        <InlineAlert tone="warning" title="Irreversible workflow decision">
          <p>
            Clearing the flag passes the application. Rejecting it ends this application at the
            fraud review step. The loan service applies the decision.
          </p>
        </InlineAlert>

        <FormActions
          secondary={(
            <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
              Back
            </AUBUTTON>
          )}
          hint="Both decisions are recorded against your manager account."
        >
          <AUBUTTON
            variant="primary"
            onClick={() => handleDecision('APPROVED')}
            disabled={submitting}
            loading={submitting && decision === 'APPROVED'}
            loadingText="Clearing…"
          >
            Clear fraud flag and pass
          </AUBUTTON>
          <AUBUTTON
            variant="danger"
            onClick={() => handleDecision('REJECTED')}
            disabled={submitting}
            loading={submitting && decision === 'REJECTED'}
            loadingText="Rejecting…"
          >
            Reject due to fraud
          </AUBUTTON>
        </FormActions>
      </AUCARD>
    </div>
  );
}
