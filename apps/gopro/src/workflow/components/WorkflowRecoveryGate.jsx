import React from 'react';
import { AUCARD, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { nextFactor } from '../recoveryGates';
import RecoveryStatus from './RecoveryStatus';
import MobileOtpGate from './MobileOtpGate';
import IdentityVerificationGate from './IdentityVerificationGate';
import CaptchaGate from './CaptchaGate';
import { GateLoading, GateUnavailable } from './GateStates';

// WorkflowRecoveryGate: renders exactly the verification the backend asked for,
// in the order the backend listed. It never chooses a factor, never promotes a
// session, and keeps the original workflow identity on screen while the user
// proves the link belongs to them.
export default function WorkflowRecoveryGate({
  recovery,
  onRequestCode,
  onVerifyCode,
  onVerifyCaptcha,
  onStartIdentity,
  onCheckIdentity,
  onUseAlternative,
  onRestart,
  onCancel,
}) {
  const challenge = recovery.challenge;
  const busy = recovery.busy;
  const completing = busy === 'recover';
  const locked = Boolean(busy);

  if (recovery.state === 'expired') {
    return (
      <AUCARD className="loan-flow-card">
        <h2>This verification expired</h2>
        <p className="au-gate-text" role="alert">
          The service no longer accepts the verification that was in progress. The application is unchanged.
        </p>
        <div className="au-gate-actions">
          <AUBUTTON variant="primary" onClick={onRestart} disabled={locked} loading={locked} loadingText="Starting…">
            Start a new verification
          </AUBUTTON>
          <AUBUTTON variant="ghost" onClick={onCancel} disabled={locked}>Cancel</AUBUTTON>
        </div>
      </AUCARD>
    );
  }

  if (!challenge) {
    return (
      <AUCARD className="loan-flow-card">
        <h2>Confirm your application</h2>
        <GateUnavailable
          title="No verification was issued"
          message="The service did not return a verification challenge for this link."
          onRetry={onRestart}
          onCancel={onCancel}
          busy={locked}
        />
      </AUCARD>
    );
  }

  const factors = challenge.factors || [];
  const active = nextFactor(factors, recovery.completed);

  if (!factors.length) {
    return (
      <AUCARD className="loan-flow-card">
        <h2>Confirm your application</h2>
        <GateUnavailable
          title="Verification method missing"
          message="The service did not specify which verification is required, so this step cannot be shown."
          onRetry={onRestart}
          onCancel={onCancel}
          busy={locked}
        />
      </AUCARD>
    );
  }

  if (!active) {
    return (
      <AUCARD className="loan-flow-card">
        <h2>Confirm your application</h2>
        <RecoveryStatus factors={factors} completed={recovery.completed} workflowId={challenge.workflowId} />
        <GateLoading title="Completing recovery…" description="Waiting for the service to confirm." />
      </AUCARD>
    );
  }

  const needsSession = active.kind === 'MOBILE_OTP' || active.kind === 'CAPTCHA';
  if (needsSession && !challenge.sessionId) {
    return (
      <AUCARD className="loan-flow-card">
        <h2>Confirm your application</h2>
        <RecoveryStatus factors={factors} completed={recovery.completed} workflowId={challenge.workflowId} />
        <GateUnavailable
          title="Verification session missing"
          message="The service did not provide a session for this verification, so it cannot be completed here."
          onRetry={onRestart}
          onCancel={onCancel}
          busy={locked}
        />
      </AUCARD>
    );
  }

  let gate = null;

  if (active.kind === 'MOBILE_OTP') {
    gate = (
      <MobileOtpGate
        embedded
        challengeId={challenge.challengeId}
        delivery={challenge.delivery}
        otpLength={challenge.otpLength}
        expiresAt={challenge.expiresAt}
        retryAfterSeconds={challenge.retryAfterSeconds}
        attemptsRemaining={challenge.attemptsRemaining}
        devCode={challenge.devCode}
        method={active.method}
        busy={busy === 'otp-verify' || busy === 'otp-request'}
        busyLabel={busy === 'otp-verify' ? 'Verifying…' : 'Sending…'}
        error={recovery.error}
        onRequestCode={onRequestCode}
        onVerify={(payload) => onVerifyCode({ ...payload, factorId: active.id })}
        onCancel={onCancel}
      />
    );
  } else if (active.kind === 'IDENTITY') {
    gate = (
      <IdentityVerificationGate
        embedded
        identity={challenge.identity}
        alternatives={challenge.alternatives}
        busy={busy === 'identity'}
        error={recovery.error}
        onStart={onStartIdentity}
        onCheck={() => onCheckIdentity({ factorId: active.id })}
        onRetry={onRestart}
        onUseAlternative={onUseAlternative}
        onCancel={onCancel}
      />
    );
  } else if (active.kind === 'CAPTCHA') {
    gate = (
      <CaptchaGate
        embedded
        captcha={challenge.captcha}
        verifying={busy === 'captcha'}
        onVerify={(payload) => onVerifyCaptcha({ ...payload, factorId: active.id })}
        onRetry={onRestart}
      />
    );
  } else {
    gate = (
      <GateUnavailable
        title="Verification method not supported"
        message={`The service requires ${active.method || 'a verification method'} that this build cannot display.`}
        onRetry={onRestart}
        onCancel={onCancel}
        busy={locked}
      />
    );
  }

  const showFooterCancel = active.kind === 'CAPTCHA' || active.kind === 'UNSUPPORTED';

  return (
    <AUCARD className="loan-flow-card">
      <h2>Confirm it&apos;s you</h2>
      <p className="au-gate-text">
        This link belongs to an application that needs a fresh verification before it can be opened.
        Your application is not restarted.
      </p>
      <RecoveryStatus
        factors={factors}
        completed={recovery.completed}
        workflowId={challenge.workflowId}
        busyLabel={completing ? 'Completing recovery…' : ''}
      />
      {gate}
      {showFooterCancel ? (
        <div className="au-gate-actions">
          <AUBUTTON variant="ghost" onClick={onCancel} disabled={locked}>Cancel</AUBUTTON>
        </div>
      ) : null}
    </AUCARD>
  );
}
