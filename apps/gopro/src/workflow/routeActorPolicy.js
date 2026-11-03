// Pure route-to-actor policy. The destination page owns the workflow actor:
// when the backend points the browser at the next node, the actor must come
// from the route being opened, never from the page the user just left.
//
// Empty strings mark actor-agnostic routes (the session bootstrap hub), for
// which the caller must preserve the current actor.

export const ROUTE_ACTOR_OVERRIDES = Object.freeze({
  '/loan-flow/coborrower-kyc': 'COBORROWER',
  '/loan-flow/disbursement-request': 'LENDER',
  '/loan-flow/not-your-turn': '',
  '/loan-flow/workflow': '',
});

export function buildRouteActorMap({
  states = {},
  routeMap = {},
  legacyStates = {},
  overrides = ROUTE_ACTOR_OVERRIDES,
} = {}) {
  const candidates = new Map();
  const add = (route, actor) => {
    if (!route) return;
    const actors = candidates.get(route) || new Set();
    if (actor) actors.add(actor);
    candidates.set(route, actors);
  };

  // Every V6 state is compiled in, so its actor is authoritative for the
  // route that renders it.
  for (const [stateId, state] of Object.entries(states || {})) {
    add(routeMap[stateId], state?.metadata?.actor);
  }

  for (const entry of Object.values(legacyStates || {})) {
    for (const route of entry.routes || []) add(route, entry.actor);
  }

  for (const [route, actor] of Object.entries(overrides || {})) {
    add(route, actor);
  }

  const result = new Map();
  for (const [route, actors] of candidates) {
    // A route that resolves to more than one actor is ambiguous and must not
    // be used to rewrite the actor automatically.
    result.set(route, actors.size === 1 ? [...actors][0] : '');
  }
  return result;
}

export function getRouteActorFromMap(routeActors, routePath) {
  return routeActors?.get?.(String(routePath || '')) || '';
}
