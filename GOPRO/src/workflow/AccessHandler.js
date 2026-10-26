// AccessHandler: interprets backend access/auth responses.
// Backend is authoritative. Frontend never invents auth state.
export const ACCESS_TYPES = ['PUBLIC', 'PUBLIC_CAPTCHA', 'ACTOR', 'INTERNAL'];

export const AccessHandler = {
  classify(resolved) {
    const status = String(resolved?.status || '').toUpperCase();
    const accessType = String(resolved?.access?.type || '').toUpperCase();

    if (status === 'CAPTCHA_REQUIRED') return { kind: 'CAPTCHA', resolved };
    if (status === 'AUTHENTICATION_REQUIRED') return { kind: 'AUTH', resolved };
    if (status === 'SESSION_EXPIRED' || status === 'SESSION_INVALID' || status === 'INVALID_SESSION') {
      return { kind: 'SESSION_INVALID', resolved };
    }
    if (status === 'NOT_YOUR_TURN' || status === 'INTERNAL' || accessType === 'INTERNAL') {
      return { kind: 'INTERNAL', resolved };
    }
    if (accessType === 'ACTOR' && status !== 'OK') {
      // Backend says ACTOR but did not return OK => treat as auth required.
      return { kind: 'AUTH', resolved };
    }
    // Default: PUBLIC (including legacy-normalised OK).
    return { kind: 'PUBLIC', resolved };
  },

  authMethods(resolved) {
    const methods = resolved?.authentication?.methods || resolved?.auth?.methods || [];
    return Array.isArray(methods) ? methods : [];
  },

  captchaInfo(resolved) {
    return resolved?.captcha || null;
  },
};
