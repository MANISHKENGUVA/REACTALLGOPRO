import { sanitizeSessionId, sanitizeWorkflowId } from '../utils/security.js';

export async function createNewApplicationSession({
  postJson,
  endpoint,
  captchaToken,
  keyStore,
}) {
  if (!captchaToken) {
    throw new Error('Complete the security check before starting a new application.');
  }
  const idempotencyKey = keyStore.getOrCreate();
  const payload = await postJson(endpoint, {
    newApplication: true,
    captchaToken,
  }, {
    field: 'VITE_WORKFLOW_SESSION_URL',
    headers: { 'Idempotency-Key': idempotencyKey },
  });
  const data = payload?.data ?? payload;
  if (!sanitizeSessionId(data?.sessionId) || !sanitizeWorkflowId(data?.workflowId)) {
    throw new Error('The workflow service did not confirm the new application. Retry safely.');
  }
  keyStore.clear();
  return data;
}
