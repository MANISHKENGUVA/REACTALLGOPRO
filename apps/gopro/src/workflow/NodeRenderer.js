import { resolveComponentRoute } from './routeMap.js';

// NodeRenderer: maps backend { node, component } to existing frontend routes.
// Uses existing COMPONENT_ROUTE_MAP — no new workflow model, no transition logic.
export function routeForResolvedNode(resolved) {
  // Actor-qualified state ids must win over bare node/component keys: the same
  // KYC-UPLOAD-V1 key is used by both borrower and co-borrower states.
  return resolveComponentRoute([
    resolved?.state,
    resolved?.componentviewrenderState,
    resolved?.legacy?.componentviewrender?.componentviewrenderState,
    resolved?.legacy?.componentviewrender?.componentState,
    resolved?.node,
    resolved?.component,
    resolved?.legacy?.componentviewrender?.componentKey,
    resolved?.legacy?.componentviewrender?.component,
  ]);
}

export const NodeRenderer = { routeForResolvedNode };
