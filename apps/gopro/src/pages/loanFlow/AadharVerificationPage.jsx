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

export default function AadharVerificationPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-KYC-V1-AADHAR-VERIFICATION-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/aadhar-verification',
  }), [metadata, searchParams]);

  const handleNext = async () => {
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'AADHAR_VERIFICATION_COMPLETED',
        formData: {
          verificationRequested: true,
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/employment-info',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Failed to submit the Aadhaar verification request. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · KYC"
        title="Aadhaar verification"
        description="The loan service checks Aadhaar validity and mobile linkage with its identity provider."
      />

      <AUCARD className="loan-flow-card">
        {error ? (
          <InlineAlert tone="error" title="We could not request the verification">
            <p>{error}</p>
          </InlineAlert>
        ) : null}

        {submitting ? (
          <ProcessingPanel
            title="Requesting Aadhaar verification"
            description="The identity provider is checking Aadhaar validity and mobile linkage. The result is returned by the loan service."
            steps={[
              'Sending the verification request',
              'Waiting for the identity provider',
              'Resolving the next workflow step',
            ]}
          />
        ) : (
          <FormSection
            title="What the loan service checks"
            description="No verification result is produced in the browser."
          >
            <ul className="gp-stack--tight">
              <li>Aadhaar validity and mobile-number linkage are checked by the identity provider.</li>
              <li>The loan service decides whether this KYC step passes or fails.</li>
              <li>Your Aadhaar details are sent only to the configured workflow service.</li>
            </ul>
          </FormSection>
        )}

        <FormActions
          secondary={(
            <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
              Back
            </AUBUTTON>
          )}
          hint={submitting ? 'Waiting for the loan service…' : 'The check starts only after you submit.'}
        >
          <AUBUTTON
            variant="primary"
            disabled={submitting}
            loading={submitting}
            loadingText="Verifying…"
            onClick={handleNext}
          >
            Submit Aadhaar verification
          </AUBUTTON>
        </FormActions>
      </AUCARD>
    </div>
  );
}
