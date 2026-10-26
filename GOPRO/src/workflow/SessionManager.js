import { workflowSessionKeys } from './workflowConfig';

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

// SessionManager: owns workflow sessionId + recovery.
// Backend remains authoritative about status (ANONYMOUS vs ACTOR_AUTHENTICATED).
export const SessionManager = {
  getSessionId(searchParams) {
    if (inMemorySessionId) return inMemorySessionId;
    const fromUrl =
      searchParams?.get?.('sessionId') ||
      searchParams?.get?.('SESSION_ID') ||
      searchParams?.get?.('workflowSessionId') ||
      '';
    if (fromUrl) {
      inMemorySessionId = fromUrl;
      return fromUrl;
    }
    const stored = safeStorage.get(workflowSessionKeys.sessionId) || '';
    inMemorySessionId = stored;
    return stored;
  },

  setSession(sessionId, meta = null) {
    inMemorySessionId = sessionId || '';
    if (sessionId) safeStorage.set(workflowSessionKeys.sessionId, sessionId);
    if (meta !== null) {
      inMemoryMeta = meta;
      safeStorage.set(workflowSessionKeys.sessionMeta, JSON.stringify(meta));
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
    inMemorySessionId = '';
    inMemoryMeta = null;
    safeStorage.remove(workflowSessionKeys.sessionId);
    safeStorage.remove(workflowSessionKeys.sessionMeta);
  },

  isSessionInvalidResponse(payload) {
    const status = String(payload?.status || payload?.data?.status || '').toUpperCase();
    return ['SESSION_EXPIRED', 'SESSION_INVALID', 'INVALID_SESSION'].includes(status);
  },
};
