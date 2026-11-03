// Focus the first control the page marked as invalid. Hidden inputs (file
// uploads, radio inputs with a custom box) are skipped so focus lands on
// something the person can actually use.
export function focusFirstInvalid(root) {
  if (!root || typeof root.querySelectorAll !== 'function') return false;
  const candidates = Array.from(root.querySelectorAll('[aria-invalid="true"]'));
  const target = candidates.find((element) => {
    if (!element || element.disabled) return false;
    if (element.type === 'hidden') return false;
    if (element.closest('[hidden]')) return false;
    return true;
  });
  if (!target) return false;
  try {
    target.focus({ preventScroll: true });
    if (typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  } catch {
    target.focus();
  }
  return true;
}
