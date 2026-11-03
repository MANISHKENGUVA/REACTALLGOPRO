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
import RadioGroup from '../../components/ui/RadioGroup';
import StatusBadge from '../../components/ui/StatusBadge';
import SummaryList from '../../components/ui/SummaryList';

const DECISION_OPTIONS = [
  {
    value: 'approved',
    label: 'Approve application',
    description: 'The loan service records the approval and calculates the final sanction terms.',
  },
  {
    value: 'rejected',
    label: 'Reject application',
    description: 'The loan service records the rejection and closes the application at this stage.',
  },
];

export default function ManagerApprovalPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [decision, setDecision] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/manager-approval',
  }), [metadata, searchParams]);

  const handleDecisionChange = (event) => {
    setDecision(event.target.value);
    setErrors((prev) => ({ ...prev, decision: '' }));
  };

  const handleNext = async () => {
    if (!decision) {
      setErrors({ decision: 'Select an approval decision before submitting.' });
      return;
    }

    setErrors({});
    setSubmitting(true);
    const fallbackRoute = decision === 'approved'
      ? '/loan-flow/disbursement'
      : '/loan-flow/rejected';

    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'MANAGER_APPROVAL_SUBMITTED',
        formData: {
          approvalStatus: decision,
          approvalDecision: decision,
        },
        workflowMetadata,
        fallbackRoute,
      });
    } catch (err) {
      setErrors({ submit: publicErrorMessage(err, 'We could not record the manager decision. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Manager · Final approval"
        title="Final approval"
        description="Review the application and record the final manager decision. The loan service verifies your manager role and owns the resulting sanction terms."
        meta={(
          <>
            <StatusBadge tone="warning">Decision required</StatusBadge>
            <StatusBadge tone="neutral">Manager only</StatusBadge>
          </>
        )}
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="Decision not recorded">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form
          className="gp-stack"
          onSubmit={(event) => {
            event.preventDefault();
            handleNext();
          }}
          noValidate
        >
          <FormSection
            title="Approval outcome"
            description="Choose one outcome. The loan service records the decision against the signed-in manager."
          >
            <RadioGroup
              id="manager-approval-decision"
              name="approvalDecision"
              legend="Final approval decision"
              required
              options={DECISION_OPTIONS}
              value={decision}
              onChange={handleDecisionChange}
              error={errors.decision || ''}
            />
          </FormSection>

          <FormSection title="Decision details">
            <SummaryList
              items={[
                { label: 'Review owner', value: 'Authorized credit manager' },
                { label: 'Sanction terms', value: 'Calculated by the loan service after approval' },
                {
                  label: 'Next step',
                  value: decision === 'approved'
                    ? 'Disbursement review'
                    : decision === 'rejected'
                      ? 'Application closed as rejected'
                      : 'Determined after the decision is recorded',
                },
              ]}
            />
          </FormSection>

          <InlineAlert tone="warning" title="Irreversible decision">
            <p>
              Submitting records the final approval or rejection for this application. It cannot
              be changed from this screen.
            </p>
          </InlineAlert>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
                Back
              </AUBUTTON>
            )}
            hint="The loan service must confirm the signed-in manager before accepting the decision."
          >
            <AUBUTTON
              type="submit"
              variant={decision === 'rejected' ? 'danger' : 'primary'}
              disabled={submitting}
              loading={submitting}
              loadingText="Recording decision…"
            >
              {decision === 'rejected'
                ? 'Record rejection'
                : decision === 'approved'
                  ? 'Record approval'
                  : 'Submit decision'}
            </AUBUTTON>
          </FormActions>
        </form>
      </AUCARD>
    </div>
  );
}
