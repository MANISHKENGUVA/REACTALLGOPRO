import loanFlow from '../loanFlowV6.json';
import { normalizeServiceUrl } from '../utils/security';

export const WORKFLOW_ACTORS = Object.freeze(['BORROWER', 'COBORROWER', 'MANAGER', 'LENDER']);

export function isWorkflowActor(actor) {
  return WORKFLOW_ACTORS.includes(String(actor || '').toUpperCase());
}

export function parseWorkflowState(stateId) {
  const value = String(stateId || '').toUpperCase();
  const match = /^(BORROWER|COBORROWER|MANAGER|LENDER)-(.+)-(V\d+)-(.+)-(V\d+)$/.exec(value);
  if (!match) return null;
  return {
    stateId: value,
    actor: match[1],
    module: match[2],
    moduleVersion: match[3],
    node: match[4],
    nodeVersion: match[5],
  };
}

export function getWorkflowState(stateId) {
  const parsed = parseWorkflowState(stateId);
  if (!parsed) return null;
  const state = loanFlow.states[parsed.stateId];
  if (!state) return null;
  const { actor, module, moduleVersion, node, nodeVersion } = parsed;
  const metadata = state.metadata || {};
  if (
    metadata.actor !== actor || metadata.module !== module ||
    metadata.moduleVersion !== moduleVersion || metadata.node !== node ||
    metadata.nodeVersion !== nodeVersion
  ) {
    throw new Error(`Workflow metadata does not match state ${parsed.stateId}`);
  }
  return { ...state, stateId: parsed.stateId, metadata: parsed };
}

export function validateWorkflowConfiguration() {
  if (!loanFlow.states[loanFlow.startState]) throw new Error('Workflow start state is invalid');
  const visited = new Set();
  const pending = [loanFlow.startState];
  while (pending.length) {
    const stateId = pending.pop();
    if (visited.has(stateId)) continue;
    const state = getWorkflowState(stateId);
    if (!state) throw new Error(`Unknown or invalid workflow state: ${stateId}`);
    visited.add(stateId);
    Object.values(state.edges || {}).forEach((edge) => {
      if (!getWorkflowState(edge.toState)) throw new Error(`Invalid destination ${edge.toState} from ${stateId}`);
      pending.push(edge.toState);
    });
  }
  return { ...loanFlow, reachableStates: visited };
}

// Centralised endpoint configuration.
// No API secrets or backend credentials live here — only URLs.
// New session-aware contracts default to /workflow/* and fall back to
// the legacy NEON contracts already used by the app.
const ENV = import.meta.env || {};
const isProduction = Boolean(ENV.PROD);

const serviceUrl = (value, field) => normalizeServiceUrl(value, {
  production: isProduction,
  allowLoopbackHttp: true,
  field,
});

export const getApiBaseUrl = () => {
  const fromEnv =
    ENV.VITE_API_BASE_URL ||
    ENV.VITE_NEON_API_URL ||
    '';
  if (fromEnv) return serviceUrl(fromEnv, 'API base URL');

  // A production bundle must never silently point at a developer machine.
  // Failing closed makes a missing deployment setting visible immediately
  // instead of sending workflow data to localhost (or to plain HTTP).
  if (isProduction) {
    throw new Error('VITE_API_BASE_URL must be configured for production builds');
  }
  return 'http://localhost:3000';
};

const BASE = () => getApiBaseUrl();
const env = (key, fallback) => ENV[key] || fallback;
const endpoint = (key, path) => serviceUrl(
  env(key, `${BASE()}${path}`),
  `Workflow endpoint ${key}`,
);

export const workflowEndpoints = {
  // New session-aware contracts (authoritative when backend supports them).
  get session() {
    return endpoint('VITE_WORKFLOW_SESSION_URL', '/workflow/session');
  },
  // Resume the application named by the URL. The credential is the HttpOnly
  // recovery cookie; workflowId only names what is being asked for.
  get sessionRecover() {
    return endpoint('VITE_WORKFLOW_RECOVER_URL', '/workflow/session/recover');
  },
  get sessionRevoke() {
    return endpoint('VITE_WORKFLOW_SESSION_REVOKE_URL', '/workflow/session/revoke');
  },
  // Verified recovery. These are only used when the browser has no recovery
  // cookie (storage wiped, different device): the applicant names the
  // application and proves ownership with a code sent to the number on file.
  get recoveryStart() {
    return endpoint('VITE_WORKFLOW_RECOVERY_START_URL', '/workflow/recovery/start');
  },
  get recoveryOtpRequest() {
    return endpoint('VITE_WORKFLOW_RECOVERY_OTP_REQUEST_URL', '/workflow/recovery/otp/request');
  },
  get recoveryOtpVerify() {
    return endpoint('VITE_WORKFLOW_RECOVERY_OTP_VERIFY_URL', '/workflow/recovery/otp/verify');
  },
  get recoveryComplete() {
    return endpoint('VITE_WORKFLOW_RECOVERY_COMPLETE_URL', '/workflow/recovery/complete');
  },
  get resolve() {
    return endpoint('VITE_WORKFLOW_RESOLVE_URL', '/workflow/resolve');
  },
  get event() {
    return endpoint('VITE_WORKFLOW_EVENT_URL', '/workflow/event');
  },
  get authVerify() {
    return endpoint('VITE_AUTH_VERIFY_URL', '/auth/verify');
  },
  get captchaVerify() {
    return endpoint('VITE_CAPTCHA_VERIFY_URL', '/workflow/captcha/verify');
  },
  // Read-only capability probe: { version, siteKey, required, bypassed }.
  get captchaConfig() {
    return endpoint('VITE_CAPTCHA_CONFIG_URL', '/api/captcha/config');
  },
  // Legacy contracts — preserved for backward compatibility.
  get legacyNavigator() {
    return endpoint('VITE_WORKFLOW_BOOTSTRAP_URL', '/api/workflow-navigator');
  },
  get legacyEvent() {
    return endpoint('VITE_WORKFLOW_EVENT_LEGACY_URL', '/api/workflow/eventCreaterAndProcesser');
  },
};

export const workflowSessionKeys = {
  sessionId: 'gopro.workflow.sessionId',
  sessionMeta: 'gopro.workflow.sessionMeta',
  sessionRegistry: 'gopro.workflow.sessionRegistry',
};
