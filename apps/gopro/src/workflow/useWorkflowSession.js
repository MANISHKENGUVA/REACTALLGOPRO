import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WorkflowClient } from './WorkflowClient';
import { WorkflowResolver } from './WorkflowResolver';
import { EventPublisher } from './EventPublisher';
import { AccessHandler } from './AccessHandler';
import { AuthenticationHandler } from './AuthenticationHandler';
import { SessionManager } from './SessionManager';
import { applicationCreationKeyStore } from './applicationCreationKey';
import { DraftStore } from './DraftStore';
import { withBootstrapLock } from './bootstrapLock';
import { classifyRecoveryFailure, judgeRecovery } from './recoveryPolicy';
import {
  INITIAL_RECOVERY_STATE,
  describeRecoveryError,
  nextFactor,
  otpLength as normalizeOtpLength,
  reduceRecovery,
  safeMaskedDelivery,
} from './recoveryGates';
import { normalizeActor, sanitizeSessionId, sanitizeWorkflowId } from '../utils/security';

// A mount effect runs twice under React StrictMode. Session creation is a
// write (it opens an application), so the second mount must join the first
// request instead of opening a second application and overwriting the id.
let pendingSessionCreation = null;

// Issue metadata returned by /auth/verify phase 1. Everything is taken from the
// backend answer; nothing about the delivery is generated locally.
const codeIssueFrom = (result) => ({
  challengeId: result?.challengeId || '',
  expiresAt: result?.expiresAt || '',
  delivery: safeMaskedDelivery(result?.delivery),
  otpLength: normalizeOtpLength(result?.raw?.otpLength),
  retryAfterSeconds: Number(result?.raw?.retryAfterSeconds) || 0,
  attemptsRemaining: Number.isFinite(Number(result?.raw?.attemptsRemaining))
    ? Number(result.raw.attemptsRemaining)
    : null,
  devCode: result?.devCode || '',
});

// useWorkflowSession: sessionId lifecycle + backend-authoritative resolve.
// Creates session once, resolves on mount/reload, re-resolves after
// events / auth / captcha. Never decides transitions locally.
export function useWorkflowSession({ workflowId = '', workflowActor = '', autoStart = true } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  // React Router's setter is stable, but exhaustive-deps treats it as both a
  // missing and an invalid dependency; a ref keeps the callback list honest.
  const setSearchParamsRef = useRef(setSearchParams);
  setSearchParamsRef.current = setSearchParams;
  const [sessionId, setSessionId] = useState(() => SessionManager.getSessionId(searchParams));
  const [sessionMeta, setSessionMeta] = useState(() => SessionManager.getSessionMeta());
  const [resolved, setResolved] = useState(null);
  const [access, setAccess] = useState({ kind: 'LOADING', resolved: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Recovery state is a reducer, not a flag: a failed resume must render an
  // explicit choice (retry / start a new application), never a new loan, and a
  // gate may only render what the backend asked for.
  const [recovery, dispatchRecovery] = useReducer(reduceRecovery, INITIAL_RECOVERY_STATE);
  const recoveryRef = useRef(recovery);
  recoveryRef.current = recovery;
  // One factor request at a time: a double submit must not replay a code or a
  // recovery completion.
  const inFlightRef = useRef({ factor: '', completing: false, creating: false });

  const urlWorkflowId = sanitizeWorkflowId(
    searchParams.get('WORKFLOW_ID') || workflowId || sessionMeta?.workflowId,
  );
  const urlWorkflowActor = normalizeActor(
    searchParams.get('WORKFLOW_ACTOR') || workflowActor || sessionMeta?.actorId || sessionMeta?.workflowActor,
  );

  const failFactor = useCallback((e) => {
    const detail = describeRecoveryError(e);
    dispatchRecovery({ type: 'ERROR', code: detail.code, message: detail.message, state: detail.state });
    return detail;
  }, []);

  const ensureSession = useCallback(async ({
    forceNew = false,
    refreshRecovery = false,
    captchaToken = '',
  } = {}) => {
    const existing = forceNew || (refreshRecovery && urlWorkflowId)
      ? ''
      : SessionManager.getSessionId(searchParams);
    if (existing) {
      setSessionId(existing);
      return existing;
    }
    setLoading(true);
    setError('');
    try {
      // An automatic mount/recovery request must not be mistaken for an
      // explicit create if the user chooses "start new" while it is pending.
      if (forceNew && pendingSessionCreation) {
        await pendingSessionCreation.catch(() => '');
      }
      if (!pendingSessionCreation) {
        pendingSessionCreation = (async () => {
          const requestedId = forceNew ? '' : urlWorkflowId;

          // The URL names an application and this tab has no session: resume it.
          // Creating a session here is what used to mint a duplicate loan.
          if (requestedId) {
            dispatchRecovery({ type: 'REQUEST', workflowId: requestedId, workflowActor: urlWorkflowActor });
            const recovered = await WorkflowClient.recoverSession({ workflowId: requestedId });
            const verdict = judgeRecovery({
              requestedWorkflowId: requestedId,
              requestedActor: urlWorkflowActor,
              response: recovered,
            });
            if (verdict.action === 'challenge') {
              // The backend named the verification it wants. Render exactly that.
              dispatchRecovery({
                type: 'CHALLENGE',
                challenge: verdict.challenge,
                requested: requestedId,
                requestedActor: urlWorkflowActor,
              });
              return '';
            }
            if (verdict.action !== 'recovered') {
              SessionManager.clearSession();
              // The link names an application this tab is not allowed to
              // resume; its drafts must not be restored for a different user.
              DraftStore.clearWorkflowDrafts(requestedId);
              dispatchRecovery({
                type: 'GATE',
                state: verdict.action === 'mismatch' ? 'mismatch' : verdict.action,
                reason: verdict.reason || '',
                received: verdict.received || '',
                challenge: verdict.challenge || null,
                status: verdict.status || '',
              });
              return '';
            }
            SessionManager.setSession(verdict.sessionId, {
              workflowId: verdict.workflowId,
              status: recovered?.status || 'ANONYMOUS',
              actorId: recovered?.actorId || '',
              ...(recovered?.workflowActor ? { workflowActor: recovered.workflowActor } : {}),
            });
            dispatchRecovery({ type: 'RESET' });
            return verdict.sessionId;
          }

          // The lock makes a simultaneous cold start in another tab wait for
          // this response (and its recovery cookie), so that tab resumes the
          // same application instead of creating a second one.
          const created = await withBootstrapLock(() => WorkflowClient.createSession({
            // Only an explicit "start a new application" may open a second
            // loan. A reload or a second tab resumes the live recovery cookie.
            newApplication: forceNew,
            captchaToken,
          }));
          const data = created?.data ?? created;
          const rawSessionId = data?.sessionId || data?.session?.sessionId || '';
          const newSessionId = sanitizeSessionId(rawSessionId);
          if (rawSessionId && !newSessionId) {
            // Storing an id that fails validation would silently send every
            // later request without a session, which the backend answers
            // 401 "sessionId is required". Name the real problem instead.
            throw new Error('The workflow service returned an invalid session identifier.');
          }
          const newWorkflowId = sanitizeWorkflowId(data?.workflowId || '');
          if (forceNew && (!newSessionId || !newWorkflowId)) {
            throw new Error('The workflow service did not confirm the new application. Retry safely.');
          }
          if (newSessionId) {
            SessionManager.setSession(newSessionId, {
              workflowId: newWorkflowId,
              status: data?.status || 'ANONYMOUS',
              actorId: data?.actorId || '',
              ...(data?.workflowActor ? { workflowActor: data.workflowActor } : {}),
            });
          }
          return newSessionId;
        })().finally(() => {
          pendingSessionCreation = null;
        });
      }
      const newSessionId = await pendingSessionCreation;
      if (newSessionId) {
        setSessionId(newSessionId);
        setSessionMeta(SessionManager.getSessionMeta());
        return newSessionId;
      }
      return '';
    } catch (e) {
      const code = String(e?.payload?.code || '').toUpperCase();
      // No link and no live credential: the server refused to guess. Show the
      // explicit choice instead of treating it as an error or opening a loan.
      if (!forceNew && !urlWorkflowId && code === 'NEW_APPLICATION_REQUIRED') {
        dispatchRecovery({ type: 'ENTRY' });
        return '';
      }
      if (forceNew) {
        setError(e?.message || 'The new application could not be started. Please try again.');
        throw e;
      }
      // A failed recovery is NOT permission to create another application.
      if (urlWorkflowId && !forceNew) {
        SessionManager.clearSession();
        setSessionId('');
        setSessionMeta(null);
        const failure = classifyRecoveryFailure(e, {
          requestedWorkflowId: urlWorkflowId,
          requestedActor: urlWorkflowActor,
        });
        if (failure.state === 'challenge') {
          dispatchRecovery({
            type: 'CHALLENGE',
            challenge: failure.challenge,
            requested: urlWorkflowId,
            requestedActor: urlWorkflowActor,
          });
        } else {
          dispatchRecovery({
            type: 'GATE',
            state: failure.state,
            reason: failure.reason,
            challenge: failure.challenge || null,
          });
        }
        return '';
      }
      setError(e?.message || 'Failed to create workflow session');
      return SessionManager.getSessionId(searchParams);
    } finally {
      setLoading(false);
    }
  }, [searchParams, urlWorkflowId, urlWorkflowActor]);

  const resolveCurrent = useCallback(async (overrideSid, { quiet = false } = {}) => {
    // Tolerate being used directly as an event handler: only strings count.
    const sid = (typeof overrideSid === 'string' ? overrideSid : '') ||
      SessionManager.getSessionId(searchParams) || sessionId;
    if (!quiet) {
      setLoading(true);
      setError('');
    }
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
      if ((payload && SessionManager.isSessionInvalidResponse(payload)) || e?.status === 401) {
        // The backend session is gone (idle expiry / unknown session). Clearing
        // it is deliberate but restarting is not: a new session starts a NEW
        // application, so the user has to confirm that explicitly.
        SessionManager.clearSession();
        setSessionId('');
        setSessionMeta(null);
        setAccess({ kind: 'SESSION_EXPIRED', resolved: null });
        setResolved(null);
        return null;
      }
      setError(e?.message || 'Failed to resolve workflow node');
      return null;
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [searchParams, sessionId, urlWorkflowId, urlWorkflowActor]);

  // Ask the backend whether recovery is complete. This is the ONLY place a
  // recovered session is created, and resolution happens strictly after it.
  const completeRecovery = useCallback(async () => {
    const current = recoveryRef.current;
    const workflowIdWanted = current.requested || urlWorkflowId;
    if (!workflowIdWanted) {
      dispatchRecovery({ type: 'GATE', state: 'unavailable', reason: 'MISSING_WORKFLOW_ID' });
      return null;
    }
    if (inFlightRef.current.completing) return null;
    inFlightRef.current.completing = true;
    dispatchRecovery({ type: 'BUSY', busy: 'recover' });
    try {
      const response = await WorkflowClient.recoverSession({ workflowId: workflowIdWanted });
      const verdict = judgeRecovery({
        requestedWorkflowId: workflowIdWanted,
        requestedActor: current.requestedActor || urlWorkflowActor,
        response,
      });

      if (verdict.action === 'challenge') {
        // Another factor is required. The backend's new plan wins; factors the
        // user already proved stay visible as completed.
        dispatchRecovery({
          type: 'CHALLENGE',
          challenge: verdict.challenge,
          requested: workflowIdWanted,
          requestedActor: current.requestedActor || urlWorkflowActor,
          preserveCompleted: true,
        });
        return null;
      }

      if (verdict.action !== 'recovered') {
        // Not confirmed: clear local state, never create a new application.
        SessionManager.clearSession();
        // The workflow named in the URL could not be resumed; its drafts must
        // not be restored for a different user or a later attempt.
        DraftStore.clearWorkflowDrafts(workflowIdWanted);
        dispatchRecovery({
          type: 'GATE',
          state: verdict.action === 'mismatch' ? 'mismatch' : verdict.action,
          reason: verdict.reason || '',
          received: verdict.received || '',
          challenge: verdict.challenge || null,
          status: verdict.status || '',
        });
        return null;
      }

      // Backend confirmed. Keep the original workflow identity and only then
      // resolve, so no page is opened on a guess.
      SessionManager.setSession(verdict.sessionId, {
        workflowId: verdict.workflowId,
        status: response?.status || 'ANONYMOUS',
        actorId: response?.actorId || '',
        ...(response?.workflowActor ? { workflowActor: response.workflowActor } : {}),
      });
      setSessionId(verdict.sessionId);
      setSessionMeta(SessionManager.getSessionMeta());
      dispatchRecovery({ type: 'RECOVERED', sessionId: verdict.sessionId, workflowId: verdict.workflowId });
      await resolveCurrent(verdict.sessionId);
      return verdict;
    } catch (e) {
      SessionManager.clearSession();
      const failure = classifyRecoveryFailure(e, {
        requestedWorkflowId: workflowIdWanted,
        requestedActor: current.requestedActor || urlWorkflowActor,
      });
      if (failure.state === 'challenge') {
        dispatchRecovery({
          type: 'CHALLENGE',
          challenge: failure.challenge,
          requested: workflowIdWanted,
          requestedActor: current.requestedActor || urlWorkflowActor,
          preserveCompleted: true,
        });
      } else {
        dispatchRecovery({
          type: 'GATE',
          state: failure.state,
          reason: failure.reason,
          challenge: failure.challenge || null,
        });
      }
      return null;
    } finally {
      inFlightRef.current.completing = false;
      dispatchRecovery({ type: 'BUSY', busy: '' });
    }
  }, [resolveCurrent, urlWorkflowActor, urlWorkflowId]);

  // Verified recovery, step 1: name the application and ask the backend which
  // proof it requires. A CAPTCHA answer is a step to render; it is never proof
  // of ownership and never mints a session on its own.
  const startVerifiedRecovery = useCallback(async ({
    workflowId = '',
    workflowActor = '',
    captchaToken,
  } = {}) => {
    const current = recoveryRef.current;
    const requested = sanitizeWorkflowId(workflowId) || current.requested || urlWorkflowId;
    if (!requested) {
      dispatchRecovery({ type: 'ENTRY' });
      return null;
    }
    const actor = normalizeActor(workflowActor) ||
      current.requestedActor ||
      urlWorkflowActor ||
      'BORROWER';
    if (inFlightRef.current.completing) return null;
    inFlightRef.current.completing = true;
    dispatchRecovery({ type: 'BUSY', busy: 'recovery-start' });
    try {
      const response = await WorkflowClient.startRecovery({
        workflowId: requested,
        actor,
        captchaToken,
      });
      const verdict = judgeRecovery({
        requestedWorkflowId: requested,
        requestedActor: actor,
        response,
      });
      if (verdict.action === 'challenge') {
        // The backend's plan (including any factor it already verified, such as
        // the CAPTCHA that was checked while starting) is the only plan.
        dispatchRecovery({
          type: 'CHALLENGE',
          challenge: verdict.challenge,
          requested,
          requestedActor: actor,
        });
        return verdict.challenge;
      }
      // A start response has no session, so it can never be "recovered" here.
      dispatchRecovery({
        type: 'GATE',
        state: verdict.action === 'mismatch' ? 'mismatch' : 'unavailable',
        reason: verdict.reason || verdict.action,
        received: verdict.received || '',
        status: verdict.status || '',
        challenge: verdict.challenge || null,
      });
      return null;
    } catch (e) {
      const failure = classifyRecoveryFailure(e, {
        requestedWorkflowId: requested,
        requestedActor: actor,
      });
      if (failure.state === 'captcha_required') {
        dispatchRecovery({ type: 'START_CAPTCHA', workflowId: requested, workflowActor: actor });
        return null;
      }
      if (failure.state === 'captcha_invalid') {
        // Keep the CAPTCHA gate up and let the widget show the retry message.
        const detail = describeRecoveryError(e);
        dispatchRecovery({ type: 'ERROR', code: detail.code, message: detail.message, state: '' });
        throw e;
      }
      const code = String(e?.payload?.code || '').toUpperCase();
      if (code === 'WORKFLOW_NOT_FOUND' || code === 'WORKFLOW_NOT_RECOVERABLE') {
        // The application named by this link cannot be resumed. Do not keep a
        // draft for an identity the user has not proved.
        DraftStore.clearWorkflowDrafts(requested);
      }
      dispatchRecovery({
        type: 'GATE',
        state: failure.state === 'mismatch'
          ? 'mismatch'
          : failure.state === 'locked'
            ? 'locked'
            : failure.state === 'expired'
              ? 'expired'
              : 'unavailable',
        reason: failure.reason,
        challenge: failure.challenge || null,
        status: failure.challenge?.status || '',
      });
      return null;
    } finally {
      inFlightRef.current.completing = false;
      dispatchRecovery({ type: 'BUSY', busy: '' });
    }
  }, [urlWorkflowActor, urlWorkflowId]);

  // Verified recovery, step 4: the backend re-checks every factor and mints
  // the session. Nothing is stored locally before this answer.
  const completeVerifiedRecovery = useCallback(async () => {
    const current = recoveryRef.current;
    const recoveryId = current.challenge?.recoveryId;
    const workflowIdWanted = current.requested || urlWorkflowId;
    if (!recoveryId || !workflowIdWanted) {
      dispatchRecovery({ type: 'GATE', state: 'unavailable', reason: 'MISSING_RECOVERY_ID' });
      return null;
    }
    if (inFlightRef.current.completing) return null;
    inFlightRef.current.completing = true;
    dispatchRecovery({ type: 'BUSY', busy: 'recover' });
    try {
      const response = await WorkflowClient.completeRecovery({ recoveryId });
      const verdict = judgeRecovery({
        requestedWorkflowId: workflowIdWanted,
        requestedActor: current.requestedActor || urlWorkflowActor,
        response,
      });
      if (verdict.action !== 'recovered') {
        SessionManager.clearSession();
        setSessionId('');
        setSessionMeta(null);
        dispatchRecovery({
          type: 'GATE',
          state: verdict.action === 'mismatch' ? 'mismatch' : 'unavailable',
          reason: verdict.reason || verdict.action,
          received: verdict.received || '',
          status: verdict.status || '',
          challenge: verdict.challenge || null,
        });
        return null;
      }
      SessionManager.setSession(verdict.sessionId, {
        workflowId: verdict.workflowId,
        // Recovery proves ownership of the application, not a fresh actor
        // authentication for a privileged node. The backend decides that later.
        status: 'ANONYMOUS',
        actorId: response?.actor || '',
        ...(response?.actor ? { workflowActor: response.actor } : {}),
      });
      setSessionId(verdict.sessionId);
      setSessionMeta(SessionManager.getSessionMeta());
      dispatchRecovery({ type: 'RECOVERED', sessionId: verdict.sessionId, workflowId: verdict.workflowId });
      await resolveCurrent(verdict.sessionId);
      return verdict;
    } catch (e) {
      SessionManager.clearSession();
      setSessionId('');
      setSessionMeta(null);
      const failure = classifyRecoveryFailure(e, {
        requestedWorkflowId: workflowIdWanted,
        requestedActor: current.requestedActor || urlWorkflowActor,
      });
      if (failure.state === 'challenge') {
        dispatchRecovery({
          type: 'CHALLENGE',
          challenge: failure.challenge,
          requested: workflowIdWanted,
          requestedActor: current.requestedActor || urlWorkflowActor,
          preserveCompleted: true,
        });
      } else {
        dispatchRecovery({
          type: 'GATE',
          state: failure.state === 'mismatch' ? 'mismatch' : failure.state,
          reason: failure.reason,
          challenge: failure.challenge || null,
        });
      }
      return null;
    } finally {
      inFlightRef.current.completing = false;
      dispatchRecovery({ type: 'BUSY', busy: '' });
    }
  }, [resolveCurrent, urlWorkflowActor, urlWorkflowId]);

  // Verified recovery, step 2: the backend sends a code to the number on file.
  const requestVerifiedOtp = useCallback(async () => {
    const challenge = recoveryRef.current.challenge;
    if (!challenge?.recoveryId) {
      throw new Error('The service did not provide a recovery challenge.');
    }
    if (inFlightRef.current.factor) return null;
    inFlightRef.current.factor = 'request';
    dispatchRecovery({ type: 'BUSY', busy: 'otp-request' });
    try {
      const result = await WorkflowClient.requestRecoveryOtp({ recoveryId: challenge.recoveryId });
      dispatchRecovery({
        type: 'CODE_ISSUED',
        expiresAt: result?.expiresAt || '',
        retryAfterSeconds: Number(result?.resendAfterSeconds) || 0,
        sendsRemaining: Number.isFinite(Number(result?.sendsRemaining))
          ? Number(result.sendsRemaining)
          : null,
        deliveryChannel: result?.delivery || '',
        sentTo: result?.sentTo || '',
        otpLength: result?.otpLength,
        attemptsRemaining: result?.attemptsRemaining,
        devCode: result?.code || '',
      });
      return result;
    } catch (e) {
      failFactor(e);
      throw e;
    } finally {
      inFlightRef.current.factor = '';
      dispatchRecovery({ type: 'BUSY', busy: '' });
    }
  }, [failFactor]);

  // Verified recovery, step 3: only the backend's verifiedMethods answer
  // advances the plan. A local "correct-looking" code proves nothing.
  const verifyVerifiedOtp = useCallback(async ({ code } = {}) => {
    const challenge = recoveryRef.current.challenge;
    if (!challenge?.recoveryId) {
      throw new Error('The service did not provide a recovery challenge.');
    }
    if (inFlightRef.current.factor) return null;
    inFlightRef.current.factor = 'verify';
    dispatchRecovery({ type: 'BUSY', busy: 'otp-verify' });
    try {
      const result = await WorkflowClient.verifyRecoveryOtp({
        recoveryId: challenge.recoveryId,
        code,
      });
      const verified = Array.isArray(result?.verifiedMethods) ? result.verifiedMethods : [];
      const missing = Array.isArray(result?.missingMethods) ? result.missingMethods : [];
      dispatchRecovery({
        type: 'FACTORS_VERIFIED',
        completed: verified,
        challenge: {
          completed: verified,
          missingMethods: missing,
          nextStep: result?.nextStep || '',
          status: result?.status || '',
        },
      });
      if (result?.status === 'OK' || missing.length === 0) {
        await completeVerifiedRecovery();
      }
      return result;
    } catch (e) {
      failFactor(e);
      throw e;
    } finally {
      inFlightRef.current.factor = '';
      dispatchRecovery({ type: 'BUSY', busy: '' });
    }
  }, [completeVerifiedRecovery, failFactor]);

  // Entry-point form: an application reference is a request, not a credential.
  // It only names the application; the backend still demands ownership proof.
  const resumeApplication = useCallback(async ({ workflowId = '', workflowActor = '' } = {}) => {
    const requested = sanitizeWorkflowId(workflowId);
    if (!requested) {
      dispatchRecovery({
        type: 'ERROR',
        code: 'INVALID_WORKFLOW_ID',
        message: 'Enter the application ID exactly as it appears in your link (it starts with WF-).',
      });
      return null;
    }
    const actor = normalizeActor(workflowActor) || 'BORROWER';
    const next = new URLSearchParams(searchParams);
    next.set('WORKFLOW_ID', requested);
    next.set('WORKFLOW_ACTOR', actor);
    setSearchParamsRef.current(next, { replace: true });
    dispatchRecovery({ type: 'REQUEST', workflowId: requested, workflowActor: actor });
    return startVerifiedRecovery({ workflowId: requested, workflowActor: actor });
  }, [searchParams, startVerifiedRecovery]);

  // Phase 1 of the backend's own two-phase verification contract.
  const requestRecoveryCode = useCallback(async ({ method, aadhaarNumber } = {}) => {
    const challenge = recoveryRef.current.challenge;
    if (challenge?.recoveryId) {
      return requestVerifiedOtp();
    }
    if (!challenge?.sessionId) {
      throw new Error('The service did not provide a verification session.');
    }
    if (inFlightRef.current.factor) return null;
    inFlightRef.current.factor = 'request';
    dispatchRecovery({ type: 'BUSY', busy: 'otp-request' });
    try {
      const result = await AuthenticationHandler.requestChallenge({
        sessionId: challenge.sessionId,
        method: method || challenge.factors[0]?.method || 'MOBILE_OTP',
        aadhaarNumber,
      });
      if (AuthenticationHandler.isAuthenticatedResponse(result)) {
        // The backend skipped the code step and promoted the session itself.
        dispatchRecovery({
          type: 'FACTOR_CONFIRMED',
          factorId: factorIdOf(challenge, recoveryRef.current.completed),
        });
        await completeRecovery();
        return result;
      }
      if (!result?.challengeId) {
        throw new Error('The service did not return a verification challenge.');
      }
      dispatchRecovery({ type: 'CODE_ISSUED', ...codeIssueFrom(result) });
      return result;
    } catch (e) {
      failFactor(e);
      throw e;
    } finally {
      inFlightRef.current.factor = '';
      dispatchRecovery({ type: 'BUSY', busy: '' });
    }
  }, [completeRecovery, failFactor, requestVerifiedOtp]);

  // Phase 2. Only `authenticated === true` from the backend confirms a factor.
  const verifyRecoveryCode = useCallback(async ({ factorId = '', challengeId = '', otp } = {}) => {
    const current = recoveryRef.current;
    const challenge = current.challenge;
    if (challenge?.recoveryId) {
      return verifyVerifiedOtp({ code: otp });
    }
    if (!challenge?.sessionId) {
      throw new Error('The service did not provide a verification session.');
    }
    if (inFlightRef.current.factor) return null; // never resubmit a code automatically
    inFlightRef.current.factor = 'verify';
    dispatchRecovery({ type: 'BUSY', busy: 'otp-verify' });
    try {
      const result = await AuthenticationHandler.verify({
        sessionId: challenge.sessionId,
        challengeId: challengeId || challenge.challengeId,
        otp,
      });
      if (!AuthenticationHandler.isAuthenticatedResponse(result)) {
        // Nothing is promoted on a partial or unclear answer.
        const notConfirmed = Object.assign(new Error('The code was not confirmed.'), { status: 401 });
        throw notConfirmed;
      }
      dispatchRecovery({
        type: 'FACTOR_CONFIRMED',
        factorId: factorId || factorIdOf(challenge, recoveryRef.current.completed),
      });
      await completeRecovery();
      return result;
    } catch (e) {
      failFactor(e);
      throw e;
    } finally {
      inFlightRef.current.factor = '';
      dispatchRecovery({ type: 'BUSY', busy: '' });
    }
  }, [completeRecovery, failFactor, verifyVerifiedOtp]);

  const verifyRecoveryCaptcha = useCallback(async ({ token, provider, factorId = '' } = {}) => {
    const current = recoveryRef.current;
    const challenge = current.challenge;
    // The verified flow asks for a CAPTCHA before it issues a recoveryId. A
    // second CAPTCHA can also appear if the backend keeps that factor open; in
    // both cases the token is handed to `start`, which verifies it server-side
    // and reuses the pending challenge. No session exists to verify it against.
    if (challenge && (challenge.preflight || challenge.recoveryId)) {
      if (!token) {
        throw new Error('Please complete the security check.');
      }
      if (inFlightRef.current.factor) return null;
      inFlightRef.current.factor = 'captcha';
      dispatchRecovery({ type: 'BUSY', busy: 'captcha' });
      try {
        const started = await startVerifiedRecovery({
          workflowId: challenge.workflowId || current.requested,
          workflowActor: challenge.workflowActor || current.requestedActor,
          captchaToken: token,
        });
        return Boolean(started);
      } catch (e) {
        failFactor(e);
        throw e;
      } finally {
        inFlightRef.current.factor = '';
        dispatchRecovery({ type: 'BUSY', busy: '' });
      }
    }
    if (!challenge?.sessionId) {
      throw new Error('The service did not provide a verification session.');
    }
    if (!token) {
      throw new Error('Please complete the security check.');
    }
    if (inFlightRef.current.factor) return null;
    inFlightRef.current.factor = 'captcha';
    dispatchRecovery({ type: 'BUSY', busy: 'captcha' });
    try {
      // The backend validates the token with the provider. A pass here says
      // nothing about identity and does not authorise the workflow on its own.
      await WorkflowClient.verifyCaptcha({ sessionId: challenge.sessionId, token, provider });
      dispatchRecovery({
        type: 'FACTOR_CONFIRMED',
        factorId: factorId || factorIdOf(challenge, recoveryRef.current.completed),
      });
      await completeRecovery();
      return true;
    } catch (e) {
      failFactor(e);
      throw e;
    } finally {
      inFlightRef.current.factor = '';
      dispatchRecovery({ type: 'BUSY', busy: '' });
    }
  }, [completeRecovery, failFactor, startVerifiedRecovery]);

  // A provider redirect leaves the page; when the user comes back this asks the
  // backend for the verdict instead of trusting anything local.
  const checkRecoveryIdentity = useCallback(async () => completeRecovery(), [completeRecovery]);

  // Opening the provider is not verification. This only confirms the backend
  // supplied a challenge session and an available identity method; the gate
  // still validates the redirect URL, and only completeRecovery() can promote
  // the session when the user returns.
  const startRecoveryIdentity = useCallback(async () => {
    const challenge = recoveryRef.current.challenge;
    if (!challenge?.sessionId) {
      throw new Error('The service did not provide a verification session.');
    }
    if (!challenge.identity?.available) {
      throw new Error('Identity verification is not available for this application.');
    }
    return { started: true, provider: challenge.identity.provider || '' };
  }, []);

  const useRecoveryAlternative = useCallback((factor) => {
    const current = recoveryRef.current;
    if (!current.challenge || !factor?.id) return;
    const active = nextFactor(current.challenge.factors, current.completed);
    if (!active) return;
    dispatchRecovery({ type: 'FACTOR_ALTERNATIVE', factorId: active.id, factor });
  }, []);

  const restartRecovery = useCallback(async () => {
    const current = recoveryRef.current;
    const requested = current.requested || urlWorkflowId;
    if (!requested) {
      dispatchRecovery({ type: 'ENTRY' });
      return null;
    }
    // Once the cookie path has been ruled out, or a verified challenge has
    // already been issued, retrying the cookie would only dead-end again.
    if (
      current.challenge?.recoveryId ||
      current.challenge?.preflight ||
      current.state === 'expired' ||
      current.state === 'locked'
    ) {
      return startVerifiedRecovery({
        workflowId: requested,
        workflowActor: current.requestedActor || urlWorkflowActor,
      });
    }
    dispatchRecovery({
      type: 'REQUEST',
      workflowId: requested,
      workflowActor: current.requestedActor || urlWorkflowActor,
    });
    const sid = await ensureSession({ refreshRecovery: true });
    if (sid) await resolveCurrent(sid);
    return sid || null;
  }, [ensureSession, resolveCurrent, startVerifiedRecovery, urlWorkflowId, urlWorkflowActor]);

  const cancelRecovery = useCallback(() => {
    // Cancelling keeps WORKFLOW_ID / WORKFLOW_ACTOR in the URL: the link still
    // names the application, and nothing is created behind the user's back.
    dispatchRecovery({ type: 'CANCELLED' });
  }, []);

  const publishEvent = useCallback(async ({ node = '', event = '', eventType = '', eventId = '', data = {}, formData = {}, workflowMetadata = {} } = {}) => {
    const sid = SessionManager.getSessionId(searchParams) ?? sessionId;
    try {
      const result = await EventPublisher.publish({
        sessionId: sid || undefined,
        node, event, eventType, eventId, data, formData,
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
    } catch (e) {
      // 409 STEP_OUT_OF_SEQUENCE: the backend already moved on. Re-resolve so the
      // page shows where the application actually is; the caller reports the
      // "no longer current" message instead of a generic failure.
      if (e?.status === 409) await resolveCurrent(sid, { quiet: true });
      throw e;
    }
  }, [searchParams, sessionId, urlWorkflowId, urlWorkflowActor, resolveCurrent]);

  const verifyAuth = useCallback(async ({ challengeId, otp, method, aadhaarNumber } = {}) => {
    const sid = SessionManager.getSessionId(searchParams) ?? sessionId;
    // Phase 1 — the backend issues a challenge; it owns code delivery.
    if (!challengeId) {
      return AuthenticationHandler.requestChallenge({ sessionId: sid, method, aadhaarNumber });
    }
    // Phase 2 — only this response can promote the session.
    const result = await AuthenticationHandler.verify({ sessionId: sid, challengeId, otp });
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
    // Deliberate abandonment: the workflow, its registry record and its drafts
    // stop being this tab's responsibility. A later explicit "start a new
    // application" must never see the previous workflow's form values.
    const detachedWorkflowId = sessionMeta?.workflowId || urlWorkflowId;
    const revokedSessionId = SessionManager.getSessionId(searchParams) || sessionId;
    SessionManager.clearSession();
    if (detachedWorkflowId) DraftStore.clearWorkflowDrafts(detachedWorkflowId);
    // Best effort: end the server-side session too, so a copied cookie cannot
    // keep using it until its TTL. A failed revoke must never block local
    // detachment; the session still expires on its own.
    if (revokedSessionId) {
      WorkflowClient.revokeSession({ sessionId: revokedSessionId }).catch(() => {});
    }
    setSessionId('');
    setSessionMeta(null);
    setResolved(null);
    setAccess({ kind: 'LOADING', resolved: null });
    dispatchRecovery({ type: 'RESET' });
  }, [searchParams, sessionId, sessionMeta, urlWorkflowId]);

  // Explicit user choice: abandon the previous link and open a separate
  // application. No request is needed to detach: creating a session issues a
  // new recovery credential, which replaces the one for the old application.
  const startNewApplication = useCallback(async ({ token } = {}) => {
    if (!token) {
      // Detach locally before presenting the create challenge. Revocation also
      // clears the shared recovery cookie on this backend, so doing it here
      // could race the new application's response and clear its new cookie.
      const detachedWorkflowId = sessionMeta?.workflowId || urlWorkflowId;
      SessionManager.clearSession();
      if (detachedWorkflowId) DraftStore.clearWorkflowDrafts(detachedWorkflowId);
      setSessionId('');
      setSessionMeta(null);
      setResolved(null);
      setAccess({ kind: 'LOADING', resolved: null });
      setError('');
      const next = new URLSearchParams(searchParams);
      next.delete('WORKFLOW_ID');
      next.delete('WORKFLOW_ACTOR');
      setSearchParamsRef.current(next, { replace: true });
      dispatchRecovery({ type: 'ENTRY' });
      return null;
    }

    if (inFlightRef.current.creating) return null;
    inFlightRef.current.creating = true;
    setError('');
    try {
      const sid = await ensureSession({ forceNew: true, captchaToken: token });
      if (!sid) throw new Error('The workflow service did not confirm the new application. Retry safely.');
      dispatchRecovery({ type: 'RESET' });
      await resolveCurrent(sid);
      return sid;
    } finally {
      inFlightRef.current.creating = false;
    }
  }, [searchParams, sessionMeta, urlWorkflowId, ensureSession, resolveCurrent]);

  const cancelNewApplication = useCallback(() => {
    try {
      applicationCreationKeyStore.clear();
    } catch (e) {
      setError(e?.message || 'The pending application request could not be cleared.');
      return false;
    }
    dispatchRecovery({ type: 'RESET' });
    setError('');
    return true;
  }, []);

  useEffect(() => {
    if (!autoStart) return;
    // Intentional one-time mount effect: create session + resolve node on
    // load/reload. Re-running on dependency change would duplicate requests.
    (async () => {
      const sid = await ensureSession();
      // A failed resume leaves no session on purpose: the host renders the
      // explicit choice instead of resolving (which would answer 401).
      if (!sid) return;
      await resolveCurrent(sid);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({
    sessionId, sessionMeta, resolved, access, loading, error, recovery,
    workflowId: urlWorkflowId, workflowActor: urlWorkflowActor,
    ensureSession, resolveCurrent, publishEvent, verifyAuth, verifyCaptchaToken,
    resetSession, startNewApplication, cancelNewApplication,
    startVerifiedRecovery, completeVerifiedRecovery, resumeApplication,
    requestRecoveryCode, verifyRecoveryCode, verifyRecoveryCaptcha,
    checkRecoveryIdentity, startRecoveryIdentity, useRecoveryAlternative, restartRecovery, cancelRecovery,
  }), [
    sessionId, sessionMeta, resolved, access, loading, error, recovery,
    urlWorkflowId, urlWorkflowActor, ensureSession, resolveCurrent, publishEvent,
    verifyAuth, verifyCaptchaToken, resetSession, startNewApplication, cancelNewApplication,
    startVerifiedRecovery, completeVerifiedRecovery, resumeApplication,
    requestRecoveryCode, verifyRecoveryCode, verifyRecoveryCaptcha,
    checkRecoveryIdentity, startRecoveryIdentity, useRecoveryAlternative, restartRecovery, cancelRecovery,
  ]);

  return value;
}

function factorIdOf(challenge, completed = []) {
  return nextFactor(challenge?.factors || [], completed)?.id || '';
}
