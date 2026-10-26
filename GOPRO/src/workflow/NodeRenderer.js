import { COMPONENT_ROUTE_MAP } from '../utils/globalRouterNavigator';

// NodeRenderer: maps backend { node, component } to existing frontend routes.
// Uses existing COMPONENT_ROUTE_MAP — no new workflow model, no transition logic.
function normaliseKey(value) {
  return String(value || '').toUpperCase();
}

export function routeForResolvedNode(resolved) {
  const candidates = [
    resolved?.node,
    resolved?.component,
    resolved?.legacy?.componentviewrender?.componentKey,
    resolved?.legacy?.componentviewrender?.component,
    resolved?.legacy?.componentviewrender?.componentviewrenderState,
  ].map(normaliseKey).filter(Boolean);
  for (const key of candidates) {
    if (COMPONENT_ROUTE_MAP[key]) return COMPONENT_ROUTE_MAP[key];
    // suffix fallbacks mirror globalRouterNavigator behaviour
    const parts = key.split('-');
    const suffix2 = parts.slice(-2).join('-');
    const last = parts.slice(-1)[0];
    if (COMPONENT_ROUTE_MAP[suffix2]) return COMPONENT_ROUTE_MAP[suffix2];
    if (COMPONENT_ROUTE_MAP[last]) return COMPONENT_ROUTE_MAP[last];
  }
  return null;
}

export const NodeRenderer = { routeForResolvedNode };
