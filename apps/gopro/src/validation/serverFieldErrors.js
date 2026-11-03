// Extract structured validation errors from a backend response. Only a map of
// field -> message is accepted; free-form backend text stays in the page-level
// alert, and is never turned into a field message. Messages are capped and
// stripped of control characters so a hostile/buggy response cannot break the
// inline error layout.
const MAX_MESSAGE = 180;

function clean(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\p{Cc}/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_MESSAGE);
}

function fromRecord(record, allowed) {
  const errors = {};
  if (!record || typeof record !== 'object') return errors;
  for (const [field, value] of Object.entries(record)) {
    if (allowed && !allowed.has(field)) continue;
    const message = Array.isArray(value) ? clean(value[0]) : clean(value);
    if (message) errors[field] = message;
  }
  return errors;
}

export function serverFieldErrors(error, { allowedFields = null } = {}) {
  const allowed = allowedFields ? new Set(allowedFields) : null;
  const payload = error?.payload && typeof error.payload === 'object' ? error.payload : {};
  const candidates = [
    payload.fieldErrors,
    payload.errors,
    payload.validationErrors,
    payload.details?.fieldErrors,
    payload.error?.fieldErrors,
    payload.error?.errors,
    error?.fieldErrors,
  ];

  for (const candidate of candidates) {
    const errors = fromRecord(candidate, allowed);
    if (Object.keys(errors).length) return errors;
  }
  return {};
}
