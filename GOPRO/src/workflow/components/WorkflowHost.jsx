import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUCARD, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import { useWorkflowSession } from '../useWorkflowSession';
import { AccessHandler } from '../AccessHandler';
import { routeForResolvedNode } from '../NodeRenderer';
import CaptchaGate from './CaptchaGate';
import AuthGate from './AuthGate';

// WorkflowHost: session-aware entry that lets the BACKEND decide the node.
// - Anonymous users flow through PUBLIC nodes with no login.
// - CAPTCHA / AUTH gates render only on backend demand.
// - INTERNAL nodes render a safe waiting state (never privileged UI).
// - Reload re-resolves from backend; frontend never assumes previous page.
export default function WorkflowHost() {
  const session = useWorkflowSession({ autoStart: true });
  const navigate = useNavigate();
  const { access, resolved, loading, error, sessionId } = session;

  const suggestedRoute = useMemo(() => routeForResolvedNode(resolved), [resolved]);

  const goToSuggested = () => {
    if (suggestedRoute) {
      const url = new URL(suggestedRoute, window.location.origin);
      if (sessionId) url.searchParams.set('sessionId', sessionId);
      navigate(url.pathname + url.search);
    }
  };

  if (access.kind === 'LOADING' || loading) {
    return (
      <AUCARD className="loan-flow-card">
        <h2>Loading workflow…</h2>
        <p style={{ color: '#666' }}>Resolving your current step from the backend.</p>
      </AUCARD>
    );
  }

  if (error && !resolved) {
    return (
      <AUCARD className="loan-flow-card">
        <h2>Workflow unavailable</h2>
        <p style={{ color: '#c00' }}>{error}</p>
        <AUBUTTON variant="primary" onClick={() => session.resolveCurrent()}>Retry</AUBUTTON>
      </AUCARD>
    );
  }

  if (access.kind === 'CAPTCHA') {
    return (
      <CaptchaGate
        captcha={AccessHandler.captchaInfo(resolved)}
        sessionId={sessionId}
        verifying={loading}
        onVerify={session.verifyCaptchaToken}
      />
    );
  }

  if (access.kind === 'AUTH' || access.kind === 'SESSION_INVALID') {
    return (
      <AuthGate
        methods={AccessHandler.authMethods(resolved)}
        sessionId={sessionId}
        verifying={loading}
        onVerify={session.verifyAuth}
      />
    );
  }

  if (access.kind === 'INTERNAL') {
    return (
      <AUCARD className="loan-flow-card">
        <h2>Not your turn</h2>
        <p style={{ color: '#666' }}>This step is handled internally. Please wait or refresh.</p>
        <AUBUTTON variant="primary" onClick={() => session.resolveCurrent()}>Refresh status</AUBUTTON>
      </AUCARD>
    );
  }

  // PUBLIC (including legacy OK): backend says render node.
  return (
    <AUCARD className="loan-flow-card">
      <h2>{resolved?.node || 'Continue'}</h2>
      <p style={{ color: '#666' }}>
        {resolved?.component ? `Next: ${resolved.component}` : 'Continue your application.'}
      </p>
      {suggestedRoute ? (
        <AUBUTTON variant="primary" onClick={goToSuggested}>Continue</AUBUTTON>
      ) : null}
    </AUCARD>
  );
}
