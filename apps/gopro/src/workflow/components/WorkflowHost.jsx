import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useWorkflowSession } from '../useWorkflowSession';
import { AccessHandler } from '../AccessHandler';
import { routeForResolvedNode } from '../NodeRenderer';
import { getRouteActor } from '../../utils/globalRouterNavigator';
import { isValidWorkflowId, normalizeActor, safeWorkflowPath } from '../../utils/security';
import CaptchaGate from './CaptchaGate';
import AuthGate from './AuthGate';
import WorkflowRecoveryGate from './WorkflowRecoveryGate';
import { Button, Card, ErrorState, InlineAlert as Alert, LoadingState, PageHeader, StatusHero } from '../../components/ui';

// WorkflowHost: session-aware entry that lets the BACKEND decide the node.
// - Anonymous users flow through PUBLIC nodes with no login.
// - CAPTCHA / AUTH gates render only on backend demand.
// - INTERNAL nodes render a safe waiting state (never privileged UI).
// - Reload re-resolves from backend; frontend never assumes previous page.
export default function WorkflowHost() {
  const session = useWorkflowSession({ autoStart: true });
  const [captchaEpoch, setCaptchaEpoch] = useState(0);
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const { publishWorkflowData } = outletContext;
  const { access, resolved, loading, error, workflowId, workflowActor, recovery } = session;

  // The shell owns the sidebar, but this route is its child, so the resolved
  // node has to travel upward. Only the backend answer is published.
  useEffect(() => {
    publishWorkflowData?.(resolved || null);
  }, [publishWorkflowData, resolved]);

  const suggestedRoute = useMemo(() => routeForResolvedNode(resolved), [resolved]);

  // INTERNAL means "we are still processing". Re-check quietly (no loading
  // flash). NOT_YOUR_TURN only changes when the other actor acts, so it is
  // polled slower on purpose.
  const { resolveCurrent } = session;
  const resolvedStatus = String(resolved?.status || '').toUpperCase();
  useEffect(() => {
    if (access.kind !== 'INTERNAL') return undefined;
    const interval = resolvedStatus === 'NOT_YOUR_TURN' ? 15000 : 5000;
    const timer = setInterval(() => { resolveCurrent(null, { quiet: true }); }, interval);
    return () => clearInterval(timer);
  }, [access.kind, resolvedStatus, resolveCurrent]);

  const startOver = async () => {
    // Explicitly enter the new-application flow; creation waits for CAPTCHA.
    await session.startNewApplication();
  };

  const goToSuggested = useCallback(() => {
    if (!suggestedRoute) return;
    const safeRoute = safeWorkflowPath(suggestedRoute, {
      allowedParams: ['WORKFLOW_ID', 'WORKFLOW_ACTOR'],
    });
    if (!safeRoute) return;
    const url = new URL(safeRoute, 'https://app.invalid');
    if (isValidWorkflowId(workflowId)) url.searchParams.set('WORKFLOW_ID', workflowId);
    const destinationActor = getRouteActor(url.pathname) || normalizeActor(workflowActor);
    if (destinationActor) url.searchParams.set('WORKFLOW_ACTOR', destinationActor);
    navigate(`${url.pathname}${url.search}`);
  }, [suggestedRoute, workflowId, workflowActor, navigate]);

  // Automatically proceed to the destination page once a security check (CAPTCHA or AUTH) completes.
  const prevKindRef = useRef(access.kind);
  useEffect(() => {
    const wasGate = prevKindRef.current === 'CAPTCHA' || prevKindRef.current === 'AUTH';
    prevKindRef.current = access.kind;
    if (wasGate && access.kind === 'PUBLIC' && suggestedRoute && isValidWorkflowId(workflowId)) {
      goToSuggested();
    }
  }, [access.kind, suggestedRoute, workflowId, goToSuggested]);

  // Recovery runs before every other branch: a resume failure is a decision for
  // the borrower (retry, or start a separate application), not an error card
  // and never an automatic new application.
  if (recovery.state === 'requesting') {
    return (
      <div className="gp-page">
        <PageHeader
          eyebrow="Application recovery"
          title="Resuming your application"
          description="Checking this link against the application on the server. Nothing is created while we check."
        />
        <Card>
          <LoadingState
            title="Checking your saved sign-in"
            description="This usually takes a moment. Keep this page open."
          />
        </Card>
      </div>
    );
  }

  if (recovery.state === 'entry') {
    return (
      <div className="gp-page">
        <PageHeader
          eyebrow="New application"
          title="Start a new application"
          description="No application is created until you complete this security check."
        />
        <Card>
          {error ? <Alert tone="error" title="Application request needs attention">{error}</Alert> : null}
          <CaptchaGate
            key={captchaEpoch}
            captcha={{ required: true, version: 'v2' }}
            verifying={loading}
            onVerify={session.startNewApplication}
            onRetry={() => setCaptchaEpoch((epoch) => epoch + 1)}
          />
          <div className="gp-form-actions">
            <Button
              variant="secondary"
              disabled={loading}
              onClick={() => {
                if (session.cancelNewApplication()) navigate('/');
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (recovery.state === 'unavailable' || recovery.state === 'mismatch' || recovery.state === 'cancelled') {
    return (
      <div className="gp-page">
        <PageHeader
          eyebrow="Application recovery"
          title="Resume your application"
          description="The saved sign-in could not open this application automatically."
        />
        <RecoveryCard
          recovery={recovery}
          onRetry={() => session.restartRecovery()}
          onStartNew={session.startNewApplication}
        />
      </div>
    );
  }

  // The backend named a verification instead of refusing outright. Render only
  // what it asked for, in its order, and keep the application identity intact.
  if (recovery.state === 'challenge' || recovery.state === 'expired') {
    return (
      <WorkflowRecoveryGate
        recovery={recovery}
        onRequestCode={session.requestRecoveryCode}
        onVerifyCode={session.verifyRecoveryCode}
        onVerifyCaptcha={session.verifyRecoveryCaptcha}
        onStartIdentity={session.startRecoveryIdentity}
        onCheckIdentity={session.checkRecoveryIdentity}
        onUseAlternative={session.useRecoveryAlternative}
        onRestart={session.restartRecovery}
        onCancel={session.cancelRecovery}
      />
    );
  }

  if (recovery.state === 'locked') {
    return (
      <div className="gp-page">
        <PageHeader
          eyebrow="Application recovery"
          title="Too many attempts"
          description="Recovery is paused for now. Your application was not restarted and nothing was created."
        />
        <StatusHero
          tone="warning"
          icon="lock"
          title="Verification is temporarily locked"
          actions={(
            <>
              <Button onClick={() => session.restartRecovery()}>Try again</Button>
              <Button variant="outline" onClick={() => session.startNewApplication()}>
                Start a new application
              </Button>
            </>
          )}
        >
          <p>Wait a moment before trying again, or start a separate application if this link is not yours.</p>
        </StatusHero>
      </div>
    );
  }

  if (access.kind === 'LOADING' || loading) {
    return (
      <div className="gp-page">
        <PageHeader
          eyebrow="Application hub"
          title="Loading your application"
          description="Resolving your current step from the loan service."
        />
        <Card>
          <LoadingState
            title="Checking your current step"
            description="The page will open when the service confirms where the application is."
          />
        </Card>
      </div>
    );
  }

  if (error && !resolved) {
    return (
      <div className="gp-page">
        <PageHeader
          eyebrow="Application hub"
          title="We could not load your application"
          description="The loan service did not answer. Nothing has been submitted or changed."
        />
        <ErrorState
          title="The workflow service is unavailable"
          description={error}
          retryLabel="Retry"
          onRetry={() => session.resolveCurrent()}
        />
      </div>
    );
  }

  if (access.kind === 'SESSION_EXPIRED' || access.kind === 'SESSION_INVALID') {
    return (
      <div className="gp-page">
        <PageHeader
          eyebrow="Application hub"
          title="Your session has ended"
          description="The saved session is no longer valid. Reopening this application requires a fresh session."
        />
        <StatusHero
          tone="warning"
          icon="logout"
          title="Session expired"
          actions={<Button onClick={startOver}>Start a new application</Button>}
        >
          <p>Starting again begins a new application. Your previous application is not reused.</p>
        </StatusHero>
      </div>
    );
  }

  if (access.kind === 'COMPLETED') {
    return (
      <div className="gp-page">
        <PageHeader
          eyebrow="Application"
          title="Application completed"
          description="The loan service reports that this application has finished its workflow."
        />
        <StatusHero
          tone="success"
          icon="check"
          title="Nothing further is required"
          meta={workflowId ? (
            <span>Application <span className="gp-meta-row__id">{workflowId}</span></span>
          ) : null}
        >
          <p>This application has no pending step. Keep the application ID for your records.</p>
        </StatusHero>
      </div>
    );
  }

  if (access.kind === 'DENIED') {
    return (
      <div className="gp-page">
        <PageHeader
          eyebrow="Application access"
          title="This step is not available to you"
          description="The loan service refused access to this step for the current actor."
        />
        <StatusHero
          tone="danger"
          icon="lock"
          title="Access denied"
          actions={<Button onClick={() => session.resolveCurrent()}>Check again</Button>}
        >
          <p>
            The backend did not authorise this actor to act on the current step. Nothing
            was submitted or changed. Signing in as the correct actor may be required.
          </p>
        </StatusHero>
      </div>
    );
  }

  if (access.kind === 'CAPTCHA') {
    return (
      <div className="gp-page">
        <PageHeader
          eyebrow="Security check"
          title="Confirm you are human"
          description="The loan service requires this check before it will show the next step."
        />
        <CaptchaGate
          captcha={AccessHandler.captchaInfo(resolved)}
          verifying={loading}
          onVerify={session.verifyCaptchaToken}
          onRetry={() => session.resolveCurrent()}
        />
      </div>
    );
  }

  if (access.kind === 'AUTH') {
    return (
      <div className="gp-page">
        <PageHeader
          eyebrow="Sign in"
          title="Verify it’s you"
          description="The loan service requires an authenticated actor for this step."
        />
        <AuthGate
          methods={AccessHandler.authMethods(resolved)}
          verifying={loading}
          expired={Boolean(resolved?.authenticationExpired)}
          onVerify={session.verifyAuth}
        />
      </div>
    );
  }

  if (access.kind === 'INTERNAL') {
    return (
      <div className="gp-page">
        <PageHeader
          eyebrow="Application hub"
          title="This step is being processed"
          description="The loan service is handling this step. You do not need to submit anything else."
        />
        <StatusHero
          tone="warning"
          icon="clock"
          title="Waiting for the loan team"
          actions={<Button variant="secondary" onClick={() => session.resolveCurrent()}>Refresh status</Button>}
        >
          <p>This page refreshes periodically. You can safely leave it and return later.</p>
        </StatusHero>
      </div>
    );
  }

  // PUBLIC (including legacy OK): backend says render node.
  // Every page URL carries WORKFLOW_ID, and the page loader refuses to open
  // without it. Without the id the Continue button would bounce straight back
  // here, so say what is missing instead of looping.
  const canContinue = Boolean(suggestedRoute) && isValidWorkflowId(workflowId);

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Application hub"
        title="Continue your application"
        description="The loan service has confirmed your current step. Continue when you are ready."
        meta={workflowId ? (
          <span>Application <span className="gp-meta-row__id">{workflowId}</span></span>
        ) : null}
      />
      <Card>
        <StatusHero
          tone="info"
          icon="arrowRight"
          title={resolved?.node ? 'Your next step is ready' : 'Continue where you left off'}
          actions={canContinue ? (
            <Button onClick={goToSuggested} rightIcon={<span aria-hidden="true">→</span>}>
              Continue
            </Button>
          ) : null}
        >
          {resolved?.node || resolved?.component ? (
            <p>{`Next: ${resolved?.node || resolved?.component}`}</p>
          ) : (
            <p>The service is ready for you to continue.</p>
          )}
          {suggestedRoute && !canContinue ? (
            <Alert tone="warning" title="The application ID is missing" live={false}>
              The workflow service did not return a workflow ID, so the next step cannot be opened safely.
            </Alert>
          ) : null}
        </StatusHero>
      </Card>
    </div>
  );
}

function RecoveryCard({ recovery, onRetry, onStartNew }) {
  const mismatch = recovery.state === 'mismatch';
  const cancelled = recovery.state === 'cancelled';
  const title = mismatch
    ? 'This link no longer matches'
    : cancelled ? 'Recovery cancelled' : 'We could not resume this application';
  const description = mismatch
    ? 'The application behind this link is not the one the server returned, so it was not opened.'
    : cancelled
      ? 'Nothing was changed. You can try the verification again, or start a separate application.'
      : 'The saved sign-in for this application is missing or has expired on this browser.';

  return (
    <StatusHero
      tone={mismatch ? 'danger' : 'warning'}
      icon={mismatch ? 'alert' : 'lock'}
      title={title}
      actions={(
        <>
          <Button onClick={() => onRetry()}>Try again</Button>
          <Button variant="outline" onClick={() => onStartNew()}>Start a new application</Button>
        </>
      )}
      meta={recovery.requested ? `Requested application: ${recovery.requested}` : null}
    >
      <p>{description}</p>
      {recovery.requested ? (
        <p>Starting a new application will not resume {recovery.requested}.</p>
      ) : null}
    </StatusHero>
  );
}
