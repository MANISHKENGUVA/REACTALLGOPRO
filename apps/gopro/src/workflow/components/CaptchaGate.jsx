import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AUCARD, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { WorkflowClient } from '../WorkflowClient';
import { publicErrorMessage } from '../../utils/security';
import { captchaVersionSupported } from '../recoveryGates';
import { GateLoading, GateUnavailable } from './GateStates';

// CaptchaGate: renders the challenge the backend configured and forwards the
// token. Local completion is proof of nothing — the backend is authoritative.
const SCRIPT_ID = 'recaptcha-api';
const SCRIPT_TIMEOUT_MS = 12000;
const WIDGET_READY_TIMEOUT_MS = 8000;
let loaderPromise = null;

function loadRecaptcha() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(new Error('reCAPTCHA is only available in a browser.'));
  }
  if (window.grecaptcha?.render) return Promise.resolve(window.grecaptcha);
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    let script = document.getElementById(SCRIPT_ID);
    let timeout;
    let settled = false;

    const cleanup = () => {
      clearTimeout(timeout);
      script?.removeEventListener('load', onLoad);
      script?.removeEventListener('error', onError);
    };
    const fail = (message) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (script?.dataset?.goproRecaptcha !== 'loaded') script?.remove();
      reject(new Error(message));
    };
    const onLoad = () => {
      if (window.grecaptcha?.render) {
        settled = true;
        if (script?.dataset) script.dataset.goproRecaptcha = 'loaded';
        cleanup();
        resolve(window.grecaptcha);
      } else {
        fail('The reCAPTCHA script loaded without its widget API.');
      }
    };
    const onError = () => fail('The reCAPTCHA script could not be loaded.');

    if (script?.dataset?.goproRecaptcha === 'loaded' && !window.grecaptcha?.render) {
      script.remove();
      script = null;
    }

    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      if (script.dataset) script.dataset.goproRecaptcha = 'loading';
    }

    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', onError, { once: true });
    timeout = setTimeout(() => fail('The reCAPTCHA script timed out.'), SCRIPT_TIMEOUT_MS);

    if (!script.isConnected) document.head.appendChild(script);
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
  const version = String(config?.version || captcha?.version || 'v2').toLowerCase();
  const supported = captchaVersionSupported(version);
  const busy = Boolean(verifying || submitting);

  useEffect(() => {
    let alive = true;
    setConfig(undefined);
    WorkflowClient.getCaptchaConfig()
      .then((value) => { if (alive) setConfig(value); })
      .catch(() => { if (alive) setConfig(null); });
    return () => { alive = false; };
  }, [configEpoch]);

  useEffect(() => {
    if (!supported || !siteKey || bypassed || !containerRef.current) return undefined;
    if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
      } catch {
        widgetIdRef.current = null;
      }
      if (widgetIdRef.current !== null) return undefined;
    }

    let cancelled = false;
    let settled = false;
    let readyTimer;
    const markUnavailable = () => {
      if (cancelled || settled) return;
      settled = true;
      clearTimeout(readyTimer);
      setWidgetFailed(true);
    };
    const renderWidget = (grecaptcha) => {
      if (cancelled || settled || !containerRef.current) return;
      try {
        const widgetId = grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => { setWidgetToken(token); setExpired(false); setError(''); },
          'expired-callback': () => { setWidgetToken(''); setExpired(true); },
          'error-callback': () => { setWidgetToken(''); setWidgetFailed(true); },
        });
        if (widgetId === undefined || widgetId === null) {
          throw new Error('reCAPTCHA did not return a widget identifier.');
        }
        widgetIdRef.current = widgetId;
        settled = true;
        clearTimeout(readyTimer);
        setWidgetFailed(false);
      } catch {
        // Google can expose the API but reject rendering (for example, an
        // unauthorized site key). Do not leave an empty CAPTCHA area forever.
        markUnavailable();
      }
    };

    loadRecaptcha()
      .then((grecaptcha) => {
        if (cancelled) return;
        readyTimer = setTimeout(markUnavailable, WIDGET_READY_TIMEOUT_MS);
        try {
          // Wait for Google's client initialization before rendering. Some
          // browsers expose `render` before the provider is actually ready.
          if (typeof grecaptcha.ready === 'function') {
            grecaptcha.ready(() => renderWidget(grecaptcha));
          } else {
            renderWidget(grecaptcha);
          }
        } catch {
          markUnavailable();
        }
      })
      .catch(() => { markUnavailable(); });

    return () => {
      cancelled = true;
      clearTimeout(readyTimer);
    };
  }, [config, siteKey, bypassed, supported, widgetEpoch]);

  const resetWidget = useCallback(() => {
    setWidgetToken('');
    const id = widgetIdRef.current;
    if (id !== null && window.grecaptcha?.reset) {
      try {
        window.grecaptcha.reset(id);
      } catch {
        // The widget is gone (unmounted or provider reloaded).
      }
    }
  }, []);

  const reacquire = () => {
    setWidgetFailed(false);
    setError('');
    setExpired(false);
    resetWidget();
    setWidgetEpoch((epoch) => epoch + 1);
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
    const state = <GateLoading title="Loading security check" description="Asking the service which check to display." />;
    if (embedded) return state;
    return <AUCARD className="loan-flow-card"><h2>Security Check</h2>{state}</AUCARD>;
  }

  if (bypassed) {
    const handleBypass = async () => {
      if (busy) return;
      setError('');
      setSubmitting(true);
      try {
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
          Development mode: the server has disabled the security check for this environment. This bypass is rejected in production.
        </p>
        {error ? <p className="au-gate-error" role="alert">{error}</p> : null}
        <div className="au-gate-actions">
          <AUBUTTON variant="primary" onClick={handleBypass} disabled={busy} loading={busy} loadingText="Continuing…">
            {busy ? 'Continuing…' : 'Continue'}
          </AUBUTTON>
        </div>
      </div>
    );
    if (embedded) return <>{state}</>;
    return (
      <AUCARD className="loan-flow-card">
        <h2>Security Check</h2>
        <p className="au-gate-text">Confirm you are human before proceeding to identity document upload.</p>
        {state}
      </AUCARD>
    );
  }

  if (!siteKey || widgetFailed) {
    const state = (
      <GateUnavailable
        title="Security check unavailable"
        message={siteKey
          ? 'The security check could not initialize. Check that this website is authorized for the site key and that your browser allows Google reCAPTCHA, then reload the security check.'
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
      <p className="au-gate-text">This step requires a security check. It confirms you are not a bot — it is not identity verification.</p>
      {expired ? <p className="au-gate-hint au-gate-hint--warning" role="status">The security check expired. Please complete it again.</p> : null}
      <div ref={containerRef} className="au-gate-captcha" />
      {error ? <p className="au-gate-error" role="alert">{error}</p> : null}
      <div className="au-gate-actions">
        <AUBUTTON variant="primary" onClick={handleSubmit} disabled={busy || !widgetToken} loading={busy} loadingText="Verifying…">
          Verify security check
        </AUBUTTON>
        <AUBUTTON variant="ghost" onClick={reacquire} disabled={busy}>Reload security check</AUBUTTON>
      </div>
    </>
  );

  if (embedded) return body;
  return <AUCARD className="loan-flow-card"><h2>Security Check</h2>{body}</AUCARD>;
}
