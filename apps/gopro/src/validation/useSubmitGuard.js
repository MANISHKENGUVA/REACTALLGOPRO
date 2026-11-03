import { useCallback, useRef, useState } from 'react';

// Guards a write against double activation (double click, Enter key repeat,
// slow network). The callback owns the request; this hook owns only the lock.
export function useSubmitGuard() {
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);

  const run = useCallback(async (task) => {
    if (inFlight.current) return { skipped: true };
    inFlight.current = true;
    setSubmitting(true);
    try {
      const value = await task();
      return { skipped: false, value };
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }, []);

  return { submitting, run, isSubmitting: () => inFlight.current };
}
