import { WorkflowClient } from './WorkflowClient';

// AuthenticationHandler: talks to /auth/verify. Never generates actorId locally.
// Backend { authenticated: true, actorId } is authoritative.
export const AuthenticationHandler = {
  async verify({ sessionId, method, credential, otp, token } = {}) {
    if (!sessionId) throw new Error('AuthenticationHandler.verify requires sessionId');
    if (!method) throw new Error('AuthenticationHandler.verify requires method');
    const raw = await WorkflowClient.verifyAuth({ sessionId, method, credential, otp, token });
    const data = raw?.data ?? raw;
    return {
      authenticated: Boolean(data?.authenticated),
      actorId: data?.actorId || '',
      status: data?.status || '',
      raw: data,
    };
  },

  isAuthenticatedResponse(result) {
    return Boolean(result?.authenticated && result?.actorId);
  },
};
