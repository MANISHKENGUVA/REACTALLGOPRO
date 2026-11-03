// Shared aria-describedby helper. Kept out of the component file so the
// component module only exports React components (fast-refresh contract).
export function describedBy(id, { hint = '', error = '' } = {}) {
  const values = [];
  if (hint) values.push(`${id}-hint`);
  if (error) values.push(`${id}-error`);
  return values.length ? values.join(' ') : undefined;
}
