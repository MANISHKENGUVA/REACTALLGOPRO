// DraftStore: per-workflow form draft persistence.
//
// Ownership model
// ---------------
// - The backend owns the authoritative application state. There is NO server
//   endpoint for drafts; every save/restore below is a client-side convenience
//   so an interrupted workflow (refresh, back-button, browser crash) does not
//   force the applicant to retype a step.
// - A draft is scoped to (workflowId + stateId + actor). Different workflows,
//   different steps and different actors can never see each other's values, so
//   switching between two applications in the same tab cannot mix data.
// - Storage is sessionStorage: tab-scoped and cleared when the tab closes, so
//   a public/shared machine cannot leave a draft behind. It is intentionally
//   NOT localStorage and NOT a cookie. Drafts may contain PII supplied by the
//   applicant (PAN/Aadhaar), so they never leave the tab and never appear in
//   logs, history or referrers.
// - Drafts are text-only. Binary selections (File/FileList/Blob) are stripped
//   by the sanitizer; the backend owns upload state and cannot be replayed.
//
// Limits (quota safety)
// ---------------------
// A draft that would not serialise within MAX_DRAFT_ENTRY_CHARS is rejected
// rather than risking a sessionStorage quota error that would take the whole
// app down with it. Depth and node counts are bounded to keep restored values
// plain and predictable.

const STORAGE_KEY = 'gopro.workflow.draft.v1';

export const MAX_DRAFT_ENTRY_CHARS = 28000;
export const MAX_DRAFT_DEPTH = 8;
export const MAX_DRAFT_NODES = 64;
export const DEFAULT_DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
export const DEFAULT_DRAFT_PERSISTENCE_ENABLED = false;

function defaultSafeStorage() {
  return {
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
        // Private mode or quota exceeded — drafts degrade to in-memory only.
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
}

export function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

// Strip every value that cannot round-trip through JSON. Strings, finite
// numbers, booleans, null, plain objects and arrays survive; File / FileList /
// Blob / Date / Map / functions are dropped.
export function sanitizeDraftValue(value, depth = 0) {
  if (depth > MAX_DRAFT_DEPTH) return undefined;
  if (value === null) return null;
  const type = typeof value;
  if (type === 'string') return value;
  if (type === 'boolean') return value;
  if (type === 'number') return Number.isFinite(value) ? value : undefined;
  if (Array.isArray(value)) {
    const clean = [];
    for (const item of value) {
      const next = sanitizeDraftValue(item, depth + 1);
      if (next !== undefined) clean.push(next);
    }
    return clean;
  }
  if (isPlainObject(value)) {
    const clean = {};
    for (const [key, item] of Object.entries(value)) {
      const next = sanitizeDraftValue(item, depth + 1);
      if (next !== undefined) clean[key] = next;
    }
    return clean;
  }
  return undefined;
}

export function createDraftStore(storage = null, { enabled = true } = {}) {
  const store = storage || defaultSafeStorage();

  const readAll = () => {
    if (!enabled) return {};
    try {
      const raw = store.get(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed && isPlainObject(parsed) ? parsed : {};
    } catch {
      return {};
    }
  };

  const writeAll = (registry) => {
    store.set(STORAGE_KEY, JSON.stringify(registry));
  };

  return {
    saveDraft({ workflowId = '', stateId = '', actor = '', values = null, ttlMs = DEFAULT_DRAFT_TTL_MS, now = Date.now() } = {}) {
      if (!enabled) return false;
      if (!workflowId || !stateId) return false;
      const clean = sanitizeDraftValue(values);
      if (!clean || (isPlainObject(clean) && !Object.keys(clean).length)) return false;
      const serialized = JSON.stringify(clean);
      if (serialized.length > MAX_DRAFT_ENTRY_CHARS) return false;

      const registry = readAll();
      const workflow = registry[workflowId] && isPlainObject(registry[workflowId])
        ? registry[workflowId]
        : {};
      // Bound the number of cached steps per workflow so a long journey cannot
      // accumulate an unbounded footprint.
      const nodeKeys = Object.keys(workflow);
      if (nodeKeys.length >= MAX_DRAFT_NODES) {
        const oldest = nodeKeys
          .map((key) => ({ key, t: workflow[key]?.savedAt || 0 }))
          .sort((a, b) => a.t - b.t)[0];
        if (oldest) delete workflow[oldest.key];
      }
      workflow[stateId] = {
        actor: String(actor || '') || '',
        savedAt: now,
        expiresAt: now + ttlMs,
        values: clean,
      };
      registry[workflowId] = workflow;
      writeAll(registry);
      return true;
    },

    loadDraft({ workflowId = '', stateId = '', actor = '', now = Date.now() } = {}) {
      if (!enabled) return null;
      if (!workflowId || !stateId) return null;
      const registry = readAll();
      const record = registry[workflowId]?.[stateId];
      if (!record) return null;
      // Actor isolation: a draft recorded for one actor must never be restored
      // for another (BORROWER vs MANAGER on the same node key).
      if (actor && record.actor && record.actor !== String(actor)) {
        this.clearDraft({ workflowId, stateId });
        return null;
      }
      if (record.expiresAt && now >= record.expiresAt) {
        this.clearDraft({ workflowId, stateId });
        return null;
      }
      return {
        values: record.values,
        savedAt: record.savedAt,
        actor: record.actor || '',
      };
    },

    hasDraft({ workflowId = '', stateId = '', actor = '' } = {}) {
      return this.loadDraft({ workflowId, stateId, actor }) !== null;
    },

    clearDraft({ workflowId = '', stateId = '' } = {}) {
      if (!workflowId || !stateId) return false;
      const registry = readAll();
      if (!registry[workflowId]?.[stateId]) return false;
      delete registry[workflowId][stateId];
      if (!Object.keys(registry[workflowId]).length) delete registry[workflowId];
      writeAll(registry);
      return true;
    },

    clearWorkflowDrafts(workflowId) {
      if (!workflowId) return false;
      const registry = readAll();
      if (!registry[workflowId]) return false;
      delete registry[workflowId];
      writeAll(registry);
      return true;
    },

    clearAllDrafts() {
      if (!enabled) {
        store.remove(STORAGE_KEY);
        return;
      }
      const registry = readAll();
      if (!Object.keys(registry).length) return;
      store.remove(STORAGE_KEY);
    },

    listWorkflowDrafts(workflowId) {
      const registry = readAll();
      const workflow = registry[workflowId];
      if (!workflow) return [];
      return Object.keys(workflow);
    },
  };
}

// The app does not persist unsaved loan data in browser storage by default.
// Tests may create an enabled store with an isolated storage shim.
export const DraftStore = createDraftStore(null, { enabled: DEFAULT_DRAFT_PERSISTENCE_ENABLED });

// Remove drafts written by earlier builds, which may contain PII or financial data.
DraftStore.clearAllDrafts();
