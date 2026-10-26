// Centralised endpoint configuration.
// No API secrets or backend credentials live here — only URLs.
// New session-aware contracts default to /workflow/* and fall back to
// the legacy NEON contracts already used by the app.
const trimTrailingSlash = (value) => String(value || '').replace(/\/+$/, '');

export const getApiBaseUrl = () => {
  const fromEnv =
    import.meta?.env?.VITE_API_BASE_URL ||
    import.meta?.env?.VITE_NEON_API_URL ||
    '';
  if (fromEnv) return trimTrailingSlash(fromEnv);
  return 'http://localhost:3000';
};

const BASE = () => getApiBaseUrl();
const env = (key, fallback) => import.meta?.env?.[key] || fallback;

export const workflowEndpoints = {
  // New session-aware contracts (authoritative when backend supports them).
  get session() {
    return env('VITE_WORKFLOW_SESSION_URL', `${BASE()}/workflow/session`);
  },
  get resolve() {
    return env('VITE_WORKFLOW_RESOLVE_URL', `${BASE()}/workflow/resolve`);
  },
  get event() {
    return env('VITE_WORKFLOW_EVENT_URL', `${BASE()}/workflow/event`);
  },
  get authVerify() {
    return env('VITE_AUTH_VERIFY_URL', `${BASE()}/auth/verify`);
  },
  get captchaVerify() {
    return env('VITE_CAPTCHA_VERIFY_URL', `${BASE()}/workflow/captcha/verify`);
  },
  // Legacy contracts — preserved for backward compatibility.
  get legacyNavigator() {
    return env('VITE_WORKFLOW_BOOTSTRAP_URL', `${BASE()}/api/workflow-navigator`);
  },
  get legacyEvent() {
    return env('VITE_WORKFLOW_EVENT_LEGACY_URL', `${BASE()}/api/workflow/eventCreaterAndProcesser`);
  },
};

export const workflowSessionKeys = {
  sessionId: 'gopro.workflow.sessionId',
  sessionMeta: 'gopro.workflow.sessionMeta',
};
