import { WorkflowClient } from './WorkflowClient';

// WorkflowResolver: calls backend resolve API. Never decides transitions locally.
export const WorkflowResolver = {
  async resolve({ sessionId, workflowId = '', workflowActor = '' } = {}) {
    const raw = await WorkflowClient.resolveNode({ sessionId, workflowId, workflowActor });
    // Normalise legacy shape { componentviewrender, ... } into { status, node, component, access }.
    // New contract passes through untouched.
    if (raw && (raw.status === 'OK' || raw.status === 'CAPTCHA_REQUIRED' || raw.status === 'AUTHENTICATION_REQUIRED' || raw.status === 'INTERNAL' || raw.status === 'SESSION_EXPIRED' || raw.status === 'SESSION_INVALID' || raw.status === 'NOT_YOUR_TURN')) {
      return raw;
    }
    const view = raw?.componentviewrender || raw?.data?.componentviewrender || raw?.data || raw;
    if (!view || typeof view !== 'object') return raw;
    // Legacy navigator has no explicit access block — treat as PUBLIC to avoid global login.
    return {
      status: 'OK',
      node: view.componentKey || view.componentviewrenderState || '',
      component: view.component || view.componentKey || '',
      access: { type: 'PUBLIC' },
      workflowId: raw?.workflowId || view?.workflowId || workflowId,
      workflowActor: raw?.workflowActor || view?.workflowActor || workflowActor,
      legacy: raw,
    };
  },
};
