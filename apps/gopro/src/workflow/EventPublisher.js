import { WorkflowClient } from './WorkflowClient';
import { WorkflowResolver } from './WorkflowResolver';
import { getWorkflowState } from './workflowConfig';
import { getLegacyState } from './legacyStates';
import { COMPONENT_ROUTE_MAP, getRouteActor, resolveWorkflowRoute } from '../utils/globalRouterNavigator';
import {
  normalizeActor,
  normalizeStateId,
  safeWorkflowPath,
  sanitizeSessionId,
  sanitizeWorkflowId,
} from '../utils/security';

const pendingEvents = new Map();

const NAVIGABLE_PATHS = new Set([
  ...Object.values(COMPONENT_ROUTE_MAP),
  '/',
  '/loan-flow/workflow',
  '/loan-flow/not-your-turn',
]);
const NAVIGABLE_PARAMS = ['WORKFLOW_ID', 'WORKFLOW_ACTOR'];

function trustedState(stateId) {
  const value = normalizeStateId(stateId);
  if (!value) return null;

  const legacy = getLegacyState(value);
  if (legacy) {
    return {
      stateId: legacy.stateId,
      actor: legacy.actor,
      componentKey: legacy.componentKey,
    };
  }

  const state = getWorkflowState(value);
  if (!state) return null;
  return {
    stateId: state.stateId,
    actor: state.metadata.actor,
    componentKey: `${state.metadata.node}-${state.metadata.nodeVersion}`,
  };
}

function validatedMetadata(workflowMetadata = {}) {
  const state = trustedState(workflowMetadata.componentViewRenderState);
  if (!state) throw new Error('The current workflow state is invalid');

  const workflowId = sanitizeWorkflowId(workflowMetadata.workflowId);
  if (!workflowId) throw new Error('A valid workflow ID is required to submit an event');

  const requestedActor = normalizeActor(workflowMetadata.workflowActor);
  if (!requestedActor || requestedActor !== state.actor) {
    throw new Error('The requested actor cannot submit this workflow state');
  }

  if (workflowMetadata.componentKey) {
    const key = String(workflowMetadata.componentKey).trim().toUpperCase();
    if (key !== state.componentKey) {
      throw new Error('The workflow component does not match the current state');
    }
    return {
      componentViewRenderState: state.stateId,
      componentKey: state.componentKey,
      workflowId,
      workflowActor: state.actor,
      ...(sanitizeSessionId(workflowMetadata.sessionId)
        ? { sessionId: sanitizeSessionId(workflowMetadata.sessionId) }
        : {}),
    };
  }

  return {
    componentViewRenderState: state.stateId,
    componentKey: state.componentKey,
    workflowId,
    workflowActor: state.actor,
    ...(sanitizeSessionId(workflowMetadata.sessionId)
      ? { sessionId: sanitizeSessionId(workflowMetadata.sessionId) }
      : {}),
  };
}

function safeDestination(route, metadata) {
  const path = safeWorkflowPath(route, {
    allowedPaths: NAVIGABLE_PATHS,
    allowedParams: NAVIGABLE_PARAMS,
  });
  if (!path) return null;

  const url = new URL(path, 'https://app.invalid');
  // The destination page dictates the actor. Carrying the previous page's
  // actor across a cross-actor transition (for example LENDER -> MANAGER)
  // would make the destination loader reject its own backend state.
  const destinationActor = getRouteActor(url.pathname) || metadata.workflowActor;
  url.searchParams.set('WORKFLOW_ID', metadata.workflowId);
  url.searchParams.set('WORKFLOW_ACTOR', destinationActor);

  return safeWorkflowPath(`${url.pathname}${url.search}`, {
    allowedPaths: NAVIGABLE_PATHS,
    allowedParams: NAVIGABLE_PARAMS,
  });
}

function resultStatus(result) {
  return String(result?.status || result?.data?.status || '').toUpperCase();
}

function nextRouteFor(result) {
  if (['CAPTCHA_REQUIRED', 'AUTHENTICATION_REQUIRED', 'SESSION_EXPIRED', 'SESSION_INVALID'].includes(resultStatus(result))) {
    return '/loan-flow/workflow';
  }
  // The event response is backend-directed and may legitimately belong to the
  // next actor in the workflow. Route membership and the destination actor are
  // validated in safeDestination; the destination loader re-checks the backend
  // state against that actor.
  return resolveWorkflowRoute(result);
}

function pendingKey(metadata, eventName) {
  return `${metadata.workflowId}:${metadata.workflowActor}:${metadata.componentViewRenderState}:${eventName}`;
}

// EventPublisher: publishes node events/data, then caller re-resolves.
// Never hard-codes transitions — backend response decides next node.
export const EventPublisher = {
  async publish({ sessionId, event = '', eventType = '', eventId = '', data = {}, formData = {}, workflowMetadata = {} } = {}) {
    if (!event && !eventType) throw new Error('EventPublisher.publish requires event/eventType');
    const metadata = validatedMetadata(workflowMetadata);
    const eventName = event || eventType;
    const key = pendingKey(metadata, eventName);
    if (pendingEvents.has(key)) return pendingEvents.get(key);
    const request = WorkflowClient.publishEvent({
      sessionId: sanitizeSessionId(sessionId),
      node: metadata.componentViewRenderState,
      event,
      eventType,
      eventId: typeof eventId === 'string' ? eventId.trim().slice(0, 128) : '',
      data,
      formData,
      workflowMetadata: metadata,
    }).finally(() => pendingEvents.delete(key));
    pendingEvents.set(key, request);
    return request;
  },

  // Legacy pages keep their existing POST shape while sharing validation,
  // duplicate-submit protection, and safe navigation with the V6 flow.
  async publishLegacy({
    sessionId,
    event = '',
    eventType = '',
    data = {},
    formData = {},
    workflowMetadata = {},
  } = {}) {
    const eventName = event || eventType;
    if (!eventName) throw new Error('EventPublisher.publishLegacy requires event/eventType');
    const metadata = validatedMetadata(workflowMetadata);
    const key = `legacy:${pendingKey(metadata, eventName)}`;
    if (pendingEvents.has(key)) return pendingEvents.get(key);

    const request = WorkflowClient.publishLegacyEvent({
      sessionId: sanitizeSessionId(sessionId),
      eventType: eventName,
      formData: { ...formData, ...data },
      workflowMetadata: metadata,
    }).finally(() => pendingEvents.delete(key));
    pendingEvents.set(key, request);
    return request;
  },

  async publishAndNavigate({ navigate, sessionId, fallbackRoute = '', ...event }) {
    const metadata = validatedMetadata(event.workflowMetadata);
    let result;
    try {
      result = await this.publish({ ...event, sessionId, workflowMetadata: metadata });
    } catch (e) {
      if (e?.status !== 409) throw e;
      result = await recoverOutOfSequence({ sessionId, metadata, navigate, fallbackRoute, original: e });
      return result;
    }

    let nextRoute = nextRouteFor(result);
    if (!nextRoute) {
      result = await WorkflowResolver.resolve({
        sessionId: sanitizeSessionId(sessionId),
        workflowId: metadata.workflowId,
        workflowActor: metadata.workflowActor,
      });
      nextRoute = nextRouteFor(result);
    }

    const destination = safeDestination(nextRoute || fallbackRoute, metadata);
    if (!destination) throw new Error('The backend returned an unknown workflow destination');
    navigate(destination);
    return result;
  },

  async publishLegacyAndNavigate({
    navigate,
    sessionId,
    event = '',
    eventType = '',
    data = {},
    formData = {},
    workflowMetadata = {},
    fallbackRoute = '/loan-flow/workflow',
  } = {}) {
    const metadata = validatedMetadata(workflowMetadata);
    let result;
    try {
      result = await this.publishLegacy({
        sessionId,
        event,
        eventType,
        data,
        formData,
        workflowMetadata: metadata,
      });
    } catch (e) {
      if (e?.status !== 409) throw e;
      result = await recoverOutOfSequence({ sessionId, metadata, navigate, fallbackRoute, original: e });
      return result;
    }

    const destination = safeDestination(
      nextRouteFor(result) || fallbackRoute,
      metadata,
    );
    if (!destination) throw new Error('The backend returned an unknown workflow destination');
    navigate(destination);
    return result;
  },
};

// 409 STEP_OUT_OF_SEQUENCE: the backend already moved past the submitted node.
// Re-resolve and send the browser to the node the backend is actually on. If
// that fails too, surface the original conflict so the page can explain it.
async function recoverOutOfSequence({ sessionId, metadata, navigate, fallbackRoute, original }) {
  let resolved;
  try {
    resolved = await WorkflowResolver.resolve({
      sessionId: sanitizeSessionId(sessionId),
      workflowId: metadata.workflowId,
      workflowActor: metadata.workflowActor,
    });
  } catch {
    throw original;
  }
  const destination = safeDestination(nextRouteFor(resolved) || fallbackRoute, metadata);
  if (!destination) throw original;
  navigate(destination);
  return resolved;
}
