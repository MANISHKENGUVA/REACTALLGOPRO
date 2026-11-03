import { WorkflowClient } from './WorkflowClient';
import { normalizeResolveResponse } from './resolveResponse';

export { KNOWN_STATUSES, normalizeResolveResponse } from './resolveResponse';

// WorkflowResolver: calls backend resolve API. Never decides transitions locally.
export const WorkflowResolver = {
  async resolve({ sessionId, workflowId = '', workflowActor = '' } = {}) {
    const raw = await WorkflowClient.resolveNode({ sessionId, workflowId, workflowActor });
    return normalizeResolveResponse(raw, { workflowId, workflowActor });
  },
};
