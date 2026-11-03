import { isValidSessionId, isValidWorkflowId, normalizeActor, sanitizeSessionId } from '../utils/security.js';

const workflowSessionKeys = {
  sessionId: 'gopro.workflow.sessionId',
  sessionMeta: 'gopro.workflow.sessionMeta',
  sessionRegistry: 'gopro.workflow.sessionRegistry',
};

const safeStorage = {
  get(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // Storage unavailable (private mode, etc.) — keep in-memory only.
    }
  },
  remove(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

let inMemorySessionId = '';
let inMemoryMeta = null;

// Workflow-aware session registry.
//
// The backend issues one session per workflow; different workflows must never
// reuse each other's session identifier or metadata. The registry keeps a
// (workflowId -> session record) index in sessionStorage so that:
//   - switching between two applications in the same tab restores each
//     workflow's own session instead of overwriting a single global slot, and
//   - an expired or abandoned session can be dropped for one workflow without
//     touching another workflow's session.
//
// sessionId, workflowId and actor remain separate identifiers with separate
// validation. They are never interchangeable.
export function parseSessionRegistry(raw) {
  if (typeof raw !== 'string' || !raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const clean = {};
    for (const [workflowId, record] of Object.entries(parsed)) {
      if (!isValidWorkflowId(workflowId) || !record || typeof record !== 'object') continue;
      if (!isValidSessionId(record?.sessionId)) continue;
      clean[workflowId] = {
        sessionId: record.sessionId,
        actorId: normalizeActor(record.actorId),
        status: String(record.status || '').toUpperCase().slice(0, 40),
        updatedAt: Number(record.updatedAt) || 0,
      };
    }
    return clean;
  } catch {
    return {};
  }
}

// SessionManager: owns workflow sessionId + recovery.
// Backend remains authoritative about status (ANONYMOUS vs ACTOR_AUTHENTICATED).
export const SessionManager = {
  // A session id is never read from the URL. URLs leak through history, logs,
  // referrers and shared links; the server-issued id belongs in sessionStorage
  // (or the in-memory fallback) only. Extra arguments are ignored so existing
  // callers keep working without reintroducing query-parameter trust.
  getSessionId() {
    if (inMemorySessionId) return inMemorySessionId;
    const stored = sanitizeSessionId(safeStorage.get(workflowSessionKeys.sessionId));
    inMemorySessionId = stored;
    return stored;
  },

  setSession(sessionId, meta = null) {
    const safeSessionId = sanitizeSessionId(sessionId);
    inMemorySessionId = safeSessionId;
    if (safeSessionId) safeStorage.set(workflowSessionKeys.sessionId, safeSessionId);
    if (meta !== null) {
      inMemoryMeta = meta;
      safeStorage.set(workflowSessionKeys.sessionMeta, JSON.stringify(meta));
      // Keep the per-workflow registry in step with the active session.
      if (isValidWorkflowId(meta.workflowId) && safeSessionId) {
        this.recordSession({
          workflowId: meta.workflowId,
          sessionId: safeSessionId,
          actorId: meta.actorId || meta.workflowActor || '',
          status: meta.status || '',
        });
      }
    }
  },

  getSessionMeta() {
    if (inMemoryMeta) return inMemoryMeta;
    try {
      const raw = safeStorage.get(workflowSessionKeys.sessionMeta);
      inMemoryMeta = raw ? JSON.parse(raw) : null;
    } catch {
      inMemoryMeta = null;
    }
    return inMemoryMeta;
  },

  clearSession() {
    // The active record may name a workflow; drop its registry entry too so an
    // expired session is never restored as if it were current. Drafts for the
    // workflow are intentionally preserved — the backend can still resume it.
    const activeMeta = this.getSessionMeta();
    inMemorySessionId = '';
    inMemoryMeta = null;
    safeStorage.remove(workflowSessionKeys.sessionId);
    safeStorage.remove(workflowSessionKeys.sessionMeta);
    if (activeMeta?.workflowId) {
      this.forgetSessionRecord(activeMeta.workflowId);
    }
  },

  isSessionInvalidResponse(payload) {
    const status = String(payload?.status || payload?.data?.status || '').toUpperCase();
    const code = String(payload?.code || payload?.data?.code || '').toUpperCase();
    return (
      ['SESSION_EXPIRED', 'SESSION_INVALID', 'INVALID_SESSION', 'SESSION_REVOKED'].includes(status) ||
      code === 'SESSION_REVOKED'
    );
  },

  // --- Workflow session registry -------------------------------------------

  readRegistry() {
    return parseSessionRegistry(safeStorage.get(workflowSessionKeys.sessionRegistry));
  },

  writeRegistry(registry) {
    safeStorage.set(workflowSessionKeys.sessionRegistry, JSON.stringify(registry));
  },

  recordSession({ workflowId = '', sessionId = '', actorId = '', status = '' } = {}) {
    if (!isValidWorkflowId(workflowId) || !isValidSessionId(sessionId)) return false;
    const registry = this.readRegistry();
    const latestUpdatedAt = Object.values(registry)
      .reduce((latest, record) => Math.max(latest, record.updatedAt || 0), 0);
    registry[workflowId] = {
      sessionId,
      actorId: normalizeActor(actorId),
      status: String(status || '').toUpperCase().slice(0, 40),
      updatedAt: Math.max(Date.now(), latestUpdatedAt + 1),
    };
    this.writeRegistry(registry);
    return true;
  },

  getSessionRecord(workflowId) {
    if (!isValidWorkflowId(workflowId)) return null;
    return this.readRegistry()[workflowId] || null;
  },

  listSessionRecords() {
    return Object.entries(this.readRegistry())
      .map(([workflowId, record]) => ({ workflowId, ...record }))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  },

  forgetSessionRecord(workflowId) {
    if (!isValidWorkflowId(workflowId)) return false;
    const registry = this.readRegistry();
    if (!registry[workflowId]) return false;
    delete registry[workflowId];
    this.writeRegistry(registry);
    return true;
  },

  // Whether the session id belongs to any tracked workflow. Guards
  // "restore the correct conversation" semantics when a deep link carries a
  // session id that does not match the workflow it names.
  isKnownWorkflowSession(sessionId) {
    const safe = sanitizeSessionId(sessionId);
    if (!safe) return false;
    return Object.values(this.readRegistry()).some((record) => record.sessionId === safe);
  },
};
