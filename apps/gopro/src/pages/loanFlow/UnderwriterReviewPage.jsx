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
    description: 'The loan service records the underwriting approval and moves the application to manager review.',
  },
  {
    value: 'rejected',
    label: 'Reject application',
    description: 'The loan service records the underwriting rejection and closes the application at this stage.',
  },
];

export default function UnderwriterReviewPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [decision, setDecision] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'UNDERWRITER-REVIEW-V1-UNDERWRITER-CHECK-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/underwriter-review',
  }), [metadata, searchParams]);

  const handleDecisionChange = (event) => {
    setDecision(event.target.value);
    setErrors((prev) => ({ ...prev, decision: '' }));
  };

  const handleNext = async () => {
    if (!decision) {
      setErrors({ decision: 'Select an underwriting decision before submitting.' });
      return;
    }

    setErrors({});
    setSubmitting(true);
    const fallbackRoute = decision === 'approved'
      ? '/loan-flow/manager-approval'
      : '/loan-flow/rejected';

    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'UNDERWRITER_REVIEW_DECISION',
        formData: {
          decision: decision === 'approved' ? 'APPROVED' : 'REJECTED',
          reviewDecision: decision,
        },
        workflowMetadata,
        fallbackRoute,
      });
    } catch (err) {
      setErrors({ submit: publicErrorMessage(err, 'We could not record the underwriting decision. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Underwriter · Manual review"
        title="Underwriter review"
        description="Record the manual underwriting outcome. Recommendation amounts and final terms are calculated and enforced by the loan service."
        meta={(
          <>
            <StatusBadge tone="warning">Decision required</StatusBadge>
            <StatusBadge tone="neutral">Underwriter only</StatusBadge>
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
            title="Underwriting outcome"
            description="Choose one outcome. The loan service checks the signed-in actor and the current application state before accepting it."
          >
            <RadioGroup
              id="underwriter-review-decision"
              name="reviewDecision"
              legend="Underwriting decision"
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
                { label: 'Review owner', value: 'Authorized underwriter' },
                { label: 'Final terms', value: 'Remain controlled by the loan service' },
                {
                  label: 'Next step',
                  value: decision === 'approved'
                    ? 'Manager final approval'
                    : decision === 'rejected'
                      ? 'Application closed as rejected'
                      : 'Determined after the decision is recorded',
                },
              ]}
            />
          </FormSection>

          <InlineAlert tone="warning" title="Irreversible decision">
            <p>
              Submitting records the underwriting outcome for this application. It cannot be
              changed from this screen.
            </p>
          </InlineAlert>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
                Back
              </AUBUTTON>
            )}
            hint="The loan service must confirm the signed-in actor before accepting the decision."
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
