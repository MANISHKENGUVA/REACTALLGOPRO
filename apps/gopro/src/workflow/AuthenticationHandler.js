import { WorkflowClient } from './WorkflowClient';

// AuthenticationHandler: talks to /auth/verify. Never generates actorId locally.
// The backend answers in two phases:
//   1. requestChallenge  -> { challengeId, delivery, method }  (no code is sent by us)
//   2. verify            -> { authenticated, actorId }         (only this promotes)
export const AuthenticationHandler = {
  async requestChallenge({ sessionId, method, aadhaarNumber } = {}) {
    if (!sessionId) throw new Error('AuthenticationHandler.requestChallenge requires sessionId');
    if (!method) throw new Error('AuthenticationHandler.requestChallenge requires method');
    const raw = await WorkflowClient.requestAuthChallenge({ sessionId, method, aadhaarNumber });
    const data = raw?.data ?? raw;
    return {
      challengeId: data?.challengeId || '',
      method: data?.method || method,
      delivery: data?.delivery || '',
      expiresAt: data?.expiresAt || '',
      // Development-only convenience: the backend returns the code when no SMS
      // or UIDAI gateway is wired up. Never surface it in a production build.
      devCode: import.meta.env.DEV ? String(data?.code || '') : '',
      status: data?.status || '',
      authenticated: Boolean(data?.authenticated),
      raw: data,
    };
  },

  async verify({ sessionId, challengeId, otp } = {}) {
    if (!sessionId) throw new Error('AuthenticationHandler.verify requires sessionId');
    if (!challengeId) throw new Error('AuthenticationHandler.verify requires challengeId');
    const raw = await WorkflowClient.verifyAuth({ sessionId, challengeId, otp });
    const data = raw?.data ?? raw;
    return {
      authenticated: Boolean(data?.authenticated),
      actorId: data?.actorId || '',
      status: data?.status || '',
      method: data?.method || '',
      raw: data,
    };
  },

  isAuthenticatedResponse(result) {
    return Boolean(result?.authenticated && result?.actorId);
  },
};
