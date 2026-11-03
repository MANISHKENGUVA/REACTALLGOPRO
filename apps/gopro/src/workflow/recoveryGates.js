// Backend-driven recovery gates.
//
// Everything in this module is pure: no fetch, no storage, no import.meta, so
// the whole "which gate does the backend want next" rule set can be
// regression-tested with `node --test`. The backend owns the policy and the
// factor order; this module only translates its answer into UI state. It never
// promotes a session, never generates a credential, and never masks a number
// the backend did not already mask.

import { normalizeActor, sanitizeSessionId, sanitizeWorkflowId } from '../utils/security.js';

const asText = (value) => (typeof value === 'string' ? value.trim() : '');
const asStatus = (value) => asText(value).toUpperCase();
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function methodList(value) {
  if (!Array.isArray(value)) return [];
  const methods = [];
  for (const entry of value) {
    const method = asStatus(entry).replace(/[\s-]+/g, '_');
    if (method && !methods.includes(method)) methods.push(method);
  }
  return methods;
}

// A status is authoritative. These are the only statuses that mean "the resume
// cannot complete on its own"; everything else is judged by judgeRecovery().
const GATE_BY_STATUS = Object.freeze({
  AUTHENTICATION_REQUIRED: 'challenge',
  CAPTCHA_REQUIRED: 'challenge',
  MFA_REQUIRED: 'challenge',
  RECOVERY_REQUIRED: 'challenge',
  IDENTITY_VERIFICATION_REQUIRED: 'challenge',
  IDENTITY_PROVIDER_UNAVAILABLE: 'identity_unavailable',
  RECOVERY_CHALLENGE_EXPIRED: 'expired',
  CHALLENGE_EXPIRED: 'expired',
  OTP_EXPIRED: 'expired',
  RECOVERY_ATTEMPTS_EXCEEDED: 'locked',
  ATTEMPTS_EXCEEDED: 'locked',
  OTP_ATTEMPTS_EXCEEDED: 'locked',
  SESSION_EXPIRED: 'session_invalid',
  SESSION_INVALID: 'session_invalid',
  INVALID_SESSION: 'session_invalid',
});

const MOBILE_METHODS = new Set(['MOBILE_OTP', 'OTP', 'SMS_OTP', 'MOBILE', 'SMS', 'TOTP']);
const IDENTITY_METHODS = new Set([
  'AADHAAR',
  'AADHAAR_OTP',
  'IDENTITY',
  'IDENTITY_VERIFICATION',
  'DIGILOCKER',
  'CKYC',
  'VIDEO_KYC',
  'PAN',
]);
const CAPTCHA_METHODS = new Set(['CAPTCHA', 'RECAPTCHA']);

// reCAPTCHA v2 (explicit render) is the only version the backend contract
// supports. A version we cannot render must fail closed, not fall back.
export const SUPPORTED_CAPTCHA_VERSIONS = Object.freeze(['v2']);

export const MIN_OTP_DIGITS = 4;
export const MAX_OTP_DIGITS = 8;
export const DEFAULT_OTP_DIGITS = 6;

const EXPIRED_CODES = new Set([
  'OTP_EXPIRED',
  'CHALLENGE_EXPIRED',
  'RECOVERY_CHALLENGE_EXPIRED',
  'RECOVERY_NOT_ACTIVE',
  'RECOVERY_ALREADY_COMPLETED',
  'EXPIRED_OTP',
  'CODE_EXPIRED',
]);
const USED_CODES = new Set([
  'OTP_ALREADY_USED',
  'OTP_USED',
  'CODE_ALREADY_USED',
  'CHALLENGE_USED',
  'RECOVERY_CODE_USED',
]);
const LOCKED_CODES = new Set([
  'RECOVERY_ATTEMPTS_EXCEEDED',
  'ATTEMPTS_EXCEEDED',
  'OTP_ATTEMPTS_EXCEEDED',
  'MAX_ATTEMPTS_EXCEEDED',
  'ACCOUNT_LOCKED',
  'RECOVERY_LOCKED',
]);
const RATE_LIMIT_CODES = new Set(['RATE_LIMITED', 'TOO_MANY_REQUESTS', 'RATE_LIMIT_EXCEEDED']);
const INVALID_CODES = new Set([
  'OTP_INVALID',
  'INVALID_OTP',
  'INVALID_CODE',
  'CODE_INVALID',
  'INCORRECT_OTP',
  'RECOVERY_CODE_INCORRECT',
]);
const CAPTCHA_REQUIRED_CODES = new Set(['CAPTCHA_REQUIRED']);
const CAPTCHA_INVALID_CODES = new Set(['CAPTCHA_INVALID']);
const PROVIDER_CODES = new Set([
  'AUTH_GATEWAY_NOT_CONFIGURED',
  'IDENTITY_PROVIDER_UNAVAILABLE',
  'PROVIDER_UNAVAILABLE',
  'OTP_DELIVERY_FAILED',
]);

export function detectRecoveryGate(payload) {
  const data = payload?.data ?? payload;
  if (!data || typeof data !== 'object') return null;

  const status = asStatus(data.status);
  const kind = GATE_BY_STATUS[status];
  if (kind) return { kind, status };

  // `status` is authoritative: an OK payload never becomes a gate because a
  // hint field says so. Only a payload with no status at all can be gated by
  // an explicit backend requirement — a missing status is never success.
  if (status) return null;

  if (data.recovery?.required === true) return { kind: 'challenge', status: 'RECOVERY_REQUIRED' };
  if (data.authentication?.required === true) return { kind: 'challenge', status: 'AUTHENTICATION_REQUIRED' };
  if (data.captcha?.required === true) return { kind: 'challenge', status: 'CAPTCHA_REQUIRED' };
  return null;
}

export function factorKind(method) {
  const value = asStatus(method).replace(/[\s-]+/g, '_');
  if (CAPTCHA_METHODS.has(value)) return 'CAPTCHA';
  if (IDENTITY_METHODS.has(value)) return 'IDENTITY';
  if (MOBILE_METHODS.has(value)) return 'MOBILE_OTP';
  return 'UNSUPPORTED';
}

export function normalizeCaptcha(value) {
  const raw = value && typeof value === 'object' ? value : {};
  return {
    version: asText(raw.version) || '',
    siteKey: asText(raw.siteKey) || '',
    required: raw.required === true,
    bypassed: raw.bypassed === true,
  };
}

// A provider redirect is only ever followed when the backend supplied an
// absolute HTTPS URL for a named provider. Nothing here is derived locally.
export function safeIdentityRedirect(value) {
  const text = asText(value);
  if (!text || text.length > 2048) return '';
  let url;
  try {
    url = new URL(text);
  } catch {
    return '';
  }
  if (url.protocol !== 'https:') return '';
  if (url.username || url.password) return '';
  return url.toString();
}

export function normalizeIdentity(payload) {
  const data = payload?.data ?? payload ?? {};
  const raw = data.identity && typeof data.identity === 'object'
    ? data.identity
    : data.identityVerification && typeof data.identityVerification === 'object'
      ? data.identityVerification
      : {};
  const mode = asStatus(raw.mode);
  const provider = asText(raw.provider);
  const url = safeIdentityRedirect(raw.url || raw.redirectUrl);
  const consentText = asText(raw.consentText || raw.consent);

  let reason = '';
  if (raw.available === false) reason = 'PROVIDER_UNAVAILABLE';
  else if (!provider) reason = 'NOT_CONFIGURED';
  else if (mode === 'REDIRECT' && !url) reason = 'UNSAFE_REDIRECT';
  // This build ships no provider SDK, so an embedded flow cannot be started
  // without inventing one. Fail closed and let the backend offer alternatives.
  else if (mode !== 'REDIRECT') reason = mode === 'EMBEDDED' ? 'SDK_NOT_BUNDLED' : 'UNSUPPORTED_MODE';

  return {
    provider,
    mode,
    url,
    consentText,
    reason,
    available: reason === '',
  };
}

// Only a value the backend already masked is rendered. A bare digit run is a
// full number and must never reach the screen.
export function safeMaskedDelivery(value) {
  const text = asText(value);
  if (!text || text.length > 40) return '';
  if (!/[*•·xX]/.test(text)) return '';
  if (/\d{7,}/.test(text)) return '';
  if (!/\d{2,}/.test(text)) return '';
  return text;
}

export function otpLength(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) return DEFAULT_OTP_DIGITS;
  return Math.min(MAX_OTP_DIGITS, Math.max(MIN_OTP_DIGITS, parsed));
}

function positiveInteger(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function integerOrNull(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function factorFrom(entry) {
  const method = typeof entry === 'string' ? entry : asText(entry?.method || entry?.id);
  const normalized = asStatus(method).replace(/[\s-]+/g, '_');
  if (!normalized) return null;
  return {
    id: normalized,
    method: normalized,
    kind: factorKind(normalized),
    required: entry?.required !== false,
  };
}

function declaredFactors(payload) {
  const data = payload?.data ?? payload ?? {};
  const declared = Array.isArray(data.recovery?.factors)
    ? data.recovery.factors
    : Array.isArray(data.factors)
      ? data.factors
      : null;
  if (declared) return declared;
  // The verified-recovery contract names the plan `requiredMethods`; older
  // gates used `authentication.methods`. Both are the backend's order.
  if (Array.isArray(data.requiredMethods)) return data.requiredMethods;
  if (Array.isArray(data.authentication?.methods)) return data.authentication.methods;
  if (Array.isArray(data.auth?.methods)) return data.auth.methods;
  return [];
}

// The plan is the backend's order. No factor is prepended or reordered here.
export function buildRecoveryFactors(payload) {
  const data = payload?.data ?? payload ?? {};
  const factors = [];
  const seen = new Set();
  for (const entry of declaredFactors(data)) {
    const factor = factorFrom(entry);
    if (!factor || seen.has(factor.id)) continue;
    seen.add(factor.id);
    factors.push(factor);
  }
  const captcha = normalizeCaptcha(data.captcha);
  if (captcha.required && !factors.some((factor) => factor.kind === 'CAPTCHA')) {
    factors.push({ id: 'CAPTCHA', method: 'CAPTCHA', kind: 'CAPTCHA', required: true });
  }
  return factors;
}

// Methods the backend allows instead of an unavailable factor. Absent means
// "no alternative" — the UI must not invent one.
export function buildAlternatives(payload) {
  const data = payload?.data ?? payload ?? {};
  const raw = Array.isArray(data.recovery?.alternatives)
    ? data.recovery.alternatives
    : Array.isArray(data.authentication?.alternatives)
      ? data.authentication.alternatives
      : [];
  const alternatives = [];
  const seen = new Set();
  for (const entry of raw) {
    const factor = factorFrom(entry);
    if (!factor || factor.kind === 'UNSUPPORTED' || seen.has(factor.id)) continue;
    seen.add(factor.id);
    alternatives.push(factor);
  }
  return alternatives;
}

const FACTOR_LABELS = Object.freeze({
  MOBILE_OTP: 'Mobile verification',
  IDENTITY: 'Identity verification',
  CAPTCHA: 'Security check',
  UNSUPPORTED: 'Additional verification',
});

export function factorLabel(kind) {
  return FACTOR_LABELS[asStatus(kind)] || FACTOR_LABELS.UNSUPPORTED;
}

export function nextFactor(factors = [], completed = []) {
  const done = new Set(completed);
  return factors.find((factor) => !done.has(factor.id)) || null;
}

export function isPlanComplete(factors = [], completed = []) {
  return factors.length > 0 && nextFactor(factors, completed) === null;
}

// The backend never returns the destination number in clear text. A generic
// phrase is safe to show; a bare digit run is not, even if a future response
// changes shape.
function safeSentTo(value) {
  const text = asText(value);
  if (!text || text.length > 80) return '';
  if (/\d{7,}/.test(text)) return '';
  return text;
}

function deliveryChannel(value) {
  const channel = asStatus(value);
  return ['GATEWAY', 'RESPONSE', 'LOG'].includes(channel) ? channel : '';
}

export function normalizeRecoveryChallenge(payload, { workflowId = '', workflowActor = '' } = {}) {
  const data = payload?.data ?? payload;
  const source = data && typeof data === 'object' ? data : {};
  const factors = buildRecoveryFactors(source);
  const verified = methodList(
    source.verifiedMethods ||
    source.verified ||
    source.authentication?.verifiedMethods,
  );
  // Completion is only ever what the backend already confirmed. A method that
  // is not part of this plan is ignored rather than added to the progress list.
  const completed = verified.filter((method) => factors.some((factor) => factor.id === method));
  return {
    workflowId: sanitizeWorkflowId(source.workflowId) || sanitizeWorkflowId(workflowId),
    workflowActor: normalizeActor(source.workflowActor || source.actor) || normalizeActor(workflowActor),
    sessionId: sanitizeSessionId(source.sessionId || source.session?.sessionId),
    // The verified-recovery flow has no session until `complete`; this id is
    // the only handle the factor endpoints accept.
    recoveryId: UUID.test(asText(source.recoveryId)) ? asText(source.recoveryId) : '',
    challengeId: asText(source.challengeId || source.challenge?.challengeId),
    status: asStatus(source.status),
    factors,
    alternatives: buildAlternatives(source),
    completed,
    nextStep: asStatus(source.nextStep),
    missingMethods: methodList(source.missingMethods),
    delivery: safeMaskedDelivery(
      source.delivery ||
      source.maskedMobile ||
      source.mobile ||
      source.authentication?.delivery,
    ),
    deliveryChannel: deliveryChannel(source.delivery),
    sentTo: safeSentTo(source.sentTo),
    sendsRemaining: integerOrNull(source.sendsRemaining),
    codeIssued: source.codeIssued === true,
    preflight: source.preflight === true,
    otpLength: otpLength(source.otpLength ?? source.authentication?.otpLength),
    expiresAt: asText(source.expiresAt || source.authentication?.expiresAt || source.challenge?.expiresAt),
    retryAfterSeconds: positiveInteger(
      source.retryAfterSeconds ?? source.resendAfterSeconds ?? source.authentication?.retryAfterSeconds,
    ),
    attemptsRemaining: integerOrNull(source.attemptsRemaining ?? source.attemptsLeft),
    identity: normalizeIdentity(source),
    captcha: normalizeCaptcha(source.captcha),
    message: asText(source.message),
  };
}

export function mergeRecoveryChallenge(challenge, patch = {}) {
  if (!challenge) return challenge;
  const merged = { ...challenge, ...patch };
  // A partial update from a factor call never carries a new plan or a new
  // workflow identity; only issue metadata (challengeId, expiry, delivery).
  if (!patch.factors) merged.factors = challenge.factors;
  if (!patch.workflowId) merged.workflowId = challenge.workflowId;
  if (!patch.sessionId) merged.sessionId = challenge.sessionId;
  if (!patch.recoveryId) merged.recoveryId = challenge.recoveryId;
  if (!patch.completed) merged.completed = challenge.completed;
  if (patch.preflight === undefined) merged.preflight = challenge.preflight;
  return merged;
}

export function describeRecoveryError(error) {
  const status = Number(error?.status);
  const payload = error?.payload && typeof error.payload === 'object' ? error.payload : {};
  const code = asStatus(payload.code || payload.error?.code || error?.code);
  const backendStatus = asStatus(payload.status);
  const key = code || backendStatus;

  if (CAPTCHA_REQUIRED_CODES.has(key)) {
    return { code: key, state: '', message: 'Complete the security check to continue.' };
  }
  if (CAPTCHA_INVALID_CODES.has(key)) {
    return { code: key, state: '', message: 'The security check was rejected. Please complete it again.' };
  }
  if (EXPIRED_CODES.has(key) || status === 410) {
    return { code: key || 'CHALLENGE_EXPIRED', state: 'expired', message: 'This verification code has expired. Request a new one.' };
  }
  if (LOCKED_CODES.has(key) || status === 423) {
    return { code: key || 'ATTEMPTS_EXCEEDED', state: 'locked', message: 'Too many attempts. Recovery is locked for now. Please wait and try again.' };
  }
  if (RATE_LIMIT_CODES.has(key) || status === 429) {
    return { code: key || 'RATE_LIMITED', state: '', message: 'Too many attempts. Please wait and try again.' };
  }
  if (USED_CODES.has(key)) {
    return { code: key, state: '', message: 'That code has already been used. Request a new one.' };
  }
  if (PROVIDER_CODES.has(key) || status === 501) {
    return { code: key || 'PROVIDER_UNAVAILABLE', state: '', message: 'This verification method is not available right now. Choose another option.' };
  }
  if (key === 'RECOVERY_DELIVERY_UNAVAILABLE' || key === 'RECOVERY_CONTACT_UNAVAILABLE') {
    return { code: key, state: '', message: 'A verification code cannot be sent for this application. Contact support or start a new application.' };
  }
  if (key === 'RECOVERY_METHOD_NOT_REQUIRED' || key === 'OTP_NOT_REQUESTED') {
    return { code: key, state: '', message: 'That verification step is not active. Start the verification again.' };
  }
  if (key === 'RECOVERY_REQUIRED') {
    return { code: key, state: '', message: 'Additional verification is still required.' };
  }
  // On a gate a 401 is unambiguous: the code was not accepted. It is not an
  // expired session and must not clear one.
  if (INVALID_CODES.has(key) || status === 401) {
    return { code: key || 'OTP_INVALID', state: '', message: 'That code is incorrect. Please try again.' };
  }
  if (status === 403) {
    return { code: key || 'FORBIDDEN', state: '', message: 'You are not allowed to perform this action.' };
  }
  if ((!Number.isFinite(status) && !key) || status === 0 || error?.name === 'TypeError') {
    return { code: key || 'UNREACHABLE', state: '', message: 'The service could not be reached. Please check your connection and try again.' };
  }
  if (status >= 500) {
    return { code: key || 'SERVICE_ERROR', state: '', message: 'The verification service could not complete the request. Please try again.' };
  }
  return { code: key || 'FAILED', state: '', message: 'We could not verify that code. Please try again.' };
}

export function countdownSeconds(target, nowMs = Date.now()) {
  if (target === undefined || target === null || target === '') return 0;
  const numeric = typeof target === 'number' ? target : Number(target);
  if (Number.isFinite(numeric) && !Number.isNaN(numeric) && String(target).trim() !== '') {
    if (numeric > 1e12) return Math.max(0, Math.ceil((numeric - nowMs) / 1000));
    return Math.max(0, Math.floor(numeric));
  }
  const parsed = Date.parse(String(target));
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.ceil((parsed - nowMs) / 1000));
}

export function formatDuration(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export function captchaVersionSupported(version) {
  return SUPPORTED_CAPTCHA_VERSIONS.includes(asText(version).toLowerCase());
}

// The whole recovery lifecycle in one reducer, so "did the backend confirm
// this?" is answered by state transitions instead of scattered component
// flags. Nothing transitions to `recovered` without a backend answer.
export const INITIAL_RECOVERY_STATE = Object.freeze({
  state: 'idle',
  requested: '',
  requestedActor: '',
  received: '',
  reason: '',
  status: '',
  challenge: null,
  completed: Object.freeze([]),
  busy: '',
  error: '',
  errorCode: '',
});

const resetTransient = { busy: '', error: '', errorCode: '' };

export function reduceRecovery(state = INITIAL_RECOVERY_STATE, event = {}) {
  switch (event.type) {
    case 'REQUEST':
      return {
        ...INITIAL_RECOVERY_STATE,
        state: 'requesting',
        requested: asText(event.workflowId),
        requestedActor: normalizeActor(event.workflowActor),
      };
    case 'CHALLENGE': {
      // When a factor was just confirmed, the new plan is what the backend
      // requires next — but a step the user already proved stays visible.
      const preserve = event.preserveCompleted === true;
      const nextFactors = event.challenge?.factors || [];
      const declaredCompleted = methodList(event.challenge?.completed);
      const completed = preserve
        ? Array.from(new Set([...state.completed, ...declaredCompleted]))
        : declaredCompleted;
      const carried = preserve
        ? (state.challenge?.factors || []).filter(
          (factor) => completed.includes(factor.id) && !nextFactors.some((item) => item.id === factor.id),
        )
        : [];
      return {
        ...state,
        state: 'challenge',
        requested: asText(event.requested) || state.requested,
        requestedActor: normalizeActor(event.requestedActor) || state.requestedActor,
        status: asText(event.challenge?.status),
        challenge: event.challenge
          ? { ...event.challenge, factors: [...carried, ...nextFactors] }
          : null,
        completed,
        received: '',
        reason: '',
        ...resetTransient,
      };
    }
    case 'START_CAPTCHA': {
      // The start endpoint answers CAPTCHA_REQUIRED before it will issue a
      // recoveryId. This is a real backend demand, not a locally invented
      // factor, but it is not a recovery challenge yet.
      const requested = sanitizeWorkflowId(event.workflowId) || state.requested;
      const actor = normalizeActor(event.workflowActor) || state.requestedActor;
      return {
        ...state,
        state: 'challenge',
        requested,
        requestedActor: actor,
        status: 'CAPTCHA_REQUIRED',
        challenge: {
          workflowId: requested,
          workflowActor: actor,
          sessionId: '',
          recoveryId: '',
          challengeId: '',
          status: 'CAPTCHA_REQUIRED',
          factors: [{ id: 'CAPTCHA', method: 'CAPTCHA', kind: 'CAPTCHA', required: true }],
          alternatives: [],
          completed: [],
          nextStep: 'CAPTCHA',
          missingMethods: ['CAPTCHA'],
          delivery: '',
          deliveryChannel: '',
          sentTo: '',
          sendsRemaining: null,
          codeIssued: false,
          preflight: true,
          otpLength: DEFAULT_OTP_DIGITS,
          expiresAt: '',
          retryAfterSeconds: 0,
          attemptsRemaining: null,
          identity: normalizeIdentity({}),
          captcha: normalizeCaptcha(event.captcha || { required: true }),
          message: '',
        },
        completed: [],
        received: '',
        reason: '',
        ...resetTransient,
      };
    }
    case 'CODE_ISSUED':
      return {
        ...state,
        state: 'challenge',
        challenge: mergeRecoveryChallenge(state.challenge, {
          challengeId: event.challengeId,
          codeIssued: true,
          expiresAt: event.expiresAt,
          delivery: event.delivery,
          deliveryChannel: event.deliveryChannel,
          sentTo: event.sentTo,
          sendsRemaining: event.sendsRemaining,
          otpLength: event.otpLength,
          retryAfterSeconds: event.retryAfterSeconds,
          attemptsRemaining: event.attemptsRemaining,
          devCode: event.devCode,
        }),
        ...resetTransient,
      };
    case 'FACTOR_CONFIRMED': {
      const completed = Array.from(new Set([...state.completed, asText(event.factorId)].filter(Boolean)));
      return {
        ...state,
        state: 'challenge',
        completed,
        challenge: event.challenge
          ? mergeRecoveryChallenge(state.challenge, event.challenge)
          : state.challenge,
        ...resetTransient,
      };
    }
    case 'FACTORS_VERIFIED': {
      // A factor endpoint returns the complete verified/missing plan. Trust it
      // over any locally accumulated list, so a replayed or skipped factor can
      // never appear as completed.
      const completed = methodList(event.completed);
      return {
        ...state,
        state: 'challenge',
        completed,
        challenge: event.challenge
          ? mergeRecoveryChallenge(state.challenge, event.challenge)
          : state.challenge,
        ...resetTransient,
      };
    }
    case 'FACTOR_ALTERNATIVE': {
      const factor = event.factor;
      if (!factor?.id || !state.challenge) return state;
      const factors = state.challenge.factors.map((item) => (item.id === event.factorId ? factor : item));
      return {
        ...state,
        challenge: { ...state.challenge, factors },
        ...resetTransient,
      };
    }
    case 'BUSY':
      return { ...state, busy: asText(event.busy), error: '', errorCode: '' };
    case 'ERROR': {
      const next = {
        ...state,
        busy: '',
        error: asText(event.message),
        errorCode: asText(event.code),
      };
      // A locked/expired answer upgrades the whole gate; an invalid code only
      // updates the inline message so the user can retype it.
      if (event.state && event.state !== state.state) {
        next.state = event.state;
        next.reason = event.code || state.reason;
      }
      return next;
    }
    case 'GATE':
      return {
        ...state,
        state: event.state || 'unavailable',
        reason: asText(event.reason) || state.reason,
        received: asText(event.received),
        status: asText(event.status) || state.status,
        challenge: event.challenge !== undefined ? event.challenge : state.challenge,
        ...resetTransient,
      };
    case 'RECOVERED':
      return {
        ...state,
        state: 'recovered',
        received: asText(event.workflowId) || state.requested,
        status: 'RECOVERED',
        challenge: null,
        ...resetTransient,
      };
    case 'CANCELLED':
      return { ...state, state: 'cancelled', ...resetTransient };
    case 'ENTRY':
      // No link and no live credential: the applicant has to choose between
      // resuming a named application and starting a new one.
      return { ...INITIAL_RECOVERY_STATE, state: 'entry' };
    case 'RESET':
      return INITIAL_RECOVERY_STATE;
    default:
      return state;
  }
}
