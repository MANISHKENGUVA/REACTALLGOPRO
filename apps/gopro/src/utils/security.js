// Small, dependency-free security helpers shared by the workflow boundary.
// These functions are deliberately pure so they can be regression-tested with
// Node's built-in test runner as well as used from the browser bundle.

export const WORKFLOW_ACTORS = Object.freeze([
  'BORROWER',
  'COBORROWER',
  'MANAGER',
  'LENDER',
]);

const WORKFLOW_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const SESSION_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._~-]{5,255}$/;
const WINDOWS_DRIVE = /^[A-Za-z]:/;

// Rejects control characters, the DEL character, and backslashes without
// embedding a control-character range in a regular expression literal.
function hasControlOrSeparator(value) {
  for (const char of String(value || '')) {
    const code = char.charCodeAt(0);
    if (code < 0x20 || code === 0x7f || char === '\\') return true;
  }
  return false;
}

export function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function normalizeActor(value) {
  const actor = String(value || '').trim().toUpperCase();
  return WORKFLOW_ACTORS.includes(actor) ? actor : '';
}

const WORKFLOW_STATE_PATTERN = /^[A-Z0-9][A-Z0-9._:-]{2,191}$/;

export function normalizeStateId(value) {
  const state = String(value || '').trim().toUpperCase();
  return WORKFLOW_STATE_PATTERN.test(state) ? state : '';
}

export function isWorkflowActor(value) {
  return normalizeActor(value) !== '';
}

export function isValidWorkflowId(value) {
  return typeof value === 'string' && WORKFLOW_ID_PATTERN.test(value);
}

export function sanitizeWorkflowId(value) {
  return isValidWorkflowId(value) ? value : '';
}

export function isValidSessionId(value) {
  return typeof value === 'string' && SESSION_ID_PATTERN.test(value);
}

export function sanitizeSessionId(value) {
  return isValidSessionId(value) ? value : '';
}

// Only allow same-origin application routes. Absolute URLs, protocol-relative
// URLs, backslash/control-character tricks, credentials, and foreign origins
// are rejected instead of being normalised into an unexpected destination.
export function safeWorkflowPath(candidate, {
  allowedPaths = null,
  allowedParams = null,
  origin = 'https://app.invalid',
} = {}) {
  if (typeof candidate !== 'string') return null;
  const value = candidate.trim();
  if (!value || value.length > 2048) return null;
  if (hasControlOrSeparator(value)) return null;
  if (!value.startsWith('/') || value.startsWith('//')) return null;
  if (WINDOWS_DRIVE.test(value)) return null;

  let url;
  try {
    url = new URL(value, origin);
  } catch {
    return null;
  }

  if (url.origin !== new URL(origin).origin) return null;
  if (url.username || url.password) return null;
  if (!url.pathname.startsWith('/loan-flow/') && url.pathname !== '/') return null;

  if (allowedPaths) {
    const allowed = allowedPaths instanceof Set ? allowedPaths : new Set(allowedPaths);
    if (!allowed.has(url.pathname)) return null;
  }

  // Workflow navigation only needs the identifiers that the route loader
  // consumes. Drop session IDs, attacker-supplied STATE/COMPONENT_KEY values,
  // and every other query parameter instead of forwarding them.
  if (allowedParams) {
    const allowed = allowedParams instanceof Set ? allowedParams : new Set(allowedParams);
    for (const key of [...url.searchParams.keys()]) {
      if (!allowed.has(key)) url.searchParams.delete(key);
    }
  }

  // Hashes are not needed for workflow navigation and can be used for DOM
  // clobbering by unrelated client code, so drop them.
  return `${url.pathname}${url.search}`;
}

// Validate a service/base URL before it reaches fetch(). Production builds must
// use HTTPS unless the target is an explicit loopback address.
export function validateServiceUrl(value, {
  production = false,
  allowLoopbackHttp = true,
  field = 'service URL',
  allowPath = true,
  allowQuery = false,
} = {}) {
  const text = String(value || '').trim();
  if (!text || text.length > 2048) {
    throw new Error(`${field} is not configured or is too long`);
  }

  let url;
  try {
    url = new URL(text);
  } catch {
    throw new Error(`${field} must be an absolute URL`);
  }

  if (url.username || url.password) {
    throw new Error(`${field} must not contain credentials`);
  }
  if (url.hash) {
    throw new Error(`${field} must not contain a fragment`);
  }
  if (!allowQuery && url.search) {
    throw new Error(`${field} must not contain a query string`);
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`${field} must use http or https`);
  }

  const host = url.hostname.toLowerCase();
  const isLoopback = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]';
  if (production && url.protocol === 'http:' && !(allowLoopbackHttp && isLoopback)) {
    throw new Error(`${field} must use HTTPS outside loopback`);
  }

  if (!allowPath && url.pathname !== '/' && url.pathname !== '') {
    throw new Error(`${field} must not contain a path`);
  }

  return url;
}

export function normalizeServiceUrl(value, options = {}) {
  const url = validateServiceUrl(value, options);
  const path = url.pathname.replace(/\/+$/, '');
  return `${url.origin}${path}${url.search}`;
}

export function publicErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const status = Number(error?.status);
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You are not allowed to perform this action.';
  if (status === 409) return 'This step is no longer current. We refreshed your application status.';
  if (status === 413) return 'That file is too large. Please choose a smaller file.';
  if (status === 429) return 'Too many attempts. Please wait and try again.';
  if (status === 0 || error?.name === 'TypeError') {
    return 'The service could not be reached. Please check your connection and try again.';
  }
  return fallback;
}

const DEFAULT_UPLOAD_POLICY = Object.freeze({
  maxBytes: 5 * 1024 * 1024,
  maxFiles: 10,
  extensions: Object.freeze(['pdf', 'jpg', 'jpeg', 'png', 'webp']),
  mimeTypes: Object.freeze([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
  ]),
});

export const UPLOAD_POLICIES = Object.freeze({
  identityDocument: Object.freeze({
    ...DEFAULT_UPLOAD_POLICY,
    maxFiles: 3,
  }),
  supportingDocument: Object.freeze({
    ...DEFAULT_UPLOAD_POLICY,
    maxFiles: 10,
    extensions: Object.freeze(['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx']),
    mimeTypes: Object.freeze([
      ...DEFAULT_UPLOAD_POLICY.mimeTypes,
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]),
  }),
  bankStatement: Object.freeze({
    ...DEFAULT_UPLOAD_POLICY,
    maxFiles: 6,
  }),
});

export function validateUploadFile(file, policy = DEFAULT_UPLOAD_POLICY) {
  if (!file || typeof file !== 'object') {
    return { ok: false, error: 'Select a valid file.' };
  }

  const name = String(file.name || '').trim();
  const size = Number(file.size);
  if (!name || name.length > 255 || hasControlOrSeparator(name) || name.includes('/')) {
    return { ok: false, error: 'The selected file has an invalid name.' };
  }
  if (!Number.isFinite(size) || size <= 0 || size > policy.maxBytes) {
    return {
      ok: false,
      error: `Each file must be larger than 0 bytes and no larger than ${Math.floor(policy.maxBytes / (1024 * 1024))} MB.`,
    };
  }

  const extension = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
  if (!policy.extensions.includes(extension)) {
    return { ok: false, error: 'This file type is not allowed.' };
  }

  const mimeType = String(file.type || '').toLowerCase();
  if (mimeType && !policy.mimeTypes.includes(mimeType)) {
    return { ok: false, error: 'This file type is not allowed.' };
  }

  return { ok: true, error: '' };
}

export function validateUploadFiles(files, policy = DEFAULT_UPLOAD_POLICY) {
  const list = Array.from(files || []);
  if (list.length > policy.maxFiles) {
    return {
      ok: false,
      error: `You can upload at most ${policy.maxFiles} files at a time.`,
    };
  }
  for (const file of list) {
    const result = validateUploadFile(file, policy);
    if (!result.ok) return result;
  }
  return { ok: true, error: '' };
}
