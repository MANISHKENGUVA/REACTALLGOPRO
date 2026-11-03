import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUSELECT, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { publicErrorMessage } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import SummaryList from '../../components/ui/SummaryList';

const AUTH_MODE_LABELS = {
  netbanking: 'Net banking',
  debitcard: 'Debit card',
  aadhaar: 'Aadhaar OTP',
};

export default function MandateSetupPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [authMode, setAuthMode] = useState('netbanking');
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'LENDER-MANDATE-V1-MANDATE-SETUP-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/mandate-setup',
  }), [metadata, searchParams]);

  const handleNext = async (event) => {
    event?.preventDefault?.();
    if (!AUTH_MODE_LABELS[authMode]) {
      setError('Select an authentication method.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'MANDATE_REGISTERED',
        formData: { authMode },
        workflowMetadata,
        fallbackRoute: '/loan-flow/disbursement',
      });
    } catch (err) {
      setError(publicErrorMessage(err, 'Mandate registration failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Lender · Mandate"
        title="Automated payment mandate"
        description="Choose how you want to authenticate the recurring repayment mandate."
      />

      <AUCARD className="loan-flow-card">
        {error ? (
          <InlineAlert tone="error" title="We could not register the mandate">
            <p>{error}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection
            title="Authentication method"
            description="The mandate becomes active only after the bank or payment provider confirms it."
          >
            <div className="gp-form-grid gp-form-grid--single">
              <AUSELECT
                label="Authentication method"
                name="authMode"
                value={authMode}
                onChange={(event) => {
                  setAuthMode(event.target.value);
                  setError('');
                }}
                options={[
                  { label: 'Net banking', value: 'netbanking' },
                  { label: 'Debit card', value: 'debitcard' },
                  { label: 'Aadhaar OTP', value: 'aadhaar' },
                ]}
                required
              />
            </div>
          </FormSection>

          <FormSection title="Selected method">
            <SummaryList
              tight
              items={[
                { id: 'method', label: 'Authentication method', value: AUTH_MODE_LABELS[authMode] || '' },
              ]}
            />
          </FormSection>

          <InlineAlert tone="info" title="What happens next">
            <p>
              The loan service registers the mandate with the payment provider using the method
              selected above. Recurring repayments begin only after that registration succeeds.
            </p>
          </InlineAlert>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint="You can change the authentication method before continuing."
          >
            <AUBUTTON type="submit" variant="primary" disabled={submitting} loading={submitting} loadingText="Submitting…">
              Authorize mandate and continue
            </AUBUTTON>
          </FormActions>
        </form>
      </AUCARD>
    </div>
  );
}
