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

export default function FaceVerificationPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-KYC-V1-FACE-VERIFICATION-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/face-verification',
  }), [metadata, searchParams]);

  const handleNext = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'FACE_VERIFICATION_SUBMITTED',
        formData: {
          verificationResultAsked: true,
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/verification-pending',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Failed to submit the face verification request. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · KYC"
        title="Face verification"
        description="The identity service performs liveness and face-match checks. No score or result is produced in the browser."
      />

      <AUCARD className="loan-flow-card">
        {error ? (
          <InlineAlert tone="error" title="We could not request the face verification">
            <p>{error}</p>
          </InlineAlert>
        ) : null}

        {submitting ? (
          <ProcessingPanel
            title="Requesting face verification"
            description="The identity service is checking liveness and comparing the face with the identity documents."
            steps={[
              'Sending the request to the identity service',
              'Waiting for the liveness and face-match result',
              'Resolving the next workflow step',
            ]}
          />
        ) : (
          <FormSection
            title="What the loan service checks"
            description="The backend identity service is the only source of the verification result."
          >
            <ul className="gp-stack--tight">
              <li>Liveness is confirmed by the identity service, not by this page.</li>
              <li>The face match is compared against the submitted identity documents.</li>
              <li>The loan service decides the next workflow step from the result.</li>
            </ul>
          </FormSection>
        )}

        <FormActions
          secondary={(
            <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
              Back
            </AUBUTTON>
          )}
          hint={submitting ? 'Waiting for the identity service…' : 'The check starts only after you submit.'}
        >
          <AUBUTTON
            variant="primary"
            disabled={submitting}
            loading={submitting}
            loadingText="Verifying…"
            onClick={handleNext}
          >
            Submit face verification
          </AUBUTTON>
        </FormActions>
      </AUCARD>
    </div>
  );
}
