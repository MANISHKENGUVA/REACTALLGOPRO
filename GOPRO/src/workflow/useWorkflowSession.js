import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WorkflowClient } from './WorkflowClient';
import { WorkflowResolver } from './WorkflowResolver';
import { EventPublisher } from './EventPublisher';
import { AccessHandler } from './AccessHandler';
import { AuthenticationHandler } from './AuthenticationHandler';
import { SessionManager } from './SessionManager';

// useWorkflowSession: sessionId lifecycle + backend-authoritative resolve.
// Creates session once, resolves on mount/reload, re-resolves after
// events / auth / captcha. Never decides transitions locally.
export function useWorkflowSession({ workflowId = '', workflowActor = '', autoStart = true } = {}) {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState(() => SessionManager.getSessionId(searchParams));
  const [sessionMeta, setSessionMeta] = useState(() => SessionManager.getSessionMeta());
  const [resolved, setResolved] = useState(null);
  const [access, setAccess] = useState({ kind: 'LOADING', resolved: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const urlWorkflowId = searchParams.get('WORKFLOW_ID') || workflowId || sessionMeta?.workflowId || '';
  const urlWorkflowActor = searchParams.get('WORKFLOW_ACTOR') || workflowActor || sessionMeta?.actorId || sessionMeta?.workflowActor || '';

  const ensureSession = useCallback(async () => {
    const existing = SessionManager.getSessionId(searchParams);
    if (existing) {
      setSessionId(existing);
      return existing;
    }
    setLoading(true);
    setError('');
    try {
      const created = await WorkflowClient.createSession({
        workflowId: urlWorkflowId,
        workflowActor: urlWorkflowActor,
      });
      const data = created?.data ?? created;
      const newSessionId = data?.sessionId || data?.session?.sessionId || '';
      if (newSessionId) {
        SessionManager.setSession(newSessionId, {
          workflowId: data?.workflowId || urlWorkflowId,
          status: data?.status || 'ANONYMOUS',
          actorId: data?.actorId || '',
        });
        setSessionId(newSessionId);
        setSessionMeta(SessionManager.getSessionMeta());
        return newSessionId;
      }
      return '';
    } catch (e) {
      setError(e?.message || 'Failed to create workflow session');
      return SessionManager.getSessionId(searchParams);
    } finally {
      setLoading(false);
    }
  }, [searchParams, urlWorkflowId, urlWorkflowActor]);
  const resolveCurrent = useCallback(async (overrideSid) => {
    const sid = overrideSid ?? SessionManager.getSessionId(searchParams) ?? sessionId;
    setLoading(true);
    setError('');
    try {
      const result = await WorkflowResolver.resolve({
        sessionId: sid || undefined,
        workflowId: urlWorkflowId,
        workflowActor: urlWorkflowActor,
      });
      setResolved(result);
      setAccess(AccessHandler.classify(result));
      return result;
    } catch (e) {
      const payload = e?.payload;
      if (payload && SessionManager.isSessionInvalidResponse(payload)) {
        SessionManager.clearSession();
        setSessionId('');
        setAccess({ kind: 'SESSION_INVALID', resolved: payload });
        setResolved(payload);
        return payload;
      }
      setError(e?.message || 'Failed to resolve workflow node');
      return null;
    } finally {
      setLoading(false);
    }
  }, [searchParams, sessionId, urlWorkflowId, urlWorkflowActor]);

  const publishEvent = useCallback(async ({ node = '', event = '', eventType = '', data = {}, formData = {}, workflowMetadata = {} } = {}) => {
    const sid = SessionManager.getSessionId(searchParams) ?? sessionId;
    const result = await EventPublisher.publish({
      sessionId: sid || undefined,
      node, event, eventType, data, formData,
      workflowMetadata: {
        ...workflowMetadata,
        ...(urlWorkflowId ? { workflowId: urlWorkflowId } : {}),
        ...(urlWorkflowActor ? { workflowActor: urlWorkflowActor } : {}),
      },
    });
    if (result && (result.status === 'OK' || result.node || result.component || result.componentviewrender)) {
      const classified = AccessHandler.classify(result.status ? result : { status: 'OK', legacy: result });
      setResolved(result);
      setAccess(classified);
      if (!result.status) await resolveCurrent(sid);
      return result;
    }
    await resolveCurrent(sid);
    return result;
  }, [searchParams, sessionId, urlWorkflowId, urlWorkflowActor, resolveCurrent]);

  const verifyAuth = useCallback(async ({ method, credential, otp, token } = {}) => {
    const sid = SessionManager.getSessionId(searchParams) ?? sessionId;
    const result = await AuthenticationHandler.verify({ sessionId: sid, method, credential, otp, token });
    if (AuthenticationHandler.isAuthenticatedResponse(result)) {
      const meta = SessionManager.getSessionMeta() || {};
      SessionManager.setSession(sid, { ...meta, status: 'ACTOR_AUTHENTICATED', actorId: result.actorId });
      setSessionMeta(SessionManager.getSessionMeta());
      await resolveCurrent(sid);
    }
    return result;
  }, [searchParams, sessionId, resolveCurrent]);

  const verifyCaptchaToken = useCallback(async ({ token, provider } = {}) => {
    const sid = SessionManager.getSessionId(searchParams) ?? sessionId;
    await WorkflowClient.verifyCaptcha({ sessionId: sid, token, provider });
    return resolveCurrent(sid);
  }, [searchParams, sessionId, resolveCurrent]);

  const resetSession = useCallback(() => {
    SessionManager.clearSession();
    setSessionId('');
    setSessionMeta(null);
    setResolved(null);
    setAccess({ kind: 'LOADING', resolved: null });
  }, []);

  useEffect(() => {
    if (!autoStart) return;
    // Intentional one-time mount effect: create session + resolve node on
    // load/reload. Re-running on dependency change would duplicate requests.
    (async () => {
      const sid = await ensureSession();
      await resolveCurrent(sid);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({
    sessionId, sessionMeta, resolved, access, loading, error,
    workflowId: urlWorkflowId, workflowActor: urlWorkflowActor,
    ensureSession, resolveCurrent, publishEvent, verifyAuth, verifyCaptchaToken, resetSession,
  }), [sessionId, sessionMeta, resolved, access, loading, error, urlWorkflowId, urlWorkflowActor, ensureSession, resolveCurrent, publishEvent, verifyAuth, verifyCaptchaToken, resetSession]);

  return value;
}

