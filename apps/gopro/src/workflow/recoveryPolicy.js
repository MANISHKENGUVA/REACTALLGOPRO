import { detectRecoveryGate, normalizeRecoveryChallenge } from './recoveryGates.js';

// The decision "did the recovery attempt succeed?" in one place: no fetch, no
// storage, no import.meta. Losing a session must never turn into a new loan, so
// the only accepted success is a session bound to the workflow that was asked
// for; everything else is an explicit, safe failure. A backend that answers
// with a gate status is not a success either — it is a challenge to render.
const SESSION_ID = /^[A-Za-z0-9][A-Za-z0-9._~-]{5,255}$/;

const asText = (value) => (typeof value === 'string' ? value.trim() : '');

export function judgeRecovery({ requestedWorkflowId = '', requestedActor = '', response = null } = {}) {
  const requested = asText(requestedWorkflowId);
  // No identity in the URL: this really is a new application request.
  if (!requested) return { action: 'create' };

  const data = response?.data ?? response;
  if (!data || typeof data !== 'object') return { action: 'unavailable', reason: 'NO_RESPONSE' };

  const received = asText(data.workflowId);
  // A different application is never a successful recovery of this one, with
  // or without a challenge attached.
  if (received && received !== requested) return { action: 'mismatch', requested, received };

  // The backend says a resume needs a factor first. That is neither success
  // nor failure: the frontend renders exactly the gate it names.
  const gate = detectRecoveryGate(data);
  if (gate) {
    const challenge = normalizeRecoveryChallenge(data, {
      workflowId: requested,
      workflowActor: requestedActor,
    });
    if (gate.kind === 'challenge' || gate.kind === 'identity_unavailable') {
      return { action: 'challenge', requested, received, status: gate.status, challenge };
    }
    if (gate.kind === 'locked') {
      return { action: 'locked', requested, received, reason: gate.status, challenge };
    }
    if (gate.kind === 'expired') {
      return { action: 'expired', requested, received, reason: gate.status, challenge };
    }
    return { action: 'unavailable', reason: gate.status, received };
  }

  if (!received) return { action: 'unavailable', reason: 'NO_WORKFLOW_ID' };

  const sessionId = asText(data.sessionId);
  if (!SESSION_ID.test(sessionId)) return { action: 'unavailable', reason: 'INVALID_SESSION' };

  return { action: 'recovered', requested, sessionId, workflowId: received };
}

// A refused resume is a choice for the user, not an error to swallow: retry, or
// deliberately start a separate application. The backend distinguishes the two
// refusals — 401 RECOVERY_UNAVAILABLE (no, expired or foreign credential) and
// 409 WORKFLOW_MISMATCH (the credential names another application, and has
// already been burnt server-side) — so the UI can say which happened. A gate
// status is forwarded as a challenge instead of being flattened into "no".
export function classifyRecoveryFailure(error, { requestedWorkflowId = '', requestedActor = '' } = {}) {
  const code = asText(error?.payload?.code).toUpperCase();
  // The verified-recovery start endpoint asks for the security check before it
  // will issue a recoveryId. That is a step to render, not a failed resume.
  if (code === 'CAPTCHA_REQUIRED') {
    return { state: 'captcha_required', reason: code };
  }
  if (code === 'CAPTCHA_INVALID') {
    return { state: 'captcha_invalid', reason: code };
  }
  if (error?.status === 409 || code === 'WORKFLOW_MISMATCH') {
    return { state: 'mismatch', reason: code || 'WORKFLOW_MISMATCH' };
  }

  const gate = detectRecoveryGate(error?.payload);
  if (gate) {
    const challenge = normalizeRecoveryChallenge(error.payload, {
      workflowId: requestedWorkflowId,
      workflowActor: requestedActor,
    });
    if (gate.kind === 'challenge' || gate.kind === 'identity_unavailable') {
      return { state: 'challenge', reason: gate.status, challenge };
    }
    if (gate.kind === 'locked') return { state: 'locked', reason: gate.status, challenge };
    if (gate.kind === 'expired') return { state: 'expired', reason: gate.status, challenge };
    return { state: 'unavailable', reason: gate.status };
  }

  if (code) return { state: 'unavailable', reason: code };
  return { state: 'unavailable', reason: error?.status ? `HTTP_${error.status}` : 'UNREACHABLE' };
}
