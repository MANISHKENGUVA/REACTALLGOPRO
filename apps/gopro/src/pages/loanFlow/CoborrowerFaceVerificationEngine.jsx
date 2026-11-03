import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { EventPublisher } from '../../workflow/EventPublisher';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import ProcessingPanel from '../../components/ui/ProcessingPanel';

export default function CoborrowerFaceVerificationEngine({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'COBORROWER-KYC-V1-FACE-VERIFICATION-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/coborrower-face-verification',
  }), [metadata, searchParams]);

  const handleCapture = async () => {
    setSubmitting(true);
    setError('');
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        searchParams,
        eventType: 'FACE_VERIFICATION_SUBMITTED',
        formData: {},
        workflowMetadata,
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Face verification failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Co-borrower · KYC"
        title="Co-borrower face verification"
        description="The identity service performs liveness and face-match checks for the co-borrower."
      />

      <AUCARD className="loan-flow-card">
        {error ? (
          <InlineAlert tone="error" title="We could not request the face verification">
            <p>{error}</p>
          </InlineAlert>
        ) : null}

        {submitting ? (
          <ProcessingPanel
            title="Requesting co-borrower face verification"
            description="The identity service is checking liveness and comparing the co-borrower's face with their identity documents."
            steps={[
              'Sending the request to the identity service',
              'Waiting for the liveness and face-match result',
              'Resolving the next workflow step',
            ]}
          />
        ) : (
          <FormSection
            title="What the loan service checks"
            description="No image, score or pass/fail result is generated in the browser."
          >
            <ul className="gp-stack--tight">
              <li>The identity service confirms liveness and performs the face match.</li>
              <li>The check uses the co-borrower identity documents already submitted.</li>
              <li>The loan service decides whether the co-borrower KYC step passes or fails.</li>
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
            onClick={handleCapture}
          >
            Start face verification
          </AUBUTTON>
        </FormActions>
      </AUCARD>
    </div>
  );
}
