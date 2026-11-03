import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD, AUBUTTON, AUCHECKBOX } from 'artiqui/dist/router-engine.es.js';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { publicErrorMessage } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';

export default function BorrowerCreditCheckPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [consentGiven, setConsentGiven] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-CREDIT-V1-CREDIT-CHECK-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/borrower-credit-check',
  }), [metadata, searchParams]);

  const handleSubmit = async (event) => {
    event?.preventDefault?.();
    if (!consentGiven) {
      setErrors({ consent: 'Give consent before the credit bureau check can start.' });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'BORROWER_CREDIT_CHECK_SUBMITTED',
        formData: {
          'CREDIT.borrower.consentGiven': true,
          consentGiven: true,
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/credit-check',
      });
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Failed to record your consent. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · Credit"
        title="Credit bureau consent"
        description="Authorise the lender to retrieve your credit score and history from credit registries."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not record your consent">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleSubmit} noValidate>
          <FormSection
            title="Consent to a credit bureau check"
            description="The bureau result is supplied by the lender's credit-bureau integration."
          >
            <p>
              I authorise the lender to fetch my credit bureau score and credit report from
              CIBIL, Experian or another credit registry used by the lender.
            </p>
            <AUCHECKBOX
              id="borrower-credit-consent"
              name="consent"
              checked={consentGiven}
              onChange={(event) => {
                setConsentGiven(event.target.checked);
                setErrors({});
              }}
              label="I give consent to the credit bureau check."
            />
            {errors.consent ? <p className="gp-field-error" role="alert">{errors.consent}</p> : null}
          </FormSection>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint={errors.consent ? 'Tick the consent checkbox to continue.' : 'The bureau pull starts only after you give consent.'}
          >
            <AUBUTTON type="submit" variant="primary" disabled={submitting} loading={submitting} loadingText="Requesting…">
              Authorize credit check
            </AUBUTTON>
          </FormActions>
        </form>
      </AUCARD>
    </div>
  );
}
