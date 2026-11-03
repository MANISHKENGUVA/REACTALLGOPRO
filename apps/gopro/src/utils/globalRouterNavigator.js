import { getWorkflowState, isWorkflowActor, parseWorkflowState } from '../workflow/workflowConfig';
import { getLegacyState, LEGACY_WORKFLOW_STATES } from '../workflow/legacyStates';
import { COMPONENT_ROUTE_MAP, WORKFLOW_ROUTE_PATHS } from '../workflow/routeMap';
import {
  buildRouteActorMap,
  getRouteActorFromMap,
  ROUTE_ACTOR_OVERRIDES,
} from '../workflow/routeActorPolicy';
import loanFlow from '../loanFlowV6.json';
import { normalizeActor, sanitizeWorkflowId } from './security';

export { COMPONENT_ROUTE_MAP, WORKFLOW_ROUTE_PATHS };

// Route path -> permitted workflow actor. This is used when the backend points
// the browser at the next node: the actor must come from the destination page,
// never from the page the user just left.
export const ROUTE_ACTORS = buildRouteActorMap({
  states: loanFlow.states,
  routeMap: COMPONENT_ROUTE_MAP,
  legacyStates: LEGACY_WORKFLOW_STATES,
  overrides: ROUTE_ACTOR_OVERRIDES,
});

export function getRouteActor(routePath) {
  return getRouteActorFromMap(ROUTE_ACTORS, routePath);
}

export function workflowViewData(workflowResult) {
  return workflowResult?.componentviewrender || workflowResult?.data?.componentviewrender ||
    workflowResult?.data || workflowResult || null;
}

export function getResolvedWorkflowState(workflowResult) {
  const viewData = workflowViewData(workflowResult);
  const candidates = [
    viewData?.componentviewrenderState,
    viewData?.componentState,
    workflowResult?.node,
    workflowResult?.state,
    viewData?.state,
    viewData?.node,
    viewData?.componentKey,
  ];
  for (const candidate of candidates) {
    if (parseWorkflowState(candidate)) {
      try {
        const state = getWorkflowState(candidate);
        if (state) return state;
      } catch {
        // A backend value that disagrees with the local state table is not
        // authoritative; fall through to the legacy allowlist.
      }
    }
    const legacy = getLegacyState(candidate);
    if (legacy) {
      return {
        stateId: legacy.stateId,
        metadata: {
          actor: legacy.actor,
          node: legacy.componentKey,
          nodeVersion: '',
          module: '',
          moduleVersion: '',
        },
      };
    }
  }
  return null;
}

export function assertActorCanView(workflowResult, requestedActor) {
  if (!isWorkflowActor(requestedActor)) throw new Error('A valid workflow actor is required');
  const actor = normalizeActor(requestedActor);
  const state = getResolvedWorkflowState(workflowResult);
  const responseActor = workflowResult?.actor || workflowResult?.workflowActor ||
    workflowViewData(workflowResult)?.actor;
  if (state && state.metadata.actor !== actor) return false;
  if (responseActor && normalizeActor(responseActor) !== actor) return false;
  return true;
}

export const resolveWorkflowRoute = (workflowResult) => {
  if (!workflowResult) return null;

  const viewData = workflowResult?.componentviewrender || workflowResult?.data || workflowResult;

  // Check for NOT_YOUR_TURN status before component-based routing
  const workflowStatus = workflowResult?.status || workflowResult?.data?.status || viewData?.status;
  if (workflowStatus === 'NOT_YOUR_TURN') {
    const url = new URL('/loan-flow/not-your-turn', window.location.origin);
    const workflowId = sanitizeWorkflowId(workflowResult?.workflowId || viewData?.workflowId);
    const workflowActor = normalizeActor(workflowResult?.workflowActor || viewData?.workflowActor);
    if (workflowId) url.searchParams.set('WORKFLOW_ID', workflowId);
    if (workflowActor) url.searchParams.set('WORKFLOW_ACTOR', workflowActor);
    return url.pathname + url.search;
  }

  const componentKey = viewData?.componentKey || viewData?.componentviewrender?.componentKey;
  const componentName = viewData?.component || viewData?.componentviewrender?.component;
  const moduleName = viewData?.module || viewData?.componentviewrender?.module;
  // Only the state id is actor-qualified: COBORROWER-KYC-V1-KYC-UPLOAD-V1 and
  // BORROWER-KYC-V1-KYC-UPLOAD-V1 share node/component/module metadata, so the
  // component key is not enough to pick a page. V6 responses carry the state as
  // `node`; legacy responses carry it as componentviewrenderState.
  const stateName = viewData?.componentviewrenderState || viewData?.componentState ||
    workflowResult?.state || workflowResult?.node || viewData?.state || viewData?.node;

  const keyToMatch = String(componentKey || '').toUpperCase();
  const componentToMatch = String(componentName || '').toUpperCase();
  const moduleToMatch = String(moduleName || '').toUpperCase();
  const stateToMatch = String(stateName || '').toUpperCase();
  const stateSuffix = stateToMatch.split('-').slice(-2).join('-');
  const stateLastPart = stateToMatch.split('-').slice(-1)[0];

  const route =
    COMPONENT_ROUTE_MAP[stateToMatch] ||
    COMPONENT_ROUTE_MAP[keyToMatch] ||
    COMPONENT_ROUTE_MAP[moduleToMatch] ||
    COMPONENT_ROUTE_MAP[componentToMatch] ||
    COMPONENT_ROUTE_MAP[stateSuffix] ||
    COMPONENT_ROUTE_MAP[stateLastPart] ||
    null;

  if (!route) return null;
  const url = new URL(route, window.location.origin);

  const workflowId = sanitizeWorkflowId(workflowResult?.workflowId || viewData?.workflowId);
  const workflowActor = normalizeActor(workflowResult?.workflowActor || viewData?.workflowActor);

  if (workflowId) {
    url.searchParams.set('WORKFLOW_ID', workflowId);
  }

  if (workflowActor) {
    url.searchParams.set('WORKFLOW_ACTOR', workflowActor);
  }

  return url.pathname + url.search;
};
