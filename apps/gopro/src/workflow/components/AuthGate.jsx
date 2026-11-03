import React, { useEffect, useState } from 'react';
import { AUCARD, AUBUTTON, AUINPUT, AUSELECT } from 'artiqui/dist/router-engine.es.js';
import { publicErrorMessage } from '../../utils/security';
import { factorKind, otpLength as normalizeOtpLength } from '../recoveryGates';
import MobileOtpGate from './MobileOtpGate';

// AuthGate: rendered ONLY when backend returns AUTHENTICATION_REQUIRED.
// The backend owns both the method list and the code delivery, so this is a
// two-phase UI: ask for a challenge, then verify the code the user typed.
// Nothing here decides that a user is authenticated — only /auth/verify does.
// The mobile step is the same MobileOtpGate the recovery flow uses, so there is
// one OTP implementation, not two.
const OTP_PATTERN = /^\d{4,8}$/;
const AADHAAR_PATTERN = /^\d{12}$/;

export default function AuthGate({ methods = [], onVerify, verifying, expired = false }) {
  const available = Array.isArray(methods) ? methods : [];
  const [method, setMethod] = useState(available[0] || '');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [challenge, setChallenge] = useState(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const disabled = Boolean(verifying || busy);
  const kind = factorKind(method);

  // A verification that was issued before the actor session expired cannot be
  // reused. Drop it and make the user request a fresh challenge.
  useEffect(() => {
    if (!expired) return;
    setChallenge(null);
    setOtp('');
    setError('');
  }, [expired]);

  const requestCode = async () => {
    if (!available.length) {
      setError('The backend did not provide an authentication method.');
      return null;
    }
    if (!method) {
      setError('Select an authentication method.');
      return null;
    }
    if (kind === 'IDENTITY' && !AADHAAR_PATTERN.test(aadhaarNumber)) {
      setError('Enter the 12-digit Aadhaar number.');
      return null;
    }
    setError('');
    setBusy(true);
    try {
      const result = await onVerify?.({
        method,
        ...(kind === 'IDENTITY' && aadhaarNumber ? { aadhaarNumber } : {}),
      });
      if (result?.authenticated) return result;
      if (!result?.challengeId) {
        setError('The backend did not return a verification challenge. Please retry the step.');
        return null;
      }
      setChallenge(result);
      setOtp('');
      return result;
    } catch (e) {
      setError(publicErrorMessage(e, 'We could not send a verification code. Please try again.'));
      return null;
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async (code = otp) => {
    if (!OTP_PATTERN.test(code)) {
      setError('Enter the code you received.');
      return null;
    }
    setError('');
    setBusy(true);
    try {
      const result = await onVerify?.({ challengeId: challenge.challengeId, otp: code });
      // Only the backend promotes the session. An unclear answer keeps the gate
      // up with an explicit message instead of a silent no-op.
      if (result && result.authenticated !== true) {
        setError('That code is incorrect. Please try again.');
      }
      return result;
    } catch (e) {
      // A wrong code answers 401, same status as an expired session. On the
      // gate the meaning is unambiguous: the code was not accepted.
      if (Number(e?.status) === 401) {
        setError('That code is incorrect. Please try again.');
      } else {
        setError(publicErrorMessage(e, 'We could not verify that code. Please try again.'));
      }
      return null;
    } finally {
      setBusy(false);
    }
  };

  const startOver = () => {
    setChallenge(null);
    setOtp('');
    setError('');
  };

  const header = (
    <>
      <p className="au-gate-text">
        The next step needs actor authentication. You were not asked to log in globally —
        this prompt appears only because the backend requires it for this node.
      </p>
      {expired ? (
        <p className="au-gate-hint au-gate-hint--warning" role="status">
          Your verified actor session expired. Verify again to continue. The application
          and the work already saved are unchanged.
        </p>
      ) : null}
    </>
  );

  if (!available.length) {
    return (
      <AUCARD className="loan-flow-card">
        <h2>Authentication Required</h2>
        {header}
        <p className="au-gate-error">
          Retry the step to request the supported authentication methods from the backend.
        </p>
      </AUCARD>
    );
  }

  if (challenge && kind === 'MOBILE_OTP') {
    return (
      <AUCARD className="loan-flow-card">
        <h2>Authentication Required</h2>
        {header}
        <MobileOtpGate
          embedded
          challengeId={challenge.challengeId}
          delivery={challenge.delivery}
          otpLength={normalizeOtpLength(challenge.raw?.otpLength)}
          expiresAt={challenge.expiresAt}
          retryAfterSeconds={Number(challenge.raw?.retryAfterSeconds) || 0}
          devCode={challenge.devCode}
          method={method}
          busy={disabled}
          error={error}
          onRequestCode={requestCode}
          onVerify={({ otp: code }) => submitCode(code)}
        />
        <div className="au-gate-actions">
          <AUBUTTON variant="ghost" onClick={startOver} disabled={disabled}>Use a different method</AUBUTTON>
        </div>
      </AUCARD>
    );
  }

  return (
    <AUCARD className="loan-flow-card">
      <h2>Authentication Required</h2>
      {header}

      {!challenge ? (
        <>
          {available.length > 1 ? (
            <AUSELECT
              label="Authentication method"
              name="authMethod"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              options={available.map((m) => ({ label: m, value: m }))}
            />
          ) : null}
          {kind === 'IDENTITY' ? (
            <div style={{ marginTop: '12px' }}>
              <AUINPUT
                type="text"
                inputMode="numeric"
                label="Aadhaar number"
                name="aadhaarNumber"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                placeholder="12-digit Aadhaar number"
                autoComplete="off"
              />
            </div>
          ) : null}
          {kind === 'UNSUPPORTED' ? (
            <p className="au-gate-error">
              {`This build cannot display the authentication method ${method}. Please retry the step.`}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <p className="au-gate-hint">
            A verification code was sent to {challenge.delivery || challenge.method || 'your registered device'}.
          </p>
          {challenge.devCode ? (
            <p className="au-gate-hint au-gate-hint--warning">{`Development code: ${challenge.devCode}`}</p>
          ) : null}
          <AUINPUT
            type="text"
            inputMode="numeric"
            label="Verification code"
            name="authOtp"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="Enter the code"
            autoComplete="one-time-code"
          />
        </>
      )}

      {error ? <p className="au-gate-error" role="alert">{error}</p> : null}

      <div className="au-gate-actions">
        {challenge ? (
          <>
            <AUBUTTON variant="primary" onClick={() => submitCode()} disabled={disabled} loading={disabled} loadingText="Verifying…">
              Verify code
            </AUBUTTON>
            <AUBUTTON variant="secondary" onClick={startOver} disabled={disabled}>Send a new code</AUBUTTON>
          </>
        ) : (
          <AUBUTTON
            variant="primary"
            onClick={requestCode}
            disabled={disabled || kind === 'UNSUPPORTED'}
            loading={disabled}
            loadingText="Requesting..."
          >
            Send code
          </AUBUTTON>
        )}
      </div>
    </AUCARD>
  );
}
