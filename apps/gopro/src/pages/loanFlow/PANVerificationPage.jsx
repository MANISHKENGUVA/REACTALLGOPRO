import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { z } from 'zod';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { publicErrorMessage } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import ProcessingPanel from '../../components/ui/ProcessingPanel';
import {
  clearFieldError,
  panField,
  zodFieldErrors,
} from '../../utils/formValidation';

const formSchema = z.object({
  panNumber: panField(),
});

export default function PANVerificationPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ panNumber: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-KYC-V1-PAN-VERIFICATION-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/pan-verification',
  }), [metadata, searchParams]);

  const handleChange = (event) => {
    const value = event.target.value.toUpperCase().replace(/\s/g, '');
    setFormData({ panNumber: value });
    setErrors((prev) => clearFieldError(clearFieldError(prev, 'panNumber'), 'submit'));
  };

  const handleNext = async (event) => {
    event?.preventDefault?.();
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      setErrors(zodFieldErrors(result.error));
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'PAN_VERIFICATION_COMPLETED',
        formData: {
          panNumber: result.data.panNumber,
          verificationRequested: true,
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/aadhar-verification',
      });
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Failed to submit the PAN verification request. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · KYC"
        title="PAN verification"
        description="The loan service validates your PAN with the tax-authority integration. No verification result is produced in the browser."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not request the verification">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        {submitting ? (
          <ProcessingPanel
            title="Requesting PAN verification"
            description="The loan service is checking the PAN with the tax-authority integration."
            steps={[
              'Sending the PAN to the verification service',
              'Waiting for the authoritative result',
              'Resolving the next workflow step',
            ]}
          />
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection
            title="PAN details"
            description="Enter the PAN exactly as printed on the card. It is sent only to the configured workflow service."
          >
            <div className="gp-form-grid gp-form-grid--single">
              <AUINPUT
                type="text"
                label="PAN number"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                autoComplete="off"
                maxLength={10}
                error={errors.panNumber || ''}
                required
              />
            </div>
          </FormSection>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint={errors.panNumber ? 'Check the PAN format above.' : 'The check starts only after you submit.'}
          >
            <AUBUTTON type="submit" variant="primary" disabled={submitting} loading={submitting} loadingText="Verifying…">
              Submit PAN verification
            </AUBUTTON>
          </FormActions>
        </form>
      </AUCARD>
    </div>
  );
}
