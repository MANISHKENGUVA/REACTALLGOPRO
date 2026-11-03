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
import OtpField from '../../components/ui/OtpField';

export default function ESignPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'LENDER-AGREEMENT-V1-ESIGN-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/esign',
  }), [metadata, searchParams]);

  const handleVerify = async (event) => {
    event?.preventDefault?.();
    if (!/^\d{4,6}$/.test(otp)) {
      setFieldError('Enter the numeric e-sign OTP issued by the e-sign service.');
      return;
    }

    setFieldError('');
    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'ESIGN_COMPLETED',
        formData: { otp },
        workflowMetadata,
        fallbackRoute: '/loan-flow/bank-details',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'E-sign verification failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Lender · Agreement"
        title="Aadhaar e-sign verification"
        description="Enter the one-time code issued by the Aadhaar e-sign service to sign the agreement."
      />

      <AUCARD className="loan-flow-card">
        {error ? (
          <InlineAlert tone="error" title="We could not complete the e-sign">
            <p>{error}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleVerify} noValidate>
          <FormSection title="Sign the agreement">
            <InlineAlert tone="info" title="Where the code comes from">
              <p>
                The e-sign code is issued by the Aadhaar e-sign service, not by this page. Request
                it through that service, then enter it below. The loan service verifies the code
                and records the signature.
              </p>
            </InlineAlert>

            <div className="gp-form-grid gp-form-grid--single">
              <OtpField
                id="esign-otp"
                name="otp"
                label="E-sign verification code"
                hint="4 to 6 digits. The code is not stored in the browser after verification."
                length={6}
                value={otp}
                onValueChange={(value) => {
                  setOtp(value);
                  setFieldError('');
                  setError('');
                }}
                error={fieldError}
                autoComplete="one-time-code"
              />
            </div>
          </FormSection>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint={fieldError ? 'Check the verification code above.' : 'The signature exists only after the e-sign service confirms it.'}
          >
            <AUBUTTON type="submit" variant="primary" disabled={submitting} loading={submitting} loadingText="Verifying…">
              Verify and complete e-sign
            </AUBUTTON>
          </FormActions>
        </form>
      </AUCARD>
    </div>
  );
}
