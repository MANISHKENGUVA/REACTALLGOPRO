import React, { useState } from 'react';
import { AUCARD, AUBUTTON, AUCHECKBOX } from 'artiqui/dist/router-engine.es.js';
import { factorLabel, safeIdentityRedirect } from '../recoveryGates';
import { GateNotice, GateUnavailable } from './GateStates';

// IdentityVerificationGate: a provider-neutral container. It never verifies
// anything itself — it opens the flow the backend configured, and treats only
// a backend answer as success. No identity number is collected here, and no
// provider SDK is invented: a mode this build cannot run says so and offers the
// methods the backend listed as alternatives.
const UNAVAILABLE_COPY = {
  NOT_CONFIGURED: 'No identity provider is configured for this application.',
  PROVIDER_UNAVAILABLE: 'The identity provider is currently unavailable.',
  SDK_NOT_BUNDLED: 'This build does not include the provider\'s embedded verification flow.',
  UNSUPPORTED_MODE: 'The verification flow configured by the service is not supported by this build.',
  UNSAFE_REDIRECT: 'The service returned a verification link that cannot be opened safely.',
};

export default function IdentityVerificationGate({
  identity = {},
  status = 'idle',
  busy = false,
  error = '',
  alternatives = [],
  embedded = false,
  onStart,
  onCheck,
  onRetry,
  onUseAlternative,
  onCancel,
}) {
  const [consent, setConsent] = useState(false);
  const [localError, setLocalError] = useState('');
  const [opening, setOpening] = useState(false);

  const provider = identity.provider || 'the identity provider';
  // The parent owns the phase; this gate never promotes a verification itself.
  const view = status;
  const disabled = Boolean(busy || opening);
  const shownError = localError || error;
  const consentText = identity.consentText
    || `I agree to share the result of this verification from ${provider} with the lender for this application.`;

  const start = async () => {
    if (disabled) return;
    setLocalError('');
    if (!consent) {
      setLocalError('Please accept the consent statement to continue.');
      return;
    }
    const target = safeIdentityRedirect(identity.url);
    if (!target) {
      setLocalError('The verification link from the service cannot be opened safely.');
      return;
    }
    setOpening(true);
    try {
      await onStart?.({ provider: identity.provider, mode: identity.mode });
      // Only the URL the backend supplied is followed, and only after it has
      // been re-validated here.
      window.location.assign(target);
    } catch (e) {
      setOpening(false);
      setLocalError(e?.message || 'The verification could not be started. Please try again.');
    }
  };

  const check = async () => {
    setLocalError('');
    try {
      // The parent asks the backend; this gate never promotes the session.
      await onCheck?.();
    } catch (e) {
      setLocalError(e?.message || 'The verification status could not be checked. Please try again.');
    }
  };

  let content;

  if (!identity.available) {
    content = (
      <GateUnavailable
        title="Identity verification is not available"
        message={UNAVAILABLE_COPY[identity.reason] || UNAVAILABLE_COPY.NOT_CONFIGURED}
        onRetry={onRetry}
        retryLabel="Check again"
        onCancel={onCancel}
        busy={disabled}
      >
        {alternatives.length ? (
          <div className="au-gate-alternatives">
            <p className="au-gate-hint">The service offers these alternatives:</p>
            {alternatives.map((factor) => (
              <AUBUTTON
                key={factor.id}
                variant="outline"
                onClick={() => onUseAlternative?.(factor)}
                disabled={disabled}
              >
                {`Use ${factorLabel(factor.kind)}`}
              </AUBUTTON>
            ))}
          </div>
        ) : (
          <p className="au-gate-hint">No alternative verification method was offered for this step.</p>
        )}
      </GateUnavailable>
    );
  } else if (view === 'success') {
    content = <GateNotice tone="success" title="Verification confirmed">The service confirmed the identity verification.</GateNotice>;
  } else if (view === 'pending') {
    content = (
      <>
        <p className="au-gate-text">
          {`Finish the verification with ${provider}, then come back to this page. The service decides whether it was successful.`}
        </p>
        {shownError ? <p className="au-gate-error" role="alert">{shownError}</p> : null}
        <div className="au-gate-actions">
          <AUBUTTON variant="primary" onClick={check} disabled={disabled} loading={Boolean(busy)} loadingText="Checking…">
            I have finished — check status
          </AUBUTTON>
          <AUBUTTON variant="ghost" onClick={onCancel} disabled={disabled}>Cancel</AUBUTTON>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <p className="au-gate-text">
          {`You will be redirected to ${provider} to complete the verification, then returned to this application.`}
        </p>
        {view === 'cancelled' ? (
          <GateNotice tone="warning" title="Verification was cancelled">You can start the verification again.</GateNotice>
        ) : null}
        {view === 'failed' ? (
          <GateNotice tone="error" title="Verification was not completed">Try again, or use another method the service offers.</GateNotice>
        ) : null}
        {view === 'expired' ? (
          <GateNotice tone="warning" title="Verification expired">Start the verification again to continue.</GateNotice>
        ) : null}
        <AUCHECKBOX
          id="identity-consent"
          name="identityConsent"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          disabled={disabled}
          label={consentText}
        />
        {shownError ? <p className="au-gate-error" role="alert">{shownError}</p> : null}
        <div className="au-gate-actions">
          <AUBUTTON
            variant="primary"
            onClick={start}
            disabled={disabled || !consent}
            loading={opening}
            loadingText="Opening…"
          >
            {view === 'idle' ? 'Start verification' : 'Start again'}
          </AUBUTTON>
          {view === 'idle' ? null : (
            <AUBUTTON variant="secondary" onClick={check} disabled={disabled}>
              Check status
            </AUBUTTON>
          )}
          <AUBUTTON variant="ghost" onClick={onCancel} disabled={disabled}>Cancel</AUBUTTON>
        </div>
      </>
    );
  }

  if (embedded) return content;

  return (
    <AUCARD className="loan-flow-card">
      <h2>Identity verification</h2>
      {identity.mode === 'REDIRECT' ? (
        <p className="au-gate-text">A verified provider confirms your identity; the service stores the result.</p>
      ) : null}
      {content}
    </AUCARD>
  );
}
