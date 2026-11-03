// Pure response normalisation for the workflow resolver.
//
// Kept free of fetch/config imports so the whole "is this answer allowed to
// open a page" rule set can be regression-tested with `node --test`. The
// backend remains authoritative: this module only refuses to promote an answer
// it does not recognise.

// Statuses the backend is allowed to return to the browser contract. Anything
// else is a contract violation, not a new page to render.
export const KNOWN_STATUSES = Object.freeze([
  'OK',
  'CAPTCHA_REQUIRED',
  'AUTHENTICATION_REQUIRED',
  'NOT_YOUR_TURN',
  'INTERNAL',
  'WORKFLOW_COMPLETED',
  'ACCESS_DENIED',
  'SESSION_EXPIRED',
  'SESSION_INVALID',
  'INVALID_SESSION',
  'SESSION_REVOKED',
  'ACTOR_SESSION_EXPIRED',
]);

const KNOWN = new Set(KNOWN_STATUSES);

function denied(reason, extra = {}) {
  return {
    status: 'ACCESS_DENIED',
    node: '',
    component: '',
    access: { type: 'INTERNAL' },
    reason,
    ...extra,
  };
}

/**
 * Normalises both contracts without ever promoting an unknown answer.
 *
 * - A known `status` passes through (case-normalised).
 * - An unknown `status` becomes ACCESS_DENIED and carries no node.
 * - A legacy `{ componentviewrender }` answer becomes OK only when it names a
 *   real node/component; a malformed legacy answer is denied.
 */
export function normalizeResolveResponse(raw, { workflowId = '', workflowActor = '' } = {}) {
  if (!raw || typeof raw !== 'object') return denied('MALFORMED_RESPONSE');

  const status = typeof raw.status === 'string' ? raw.status.trim().toUpperCase() : '';
  if (status) {
    if (KNOWN.has(status)) return status === raw.status ? raw : { ...raw, status };
    return denied('UNKNOWN_STATUS', { rawStatus: status });
  }

  // Some gateways wrap the payload one level deeper.
  if (raw.data && typeof raw.data === 'object' && typeof raw.data.status === 'string') {
    return normalizeResolveResponse(raw.data, { workflowId, workflowActor });
  }

  const view = raw.componentviewrender || raw.data?.componentviewrender || raw.data || raw;
  if (!view || typeof view !== 'object') return denied('MALFORMED_RESPONSE');

  const node = view.componentKey || view.componentviewrenderState || view.node || '';
  const component = view.component || view.componentKey || view.node || '';
  if (!node && !component) return denied('MISSING_NODE');

  return {
    status: 'OK',
    node,
    component,
    access: view.access?.type ? view.access : { type: 'PUBLIC' },
    workflowId: raw.workflowId || view.workflowId || workflowId,
    workflowActor: raw.workflowActor || view.workflowActor || workflowActor,
    legacy: raw,
  };
}
