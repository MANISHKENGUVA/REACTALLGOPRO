import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCHECKBOX, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { EventPublisher } from '../../workflow/EventPublisher';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';

export default function LoanConsentPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-CONSENT-V1-LOAN-CONSENT-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/loan-consent',
  }), [metadata, searchParams]);

  const handleChange = (event) => {
    setAgreed(event.target.checked);
    setErrors({});
  };

  const handleNext = async (event) => {
    event?.preventDefault?.();
    if (!agreed) {
      setErrors({ agreed: 'Accept the consent terms to continue.' });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        searchParams,
        eventType: 'CONSENT_SUBMITTED',
        formData: { agreed },
        workflowMetadata,
      });
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Failed to submit consent. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · Consent"
        title="Application consent"
        description="Review and accept the declarations that allow the lender to verify your details and assess this application."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not record your consent">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection
            title="Terms and consent declarations"
            description="Read all three declarations before accepting."
          >
            <ol className="gp-stack--tight">
              <li>
                I authorise the institution to fetch credit bureau reports and verify the identity
                details provided in this application.
              </li>
              <li>
                I confirm that the financial and personal disclosures made during this application
                are true and accurate.
              </li>
              <li>
                I consent to receiving communication by SMS, email and WhatsApp about application
                updates.
              </li>
            </ol>
          </FormSection>

          <div>
            <AUCHECKBOX
              id="loan-consent-agreed"
              name="agreed"
              checked={agreed}
              onChange={handleChange}
              label="I have read and agree to all the terms and consent declarations above."
            />
            {errors.agreed ? (
              <p className="gp-field-error" role="alert">{errors.agreed}</p>
            ) : null}
          </div>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint={errors.agreed ? 'Tick the consent checkbox to continue.' : 'Consent is recorded only after the loan service accepts it.'}
          >
            <AUBUTTON type="submit" variant="primary" disabled={submitting} loading={submitting} loadingText="Submitting…">
              Accept and continue
            </AUBUTTON>
          </FormActions>
        </form>
      </AUCARD>
    </div>
  );
}
