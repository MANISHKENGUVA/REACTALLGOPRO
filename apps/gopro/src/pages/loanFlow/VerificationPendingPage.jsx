import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUCARD } from 'artiqui/dist/router-engine.es.js';
import {
  assertActorCanView,
  getRouteActor,
  resolveWorkflowRoute,
  WORKFLOW_ROUTE_PATHS,
} from '../../utils/globalRouterNavigator';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { WorkflowResolver } from '../../workflow/WorkflowResolver';
import { safeWorkflowPath } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import ProcessingPanel from '../../components/ui/ProcessingPanel';
import InlineAlert from '../../components/ui/InlineAlert';

const POLL_START_MS = 5000;
const POLL_MAX_MS = 60000;
const NAVIGABLE_PATHS = new Set([
  ...WORKFLOW_ROUTE_PATHS,
  '/loan-flow/not-your-turn',
  '/loan-flow/workflow',
]);

export default function VerificationPendingPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-KYC-V1-VERIFICATION-PENDING-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/verification-pending',
  }), [metadata, searchParams]);

  useEffect(() => {
    if (!workflowMetadata.workflowId || !workflowMetadata.workflowActor) return undefined;

    let cancelled = false;
    let timer = null;
    let delay = POLL_START_MS;

    const poll = async () => {
      try {
        const resolved = await WorkflowResolver.resolve({
          workflowId: workflowMetadata.workflowId,
          workflowActor: workflowMetadata.workflowActor,
        });
        if (cancelled) return;

        // Legacy responses are wrapped by the resolver; unwrap before deciding.
        const result = resolved?.legacy || resolved;
        const status = String(result?.status || '').toUpperCase();
        if (['CAPTCHA_REQUIRED', 'AUTHENTICATION_REQUIRED', 'SESSION_EXPIRED', 'SESSION_INVALID'].includes(status)) {
          navigateRef.current('/loan-flow/workflow');
          return;
        }
        if (!assertActorCanView(result, workflowMetadata.workflowActor)) {
          navigateRef.current('/loan-flow/not-your-turn');
          return;
        }

        const nextRoute = resolveWorkflowRoute(result);
        let destination = nextRoute && safeWorkflowPath(nextRoute, {
          allowedPaths: NAVIGABLE_PATHS,
          allowedParams: ['WORKFLOW_ID', 'WORKFLOW_ACTOR'],
        });

        if (destination) {
          const url = new URL(destination, 'https://app.invalid');
          url.searchParams.set('WORKFLOW_ID', workflowMetadata.workflowId);
          url.searchParams.set(
            'WORKFLOW_ACTOR',
            getRouteActor(url.pathname) || workflowMetadata.workflowActor,
          );
          destination = safeWorkflowPath(`${url.pathname}${url.search}`, {
            allowedPaths: NAVIGABLE_PATHS,
            allowedParams: ['WORKFLOW_ID', 'WORKFLOW_ACTOR'],
          });
        }

        // A pending verdict keeps the user here; only an allowlisted destination
        // that names a different node may move the workflow forward.
        if (destination && !destination.startsWith('/loan-flow/verification-pending')) {
          navigateRef.current(destination);
          return;
        }
        delay = POLL_START_MS;
      } catch {
        // Transport or contract failures must not advance the workflow.
        delay = Math.min(delay * 2, POLL_MAX_MS);
      }

      if (!cancelled) timer = setTimeout(poll, delay);
    };

    timer = setTimeout(poll, POLL_START_MS);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [workflowMetadata]);

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · KYC"
        title="KYC verification pending"
        description="The loan service has not yet returned the next workflow step. This page checks again automatically."
      />

      <AUCARD className="loan-flow-card">
        <ProcessingPanel
          title="Waiting for the verification result"
          description="The browser does not determine liveness, document or credit outcomes. This page will move on when the backend supplies an allowlisted next step."
          steps={[
            'The loan service completes its checks',
            'The next workflow state becomes available',
            'This page navigates to the server-provided step',
          ]}
        />

        <InlineAlert tone="info" title="You can leave this page open">
          <p>Rechecks happen automatically. If the session expires, you will be asked to sign in again.</p>
        </InlineAlert>
      </AUCARD>
    </div>
  );
}
