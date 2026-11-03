import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { publicErrorMessage } from '../../utils/security';
import BackendStepPage from '../../components/ui/BackendStepPage';

export default function RiskAssessmentPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'LENDER-RISK-V1-RISK-ASSESSMENT-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/risk-assessment',
  }), [metadata, searchParams]);

  const handleNext = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'RISK_ASSESSMENT_SUBMITTED',
        formData: {
          assessmentRequested: true,
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/underwriter-review',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Failed to submit the risk assessment request. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BackendStepPage
      eyebrow="Lender · Risk"
      title="Risk assessment"
      description="The lender's risk engine performs this assessment. No risk score or decision is calculated in the browser."
      checks={[
        'The lender risk engine evaluates the application.',
        'It returns the authoritative risk decision to the loan service.',
        'The loan service resolves the next workflow step.',
      ]}
      processingTitle="Requesting the risk assessment"
      processingDescription="The lender risk engine is evaluating the application."
      processingSteps={[
        'Sending the assessment request',
        'Waiting for the risk decision',
        'Resolving the next workflow step',
      ]}
      submitLabel="Submit for risk assessment"
      loadingLabel="Assessing…"
      submitting={submitting}
      error={error}
      hint="The assessment starts only after you submit."
      onBack={() => navigate(-1)}
      onSubmit={handleNext}
    />
  );
}
