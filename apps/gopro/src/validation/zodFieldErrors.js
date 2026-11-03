// Turn a ZodError into a flat { fieldName: firstMessage } map. Nested paths use
// the last segment because the forms are flat by design (API payloads are flat
// per step). A field never receives more than one message, which is what the
// inline error slot is built to show.
export function zodFieldErrors(error) {
  const issues = Array.isArray(error?.issues) ? error.issues : [];
  const errors = {};
  for (const issue of issues) {
    const path = Array.isArray(issue.path) ? issue.path : [];
    const field = String(path[path.length - 1] || 'form');
    if (!errors[field]) {
      errors[field] = typeof issue.message === 'string' && issue.message.trim()
        ? issue.message.trim()
        : 'Check this field';
    }
  }
  return errors;
}

export function safeParseForm(schema, values) {
  const result = schema.safeParse(values);
  if (result.success) return { ok: true, data: result.data, errors: {} };
  return { ok: false, data: null, errors: zodFieldErrors(result.error) };
}
