import {
  isValidWorkflowId,
  normalizeActor,
  normalizeStateId,
  sanitizeSessionId,
  sanitizeWorkflowId,
} from '../utils/security';
import { COMPONENT_ROUTE_MAP } from '../utils/globalRouterNavigator';
import { getLegacyState } from './legacyStates';
import { getWorkflowState, parseWorkflowState } from './workflowConfig';

// Routes that exist in the router but are deliberately absent from the
// backend component-key map (operator screens, re-resolve hub).
const EXTRA_ROUTE_PATHS = [
  '/loan-flow/coborrower-kyc',
  '/loan-flow/disbursement-request',
  '/loan-flow/not-your-turn',
  '/loan-flow/workflow',
];

const ALLOWED_ROUTE_PATHS = new Set([...Object.values(COMPONENT_ROUTE_MAP), ...EXTRA_ROUTE_PATHS]);

function trustedState(stateId) {
  const value = normalizeStateId(stateId);
  if (!value) throw new Error('The workflow page has an invalid default state.');

  const legacy = getLegacyState(value);
  if (legacy) {
    return {
      stateId: legacy.stateId,
      actor: legacy.actor,
      componentKey: legacy.componentKey,
      routes: legacy.routes,
    };
  }

  // The state must exist in the compiled-in V6 table; a merely well-shaped
  // identifier from route metadata or a URL is not authoritative.
  const parsed = parseWorkflowState(value);
  if (!parsed || !getWorkflowState(value)) {
    throw new Error('The workflow page has an invalid default state.');
  }
  return {
    stateId: parsed.stateId,
    actor: parsed.actor,
    componentKey: `${parsed.node}-${parsed.nodeVersion}`,
    routes: null,
  };
}

// Build authoritative workflow metadata for a page. URL-supplied STATE and
// COMPONENT_KEY values are deliberately ignored: a user must not be able to
// re-label the current page as a more privileged node. The only accepted state
// is the page's compiled-in default (or a metadata prop supplied by the route
// table), and the URL actor must match that state's actor.
export function buildPageMetadata({
  defaultStateId,
  metadata = null,
  searchParams = null,
  routePath = '',
} = {}) {
  const state = trustedState(metadata?.componentViewRenderState || defaultStateId);

  if (metadata?.componentKey) {
    const suppliedKey = String(metadata.componentKey).trim().toUpperCase();
    if (suppliedKey !== state.componentKey) {
      throw new Error('The workflow page metadata does not match its state.');
    }
  }

  if (routePath && !ALLOWED_ROUTE_PATHS.has(routePath)) {
    throw new Error('The workflow page is not registered.');
  }
  if (state.routes && routePath && !state.routes.includes(routePath)) {
    throw new Error('This workflow state is not valid for the current page.');
  }

  const requestedActor = normalizeActor(searchParams?.get?.('WORKFLOW_ACTOR'));
  if (requestedActor && requestedActor !== state.actor) {
    throw new Error('The requested actor cannot access this workflow state.');
  }

  const rawWorkflowId =
    searchParams?.get?.('WORKFLOW_ID') ||
    metadata?.workflowId ||
    '';
  if (rawWorkflowId && !isValidWorkflowId(rawWorkflowId)) {
    throw new Error('The workflow identifier is invalid.');
  }

  // Read-only acknowledgement of the session identifier. It is never written
  // to workflow metadata, URLs, or logs.
  sanitizeSessionId(searchParams?.get?.('sessionId'));

  return {
    componentViewRenderState: state.stateId,
    componentKey: state.componentKey,
    workflowId: sanitizeWorkflowId(rawWorkflowId),
    workflowActor: state.actor,
  };
}
