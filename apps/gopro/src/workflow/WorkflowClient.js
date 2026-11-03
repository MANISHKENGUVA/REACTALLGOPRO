import { workflowEndpoints } from './workflowConfig';
import {
  normalizeServiceUrl,
  publicErrorMessage,
} from '../utils/security';
import { applicationCreationKeyStore } from './applicationCreationKey';
import { createNewApplicationSession } from './applicationCreation';

const CSRF_HEADER = 'X-CSRF-Token';

function csrfToken() {
  if (typeof document === 'undefined') return '';
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
  return /^[A-Za-z0-9._~+/=-]{8,512}$/.test(token) ? token : '';
}

function serviceEndpoint(url, field) {
  return normalizeServiceUrl(url, {
    production: Boolean(import.meta.env?.PROD),
    allowLoopbackHttp: true,
    field,
  });
}

async function requestJson(method, url, body, {
  signal,
  timeout = 15000,
  field = 'Workflow endpoint',
  headers: extraHeaders = {},
} = {}) {
  const target = serviceEndpoint(url, field);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  const hasBody = method !== 'GET';
  try {
    const token = csrfToken();
    const response = await fetch(target, {
      method,
      credentials: 'include',
      // A credentialed POST must never follow a redirect, especially a 307/308
      // that would resend the body and cookies to another origin.
      redirect: 'error',
      referrerPolicy: 'same-origin',
      headers: {
        Accept: 'application/json',
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { [CSRF_HEADER]: token } : {}),
        ...extraHeaders,
      },
      ...(hasBody ? { body: JSON.stringify(body || {}) } : {}),
      signal: controller.signal,
    });

    // Credentials are attached to this request. Never accept a cross-origin
    // redirect (or any POST redirect) as a successful workflow response.
    const finalUrl = new URL(response.url || target, target);
    if (response.redirected || finalUrl.origin !== new URL(target).origin) {
      throw new Error('The workflow service redirected the request unexpectedly.');
    }

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const err = new Error(publicErrorMessage({ status: response.status }, 'The workflow request could not be completed.'));
      err.status = response.status;
      err.payload = payload;
      throw err;
    }
    return payload;
  } catch (error) {
    if (controller.signal.aborted && !signal?.aborted) {
      throw new Error('The workflow service did not respond in time. Please retry.');
    }
    if (error?.name === 'TypeError') {
      throw new Error('The workflow service could not be reached. Please check your connection and try again.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}

const postJson = (url, body, options) => requestJson('POST', url, body, options);
const getJson = (url, options) => requestJson('GET', url, null, options);

// WorkflowClient: thin HTTP boundary. No transition logic here.
export const WorkflowClient = {
  // POST /workflow/session -> { sessionId, workflowId, status }
  // Falls back to legacy bootstrap when new contract is unavailable,
  // preserving existing naming (WORKFLOW_ID / WORKFLOW_ACTOR).
  //
  // With no identity in the body, the backend resumes a live recovery cookie
  // instead of opening a second application. `newApplication: true` is the
  // explicit override used only by the "start a new application" action.
  async createSession({
    workflowId = '',
    workflowActor = '',
    sessionId = '',
    newApplication = false,
    captchaToken = '',
  } = {}) {
    if (newApplication) {
      return createNewApplicationSession({
        postJson,
        endpoint: workflowEndpoints.session,
        captchaToken,
        keyStore: applicationCreationKeyStore,
      });
    }

    try {
      const payload = await postJson(workflowEndpoints.session, {
        ...(sessionId ? { sessionId } : {}),
      }, { field: 'VITE_WORKFLOW_SESSION_URL' });
      const data = payload?.data ?? payload;
      if (data?.sessionId) return data;
    } catch (e) {
      // Only a genuine 404 means "endpoint not implemented". Network/CORS
      // failures must surface as errors instead of silently retrying legacy.
      if (e?.status !== 404) throw e;
    }
    // Legacy compatibility: /api/workflow-navigator returns componentviewrender.
    if (!workflowId || !workflowActor) return null;
    const legacy = await postJson(workflowEndpoints.legacyNavigator, {
      WORKFLOW_ID: workflowId,
      WORKFLOW_ACTOR: workflowActor,
    }, { field: 'VITE_WORKFLOW_BOOTSTRAP_URL' });
    return legacy?.data ?? legacy;
  },

  // POST /workflow/session/recover { workflowId } — resumes the application
  // named by the URL. The HttpOnly recovery cookie is the only credential and
  // the actor is read from it, never from the request body: a workflow id on
  // its own buys nothing. 401 RECOVERY_UNAVAILABLE and 409 WORKFLOW_MISMATCH
  // both mean "no", and must never fall through to creating an application.
  async recoverSession({ workflowId } = {}) {
    const payload = await postJson(
      workflowEndpoints.sessionRecover,
      { workflowId },
      { field: 'VITE_WORKFLOW_RECOVER_URL' },
    );
    return payload?.data ?? payload;
  },

  // POST /workflow/recovery/start { workflowId, actor, captchaToken }
  //
  // The workflow id selects which application the claimant is asking about;
  // it is not a credential. The backend answers with the factors it requires
  // and a recoveryId, or with CAPTCHA_REQUIRED when the anti-automation check
  // has to run first. Nothing here creates an application.
  async startRecovery({ workflowId, actor, captchaToken } = {}) {
    const payload = await postJson(workflowEndpoints.recoveryStart, {
      workflowId,
      ...(actor ? { actor } : {}),
      ...(captchaToken ? { captchaToken } : {}),
    }, { field: 'VITE_WORKFLOW_RECOVERY_START_URL' });
    return payload?.data ?? payload;
  },

  // POST /workflow/recovery/otp/request { recoveryId }
  // The number is chosen by the backend from the application on file; the
  // response never contains it in clear text.
  async requestRecoveryOtp({ recoveryId } = {}) {
    const payload = await postJson(
      workflowEndpoints.recoveryOtpRequest,
      { recoveryId },
      { field: 'VITE_WORKFLOW_RECOVERY_OTP_REQUEST_URL' },
    );
    return payload?.data ?? payload;
  },

  // POST /workflow/recovery/otp/verify { recoveryId, code }
  // Only the backend can confirm a factor; this returns the updated plan.
  async verifyRecoveryOtp({ recoveryId, code } = {}) {
    const payload = await postJson(
      workflowEndpoints.recoveryOtpVerify,
      { recoveryId, code },
      { field: 'VITE_WORKFLOW_RECOVERY_OTP_VERIFY_URL' },
    );
    return payload?.data ?? payload;
  },

  // POST /workflow/recovery/complete { recoveryId }
  // The backend re-checks every factor inside one transaction and mints a
  // fresh session plus the durable recovery cookie.
  async completeRecovery({ recoveryId } = {}) {
    const payload = await postJson(
      workflowEndpoints.recoveryComplete,
      { recoveryId },
      { field: 'VITE_WORKFLOW_RECOVERY_COMPLETE_URL' },
    );
    return payload?.data ?? payload;
  },

  // POST /workflow/resolve { sessionId } — backend authoritative.
  async resolveNode({ sessionId, workflowId = '', workflowActor = '', signal } = {}) {
    if (!sessionId && (!workflowId || !workflowActor)) {
      throw new Error('resolveNode requires sessionId or workflowId+workflowActor');
    }
    try {
      const payload = await postJson(workflowEndpoints.resolve, { sessionId }, {
        signal,
        field: 'VITE_WORKFLOW_RESOLVE_URL',
      });
      return payload?.data ?? payload;
    } catch (e) {
      if (e?.status !== 404) throw e;
      // Legacy fallback preserves existing API contract.
      const legacy = await postJson(workflowEndpoints.legacyNavigator, {
        WORKFLOW_ID: workflowId,
        WORKFLOW_ACTOR: workflowActor,
        ...(sessionId ? { sessionId } : {}),
      }, { signal, field: 'VITE_WORKFLOW_BOOTSTRAP_URL' });
      return legacy?.data ?? legacy;
    }
  },

  // POST /workflow/event { sessionId, node, event, eventId, data }
  // Falls back to legacy eventCreaterAndProcesser shape.
  async publishEvent({ sessionId, node = '', event = '', eventType = '', eventId = '', data = {}, formData = {}, workflowMetadata = {} } = {}) {
    const eventName = event || eventType;
    const newPayload = {
      ...(sessionId ? { sessionId } : {}),
      ...(node ? { node } : {}),
      ...(eventName ? { event: eventName } : {}),
      ...(eventId ? { eventId } : {}),
      ...(data && Object.keys(data).length ? { data } : {}),
      ...(formData && Object.keys(formData).length ? { formData } : {}),
    };
    try {
      const payload = await postJson(workflowEndpoints.event, newPayload, {
        field: 'VITE_WORKFLOW_EVENT_URL',
      });
      return payload?.data ?? payload;
    } catch (e) {
      if (e?.status !== 404) throw e;
      return WorkflowClient.publishLegacyEvent({
        sessionId,
        eventType: eventName,
        formData: { ...formData, ...data },
        workflowMetadata,
      });
    }
  },

  // Explicit legacy submission used by pages whose backend contract predates
  // the session-aware /workflow/event endpoint. The workflow metadata is
  // rebuilt by EventPublisher before it reaches this boundary.
  async publishLegacyEvent({ sessionId, eventType = '', formData = {}, workflowMetadata = {} } = {}) {
    const legacyPayload = {
      eventType,
      formData,
      workflowMetadata: {
        ...workflowMetadata,
        ...(sessionId ? { sessionId } : {}),
      },
      ...(sessionId ? { sessionId } : {}),
    };
    try {
      const legacy = await postJson(workflowEndpoints.legacyEvent, legacyPayload, {
        field: 'VITE_WORKFLOW_EVENT_LEGACY_URL',
      });
      return legacy?.data ?? legacy;
    } catch (e) {
      // A backend that only exposes the new endpoint answers 404 here. Retry the
      // same action through /workflow/event: the node is the state the page was
      // rendered for, which is exactly what the new contract expects.
      if (e?.status !== 404) throw e;
      return postJson(workflowEndpoints.event, {
        ...(sessionId ? { sessionId } : {}),
        ...(workflowMetadata.componentViewRenderState
          ? { node: workflowMetadata.componentViewRenderState }
          : {}),
        event: eventType,
        formData,
      }, { field: 'VITE_WORKFLOW_EVENT_URL' }).then((payload) => payload?.data ?? payload);
    }
  },

  // POST /auth/verify — two phase.
  //   phase 1: { sessionId, method, aadhaarNumber? } -> { challengeId, delivery, code? }
  //   phase 2: { sessionId, challengeId, otp }       -> { authenticated, actorId, status }
  async verifyAuth({ sessionId, method, challengeId, otp, aadhaarNumber, credential, token } = {}) {
    return postJson(workflowEndpoints.authVerify, {
      sessionId,
      ...(method ? { method } : {}),
      ...(challengeId ? { challengeId } : {}),
      ...(otp !== undefined ? { otp } : {}),
      ...(aadhaarNumber ? { aadhaarNumber } : {}),
      ...(credential !== undefined ? { credential } : {}),
      ...(token !== undefined ? { token } : {}),
    }, { field: 'VITE_AUTH_VERIFY_URL' });
  },

  async requestAuthChallenge({ sessionId, method, aadhaarNumber } = {}) {
    return WorkflowClient.verifyAuth({ sessionId, method, aadhaarNumber });
  },

  async verifyCaptcha({ sessionId, token, provider } = {}) {
    return postJson(workflowEndpoints.captchaVerify, {
      sessionId,
      token,
      ...(provider ? { provider } : {}),
    }, { field: 'VITE_CAPTCHA_VERIFY_URL' });
  },

  // POST /workflow/session/revoke { sessionId } — ends the server-side session
  // instead of leaving it valid until its TTL. Best-effort from the UI: a
  // failed revoke must never block clearing local state.
  async revokeSession({ sessionId } = {}) {
    if (!sessionId) return null;
    const payload = await postJson(workflowEndpoints.sessionRevoke, { sessionId }, {
      field: 'VITE_WORKFLOW_SESSION_REVOKE_URL',
    });
    return payload?.data ?? payload;
  },

  // GET /api/captcha/config — a UI hint only (bypassed / siteKey / version).
  // A failed probe must not block the gate: the resolve payload still decides
  // whether a challenge is required, so we degrade to "show the widget".
  async getCaptchaConfig({ signal } = {}) {
    try {
      const payload = await getJson(workflowEndpoints.captchaConfig, {
        signal,
        field: 'VITE_CAPTCHA_CONFIG_URL',
      });
      const data = payload?.data ?? payload;
      if (!data || typeof data !== 'object') return null;
      return {
        version: String(data.version || 'v2'),
        siteKey: typeof data.siteKey === 'string' ? data.siteKey : '',
        required: Boolean(data.required),
        bypassed: Boolean(data.bypassed),
      };
    } catch {
      return null;
    }
  },
};
