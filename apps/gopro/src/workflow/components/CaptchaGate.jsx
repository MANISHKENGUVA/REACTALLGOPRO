import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AUCARD, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { WorkflowClient } from '../WorkflowClient';
import { publicErrorMessage } from '../../utils/security';
import { captchaVersionSupported } from '../recoveryGates';
import { GateLoading, GateUnavailable } from './GateStates';

// CaptchaGate: renders the challenge the backend configured and forwards the
// token. Local completion is proof of nothing — /workflow/captcha/verify is
// authoritative, and `bypassed` comes from the server, never from the browser.
// A security check is not identity verification and never promotes a session.
const SCRIPT_ID = 'recaptcha-api';
let loaderPromise = null;

function loadRecaptcha() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.grecaptcha?.render) return Promise.resolve(window.grecaptcha);
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    const ready = () => (window.grecaptcha?.render ? resolve(window.grecaptcha) : reject(new Error('recaptcha unavailable')));
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', ready, { once: true });
      existing.addEventListener('error', () => reject(new Error('recaptcha unavailable')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = ready;
    script.onerror = () => reject(new Error('recaptcha unavailable'));
    document.head.appendChild(script);
  }).catch((error) => {
    loaderPromise = null;
    throw error;
  });
  return loaderPromise;
}

function captchaErrorMessage(error) {
  const status = Number(error?.status);
  const code = String(error?.payload?.code || '').toUpperCase();
  if (code === 'CAPTCHA_REQUIRED' || code === 'CAPTCHA_INVALID') {
    return 'The security check expired or was rejected. Complete it again and retry.';
  }
  if (code === 'IDEMPOTENCY_KEY_REQUIRED' || code === 'INVALID_IDEMPOTENCY_KEY') {
    return 'The request could not be safely identified. Retry this attempt; its request key will be reused.';
  }
  if (code === 'NEW_APPLICATION_REQUIRED') {
    return 'The service did not accept the new-application request. Please try again.';
  }
  if (code === 'IDEMPOTENCY_KEY_REUSED' || code === 'IDEMPOTENCY_RESULT_UNAVAILABLE') {
    return 'The service could not confirm whether this application was created. Reload to check its status or contact support before starting another application.';
  }
  if (status === 429) return 'Too many attempts. Please wait and try again.';
  if (status === 501 || status === 503) return 'The security check is not available right now. Please try again later.';
  if (status === 401 || status === 403) return 'The security check was rejected. Please complete it again.';
  return publicErrorMessage(error, 'Security check verification failed. Please try again.');
}

export default function CaptchaGate({ captcha, onVerify, onRetry, verifying, embedded = false }) {
  const [config, setConfig] = useState(undefined); // undefined = probing, null = unavailable
  const [widgetToken, setWidgetToken] = useState('');
  const [widgetFailed, setWidgetFailed] = useState(false);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [widgetEpoch, setWidgetEpoch] = useState(0);
  const [configEpoch, setConfigEpoch] = useState(0);
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const bypassed = Boolean(config?.bypassed);
  const siteKey = config?.siteKey || captcha?.siteKey || '';
  // Only the version the service configured is ever rendered; v2 is the only
  // explicit-render build supported, so anything else fails closed.
  const version = String(config?.version || captcha?.version || 'v2').toLowerCase();
  const supported = captchaVersionSupported(version);
  const busy = Boolean(verifying || submitting);

  useEffect(() => {
    let alive = true;
    // The probe only decides which widget to render. It never decides whether
    // the challenge is required — the resolve/recovery payload already did.
    setConfig(undefined);
    WorkflowClient.getCaptchaConfig()
      .then((value) => { if (alive) setConfig(value); })
      .catch(() => { if (alive) setConfig(null); });
    return () => { alive = false; };
  }, [configEpoch]);

  useEffect(() => {
    if (!supported || !siteKey || bypassed || !containerRef.current) return undefined;
    // A widget already bound to this container only needs a reset; rendering a
    // second one into the same node would fail.
    if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
      } catch {
        widgetIdRef.current = null;
      }
      if (widgetIdRef.current !== null) return undefined;
    }
    let cancelled = false;
    loadRecaptcha()
      .then((grecaptcha) => {
        if (cancelled || !containerRef.current || widgetIdRef.current !== null) return;
        widgetIdRef.current = grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => { setWidgetToken(token); setExpired(false); setError(''); },
          'expired-callback': () => { setWidgetToken(''); setExpired(true); },
          'error-callback': () => { setWidgetToken(''); setWidgetFailed(true); },
        });
      })
      .catch(() => { if (!cancelled) setWidgetFailed(true); });
    return () => { cancelled = true; };
  }, [config, siteKey, bypassed, supported, widgetEpoch]);

  // A token is single-use: every attempt (accepted or not) reacquires one.
  const resetWidget = useCallback(() => {
    setWidgetToken('');
    const id = widgetIdRef.current;
    if (id !== null && window.grecaptcha?.reset) {
      try {
        window.grecaptcha.reset(id);
      } catch {
        // The widget is gone (unmounted or provider reloaded) — nothing to reset.
      }
    }
  }, []);

  const reacquire = () => {
    setWidgetFailed(false);
    setError('');
    setExpired(false);
    resetWidget();
    setWidgetEpoch((epoch) => epoch + 1);
    // Re-probe the public config as well: a missing site key or a failed probe
    // is exactly the case this retry exists for.
    setConfigEpoch((epoch) => epoch + 1);
  };

  const handleSubmit = async () => {
    const token = widgetToken;
    if (!token) {
      setError('Please complete the security check.');
      return;
    }
    if (busy) return;
    setError('');
    setSubmitting(true);
    try {
      // The backend validates with the provider; nothing is verified here.
      await onVerify?.({ token, provider: version });
      resetWidget();
    } catch (e) {
      setError(captchaErrorMessage(e));
      resetWidget();
    } finally {
      setSubmitting(false);
    }
  };

  if (!supported) {
    const state = (
      <GateUnavailable
        title="Security check unavailable"
        message={`The security check version configured by the service (${version || 'unknown'}) is not supported by this build.`}
        onRetry={onRetry}
        retryLabel="Check again"
        busy={busy}
      />
    );
    if (embedded) return state;
    return <AUCARD className="loan-flow-card"><h2>Security Check</h2>{state}</AUCARD>;
  }

  if (config === undefined) {
    const state = (
      <GateLoading
        title="Loading security check"
        description="Asking the service which check to display."
      />
    );
    if (embedded) return state;
    return <AUCARD className="loan-flow-card"><h2>Security Check</h2>{state}</AUCARD>;
  }

  if (bypassed) {
    // The service explicitly reported that reCAPTCHA is disabled for this
    // environment. Say so plainly instead of drawing a fake widget: a checkbox
    // that verifies nothing trains users to trust the wrong signal.
    const handleBypass = async () => {
      if (busy) return;
      setError('');
      setSubmitting(true);
      try {
        // The server ignores the token while bypass is active; it is sent only
        // so the request shape stays identical to the verified path.
        await onVerify?.({ token: 'dev-bypass', provider: version });
      } catch (e) {
        setError(captchaErrorMessage(e));
      } finally {
        setSubmitting(false);
      }
    };

    const state = (
      <div className="au-gate-stack">
        <p className="au-gate-hint au-gate-hint--warning" role="status">
          Development mode: the server has disabled the security check for this
          environment. This bypass is rejected in production.
        </p>

        {error ? <p className="au-gate-error" role="alert">{error}</p> : null}

        <div className="au-gate-actions">
          <AUBUTTON
            variant="primary"
            onClick={handleBypass}
            disabled={busy}
            loading={busy}
            loadingText="Continuing…"
          >
            {busy ? 'Continuing…' : 'Continue'}
          </AUBUTTON>
        </div>
      </div>
    );
    if (embedded) return <>{state}</>;
    return (
      <AUCARD className="loan-flow-card">
        <h2>Security Check</h2>
        <p className="au-gate-text">
          Confirm you are human before proceeding to identity document upload.
        </p>
        {state}
      </AUCARD>
    );
  }

  if (!siteKey || widgetFailed) {
    const state = (
      <GateUnavailable
        title="Security check unavailable"
        message={siteKey
          ? 'The security check could not load in this browser. Reload it, or try again later.'
          : 'The service did not provide a security check key, so this step cannot be completed.'}
        onRetry={reacquire}
        retryLabel="Reload security check"
        busy={busy}
      />
    );
    if (embedded) return state;
    return <AUCARD className="loan-flow-card"><h2>Security Check</h2>{state}</AUCARD>;
  }

  const body = (
    <>
      <p className="au-gate-text">
        This step requires a security check. It confirms you are not a bot — it is not identity verification.
      </p>
      {expired ? (
        <p className="au-gate-hint au-gate-hint--warning" role="status">
          The security check expired. Please complete it again.
        </p>
      ) : null}

      <div ref={containerRef} className="au-gate-captcha" />

      {error ? <p className="au-gate-error" role="alert">{error}</p> : null}

      <div className="au-gate-actions">
        <AUBUTTON
          variant="primary"
          onClick={handleSubmit}
          disabled={busy || !widgetToken}
          loading={busy}
          loadingText="Verifying…"
        >
          Verify security check
        </AUBUTTON>
        <AUBUTTON variant="ghost" onClick={() => onRetry?.()} disabled={busy}>Check again</AUBUTTON>
      </div>
    </>
  );

  if (embedded) return body;

  return (
    <AUCARD className="loan-flow-card">
      <h2>Security Check</h2>
      {body}
    </AUCARD>
  );
}
