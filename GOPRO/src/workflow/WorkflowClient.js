import { workflowEndpoints } from './workflowConfig';

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const err = new Error(payload?.message || `Request failed: ${response.status}`);
    err.status = response.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

// WorkflowClient: thin HTTP boundary. No transition logic here.
export const WorkflowClient = {
  // POST /workflow/session -> { sessionId, workflowId, status }
  // Falls back to legacy bootstrap when new contract is unavailable,
  // preserving existing naming (WORKFLOW_ID / WORKFLOW_ACTOR).
  async createSession({ workflowId = '', workflowActor = '', sessionId = '' } = {}) {
    try {
      const payload = await postJson(workflowEndpoints.session, {
        ...(sessionId ? { sessionId } : {}),
        ...(workflowId ? { workflowId } : {}),
        ...(workflowActor ? { workflowActor } : {}),
      });
      const data = payload?.data ?? payload;
      if (data?.sessionId) return data;
    } catch (e) {
      if (e?.status && e.status !== 404) throw e;
      // 404 => backend does not implement new contract yet; try legacy.
    }
    // Legacy compatibility: /api/workflow-navigator returns componentviewrender.
    if (!workflowId || !workflowActor) return null;
    const legacy = await postJson(workflowEndpoints.legacyNavigator, {
      WORKFLOW_ID: workflowId,
      WORKFLOW_ACTOR: workflowActor,
    });
    return legacy?.data ?? legacy;
  },

  // POST /workflow/resolve { sessionId } — backend authoritative.
  async resolveNode({ sessionId, workflowId = '', workflowActor = '' } = {}) {
    if (!sessionId && (!workflowId || !workflowActor)) {
      throw new Error('resolveNode requires sessionId or workflowId+workflowActor');
    }
    try {
      const payload = await postJson(workflowEndpoints.resolve, { sessionId });
      return payload?.data ?? payload;
    } catch (e) {
      if (e?.status && e.status !== 404) throw e;
      // Legacy fallback preserves existing API contract.
      const legacy = await postJson(workflowEndpoints.legacyNavigator, {
        WORKFLOW_ID: workflowId,
        WORKFLOW_ACTOR: workflowActor,
        ...(sessionId ? { sessionId } : {}),
      });
      return legacy?.data ?? legacy;
    }
  },

  // POST /workflow/event { sessionId, node, event, data }
  // Falls back to legacy eventCreaterAndProcesser shape.
  async publishEvent({ sessionId, node = '', event = '', eventType = '', data = {}, formData = {}, workflowMetadata = {} } = {}) {
    const eventName = event || eventType;
    const newPayload = {
      sessionId,
      ...(node ? { node } : {}),
      ...(eventName ? { event: eventName } : {}),
      ...(data && Object.keys(data).length ? { data } : {}),
      ...(formData && Object.keys(formData).length ? { formData } : {}),
    };
    try {
      const payload = await postJson(workflowEndpoints.event, newPayload);
      return payload?.data ?? payload;
    } catch (e) {
      if (e?.status && e.status !== 404) throw e;
      const legacyPayload = {
        eventType: eventName,
        formData: { ...formData, ...data },
        workflowMetadata: {
          ...workflowMetadata,
          ...(node ? { componentKey: node, componentViewRenderState: node } : {}),
          ...(sessionId ? { sessionId } : {}),
        },
        ...(sessionId ? { sessionId } : {}),
      };
      const legacy = await postJson(workflowEndpoints.legacyEvent, legacyPayload);
      return legacy?.data ?? legacy;
    }
  },

  // POST /auth/verify { sessionId, method, credential }
  async verifyAuth({ sessionId, method, credential, otp, token } = {}) {
    return postJson(workflowEndpoints.authVerify, {
      sessionId,
      method,
      ...(credential !== undefined ? { credential } : {}),
      ...(otp !== undefined ? { otp, credential: credential ?? otp } : {}),
      ...(token !== undefined ? { token } : {}),
    });
  },

  async verifyCaptcha({ sessionId, token, provider } = {}) {
    return postJson(workflowEndpoints.captchaVerify, {
      sessionId,
      token,
      ...(provider ? { provider } : {}),
    });
  },
};
