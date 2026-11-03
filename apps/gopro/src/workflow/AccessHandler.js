// AccessHandler: interprets backend access/auth responses.
// Backend is authoritative. Frontend never invents auth state, and an answer it
// does not recognise is treated as a waiting/denied state — never as PUBLIC.
export const ACCESS_TYPES = ['PUBLIC', 'PUBLIC_CAPTCHA', 'ACTOR', 'INTERNAL'];

export const AccessHandler = {
  classify(resolved) {
    const status = String(resolved?.status || '').toUpperCase();
    const accessType = String(resolved?.access?.type || '').toUpperCase();

    if (status === 'CAPTCHA_REQUIRED') return { kind: 'CAPTCHA', resolved };
    if (status === 'AUTHENTICATION_REQUIRED' || status === 'ACTOR_SESSION_EXPIRED') {
      return { kind: 'AUTH', resolved };
    }
    if (
      status === 'SESSION_EXPIRED' ||
      status === 'SESSION_INVALID' ||
      status === 'INVALID_SESSION' ||
      status === 'SESSION_REVOKED'
    ) {
      return { kind: 'SESSION_INVALID', resolved };
    }
    if (status === 'WORKFLOW_COMPLETED') return { kind: 'COMPLETED', resolved };
    if (status === 'ACCESS_DENIED') return { kind: 'DENIED', resolved };
    if (status === 'NOT_YOUR_TURN' || status === 'INTERNAL' || accessType === 'INTERNAL') {
      return { kind: 'INTERNAL', resolved };
    }
    if (accessType === 'ACTOR' && status !== 'OK') {
      // Backend says ACTOR but did not return OK => treat as auth required.
      return { kind: 'AUTH', resolved };
    }
    // Only an explicit OK may open a page. An access type on its own is not a
    // status, and an unknown status must never be promoted to PUBLIC.
    if (status === 'OK') return { kind: 'PUBLIC', resolved };

    return { kind: 'INTERNAL', resolved };
  },

  authMethods(resolved) {
    const methods = resolved?.authentication?.methods || resolved?.auth?.methods;
    if (Array.isArray(methods) && methods.length) return methods;
    // Backend contract: AUTHENTICATION_REQUIRED with an empty/null method list
    // means "offer every supported method"; the backend still decides which
    // one it accepts, so this is a display fallback, not an authorisation.
    const status = String(resolved?.status || '').toUpperCase();
    return status === 'AUTHENTICATION_REQUIRED' || status === 'ACTOR_SESSION_EXPIRED'
      ? ['MOBILE_OTP', 'AADHAAR']
      : [];
  },

  captchaInfo(resolved) {
    return resolved?.captcha || null;
  },
};
