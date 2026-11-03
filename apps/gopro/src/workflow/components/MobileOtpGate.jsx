import React, { useEffect, useMemo, useRef, useState, useId } from 'react';
import { AUCARD, AUBUTTON, AUINPUT } from 'artiqui/dist/router-engine.es.js';
import {
  countdownSeconds,
  describeRecoveryError,
  formatDuration,
  otpLength as normalizeOtpLength,
} from '../recoveryGates';

// MobileOtpGate: one code, delivered by the backend to the number the backend
// already knows. The masked number is displayed exactly as the service returned
// it; the frontend never invents a number or masks a full one itself.
// The OTP lives in component state only — never in storage, never in a log.
const digitsOnly = (value, length) => String(value || '').replace(/\D/g, '').slice(0, length);

export default function MobileOtpGate({
  challengeId = '',
  issued: issuedProp = false,
  delivery = '',
  sendsRemaining = null,
  otpLength: digits = 6,
  expiresAt = '',
  retryAfterSeconds = 0,
  attemptsRemaining = null,
  devCode = '',
  method = 'MOBILE_OTP',
  busy = false,
  busyLabel = '',
  error = '',
  embedded = false,
  onRequestCode,
  onVerify,
  onCancel,
}) {
  const length = normalizeOtpLength(digits);
  const fieldId = useId();
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const submittingRef = useRef(false);

  // The verified-recovery contract has no per-challenge id; the backend marks
  // the code as issued on the recovery challenge instead.
  const issued = Boolean(challengeId) || issuedProp;
  const noSendsLeft = sendsRemaining !== null && Number(sendsRemaining) <= 0;
  const disabled = Boolean(busy || requesting);

  // One timer drives both the code expiry and the resend cooldown.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // A new code invalidates whatever was typed against the previous one.
  useEffect(() => {
    setOtp('');
    setLocalError('');
    setCooldownUntil(retryAfterSeconds > 0 ? Date.now() + retryAfterSeconds * 1000 : 0);
  }, [challengeId, expiresAt, retryAfterSeconds]);

  const expiresIn = useMemo(() => (expiresAt ? countdownSeconds(expiresAt, now) : 0), [expiresAt, now]);
  const expired = Boolean(expiresAt) && expiresIn <= 0;
  const resendIn = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
  const shownError = localError || error;

  const resend = async () => {
    if (disabled || resendIn > 0 || noSendsLeft) return;
    setRequesting(true);
    setLocalError('');
    try {
      await onRequestCode?.({ method });
      setCooldownUntil(retryAfterSeconds > 0 ? Date.now() + retryAfterSeconds * 1000 : 0);
    } catch (e) {
      setLocalError(describeRecoveryError(e).message);
    } finally {
      setRequesting(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (disabled || submittingRef.current) return;
    if (otp.length !== length) {
      setLocalError(`Enter the ${length}-digit code.`);
      return;
    }
    submittingRef.current = true;
    setLocalError('');
    try {
      await onVerify?.({ challengeId, otp, method });
    } catch (e) {
      setLocalError(describeRecoveryError(e).message);
    } finally {
      submittingRef.current = false;
    }
  };

  const resendLabel = noSendsLeft
    ? 'No codes remaining'
    : requesting
      ? 'Sending…'
      : resendIn > 0
        ? `Resend code in ${formatDuration(resendIn)}`
        : issued ? 'Resend code' : 'Send code';

  const body = (
    <form className="au-gate-form" onSubmit={submit} noValidate>
      <p className="au-gate-text">
        {issued
          ? `We sent a ${length}-digit code to your registered mobile number${delivery ? ` (${delivery})` : ''}.`
          : `We will send a ${length}-digit code to your registered mobile number${delivery ? ` (${delivery})` : ''}.`}
      </p>

      {issued ? (
        <>
          <AUINPUT
            id={fieldId}
            name="recoveryOtp"
            label={`${length}-digit code`}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={length}
            value={otp}
            disabled={disabled}
            onChange={(event) => setOtp(digitsOnly(event.target.value, length))}
            aria-invalid={shownError ? 'true' : undefined}
            aria-describedby={shownError ? `${fieldId}-hint ${fieldId}-error` : `${fieldId}-hint`}
          />
          <p id={`${fieldId}-hint`} className="au-gate-hint">
            {expired
              ? 'This code has expired. Request a new one.'
              : expiresAt
                ? `The code expires in ${formatDuration(expiresIn)}.`
                : 'Enter the code you received.'}
            {attemptsRemaining !== null ? ` Attempts remaining: ${attemptsRemaining}.` : ''}
          </p>
          {devCode ? <p className="au-gate-hint au-gate-hint--warning">{`Development code: ${devCode}`}</p> : null}
          {shownError ? (
            <p id={`${fieldId}-error`} className="au-gate-error" role="alert">{shownError}</p>
          ) : null}
          <p className="au-visually-hidden" role="status">
            {resendIn > 0 ? '' : 'You can request a new code now.'}
          </p>
        </>
      ) : null}

      <div className="au-gate-actions">
        {issued ? (
          <AUBUTTON
            type="submit"
            variant="primary"
            disabled={disabled || otp.length !== length}
            loading={Boolean(busy)}
            loadingText={busyLabel || 'Verifying…'}
          >
            Verify code
          </AUBUTTON>
        ) : null}
        <AUBUTTON
          type="button"
          variant={issued ? 'secondary' : 'primary'}
          onClick={resend}
          disabled={disabled || resendIn > 0}
          loading={requesting && !issued}
          loadingText="Sending…"
        >
          {resendLabel}
        </AUBUTTON>
        {onCancel ? (
          <AUBUTTON type="button" variant="ghost" onClick={onCancel} disabled={disabled}>Cancel</AUBUTTON>
        ) : null}
      </div>
    </form>
  );

  if (embedded) return body;

  return (
    <AUCARD className="loan-flow-card">
      <h2>Mobile verification</h2>
      <p className="au-gate-text">A code is delivered by the service to your registered number.</p>
      {body}
    </AUCARD>
  );
}
