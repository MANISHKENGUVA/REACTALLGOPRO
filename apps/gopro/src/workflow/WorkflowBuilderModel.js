export const NODE_TYPES = Object.freeze([
  {
    type: 'ACTOR',
    label: 'Actor',
    fields: [
      { name: 'component', label: 'UI component', kind: 'text' },
      { name: 'access', label: 'Access configuration', kind: 'json' },
      { name: 'settings', label: 'Node-specific settings', kind: 'json' },
    ],
  },
  {
    type: 'SYSTEM_INTERNAL_PROCESS',
    label: 'System internal process',
    fields: [
      { name: 'handler', label: 'Process / handler', kind: 'text' },
      { name: 'inputMapping', label: 'Input mapping', kind: 'json' },
      { name: 'outputMapping', label: 'Output mapping', kind: 'json' },
      { name: 'executionSettings', label: 'Execution settings', kind: 'json' },
      { name: 'errorHandling', label: 'Error handling', kind: 'json' },
    ],
  },
  {
    type: 'WEBHOOK',
    label: 'Webhook',
    fields: [
      { name: 'endpoint', label: 'Webhook endpoint', kind: 'text' },
      { name: 'method', label: 'HTTP method', kind: 'method' },
      { name: 'headers', label: 'Headers', kind: 'json' },
      { name: 'payloadMapping', label: 'Payload mapping', kind: 'json' },
      { name: 'authentication', label: 'Authentication', kind: 'json' },
      { name: 'timeout', label: 'Timeout (ms)', kind: 'number' },
      { name: 'retry', label: 'Retry settings', kind: 'json' },
      { name: 'responseMapping', label: 'Response mapping', kind: 'json' },
    ],
  },
  {
    type: 'API',
    label: 'API',
    fields: [
      { name: 'endpoint', label: 'API endpoint', kind: 'text' },
      { name: 'method', label: 'HTTP method', kind: 'method' },
      { name: 'headers', label: 'Headers', kind: 'json' },
      { name: 'queryParameters', label: 'Query parameters', kind: 'json' },
      { name: 'requestBodyMapping', label: 'Request body mapping', kind: 'json' },
      { name: 'authentication', label: 'Authentication', kind: 'json' },
      { name: 'timeout', label: 'Timeout (ms)', kind: 'number' },
      { name: 'retry', label: 'Retry settings', kind: 'json' },
      { name: 'responseMapping', label: 'Response mapping', kind: 'json' },
    ],
  },
]);

export const WORKFLOW_DRAFTS_STORAGE_KEY = 'gopro.workflowBuilder.localDrafts.v1';

const METADATA_FIELDS = ['actor', 'module', 'moduleVersion', 'node', 'nodeVersion'];

export function normalizeMetadataPart(value) {
  return String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function buildNodeIdentity(metadata = {}) {
  return METADATA_FIELDS.map((field) => normalizeMetadataPart(metadata[field])).join('-');
}

export function createNodeState(type = 'ACTOR', index = 1) {
  const selectedType = NODE_TYPES.some((item) => item.type === type) ? type : 'ACTOR';
  return {
    type: selectedType,
    ...(selectedType === 'ACTOR' ? { component: '', access: { type: 'PUBLIC' } } : {}),
    metadata: {
      actor: 'BORROWER',
      module: 'DETAILS',
      moduleVersion: 'V1',
      node: `NEW-NODE-${index}`,
      nodeVersion: 'V1',
    },
    edges: {},
  };
}

export function createWorkflowDefinition(version = 'NEW-WORKFLOW-V1') {
  const initialState = createNodeState();
  const startState = buildNodeIdentity(initialState.metadata);
  return {
    workflowVersion: version,
    startState,
    states: { [startState]: initialState },
  };
}

export function renameNode(workflow, currentId, metadata) {
  const nextId = buildNodeIdentity(metadata);
  if (!METADATA_FIELDS.every((field) => normalizeMetadataPart(metadata[field]))) {
    return { workflow, error: 'All five metadata fields are required to generate a node identity.' };
  }
  if (nextId !== currentId && Object.hasOwn(workflow.states, nextId)) {
    return { workflow, error: `Node identity ${nextId} already exists in this workflow version.` };
  }

  const states = {};
  Object.entries(workflow.states).forEach(([stateId, state]) => {
    const renamedId = stateId === currentId ? nextId : stateId;
    const edges = Object.fromEntries(
      Object.entries(state.edges || {}).map(([edgeName, edge]) => [
        edgeName,
        edge.toState === currentId ? { ...edge, toState: nextId } : edge,
      ]),
    );
    states[renamedId] = {
      ...state,
      edges,
      ...(stateId === currentId ? { metadata: { ...metadata } } : {}),
    };
  });

  return {
    workflow: {
      ...workflow,
      startState: workflow.startState === currentId ? nextId : workflow.startState,
      states,
    },
    error: '',
  };
}

export function updateWorkflowEdge(workflow, nodeId, currentName, nextName, nextEdge) {
  const node = workflow.states?.[nodeId];
  if (!node) return { workflow, error: `Node ${nodeId} does not exist.` };
  const edges = node.edges || {};
  if (nextName !== currentName && Object.hasOwn(edges, nextName)) {
    return { workflow, error: `Edge ${nextName} already exists.` };
  }
  if (!Object.hasOwn(edges, currentName)) {
    return { workflow, error: `Edge ${currentName} does not exist.` };
  }
  const updatedEdges = {};
  Object.entries(edges).forEach(([name, edge]) => {
    if (name === currentName) updatedEdges[nextName] = nextEdge;
    else updatedEdges[name] = edge;
  });
  return {
    workflow: {
      ...workflow,
      states: { ...workflow.states, [nodeId]: { ...node, edges: updatedEdges } },
    },
    error: '',
  };
}

export function moveWorkflowEdge(workflow, nodeId, edgeName, offset) {
  const node = workflow.states?.[nodeId];
  if (!node) return workflow;
  const entries = Object.entries(node.edges || {});
  const index = entries.findIndex(([name]) => name === edgeName);
  const nextIndex = index + offset;
  if (index < 0 || nextIndex < 0 || nextIndex >= entries.length) return workflow;
  [entries[index], entries[nextIndex]] = [entries[nextIndex], entries[index]];
  return {
    ...workflow,
    states: { ...workflow.states, [nodeId]: { ...node, edges: Object.fromEntries(entries) } },
  };
}

export function validateWorkflowDefinition(workflow) {
  const errors = [];
  if (!workflow || typeof workflow !== 'object' || Array.isArray(workflow)) {
    return [{ nodeId: '', field: 'workflow', message: 'Workflow JSON must be an object.' }];
  }
  if (!workflow.workflowVersion) {
    errors.push({ nodeId: '', field: 'workflowVersion', message: 'Workflow version is required.' });
  }
  if (!workflow.states || typeof workflow.states !== 'object' || Array.isArray(workflow.states)) {
    errors.push({ nodeId: '', field: 'states', message: 'States must be an object keyed by node identity.' });
    return errors;
  }
  if (!workflow.startState || !Object.hasOwn(workflow.states, workflow.startState)) {
    errors.push({ nodeId: workflow.startState || '', field: 'startState', message: 'Start state must reference an existing node.' });
  }

  Object.entries(workflow.states).forEach(([nodeId, state]) => {
    if (!state || typeof state !== 'object' || Array.isArray(state)) {
      errors.push({ nodeId, field: 'state', message: 'Node configuration must be an object.' });
      return;
    }
    if (!state.metadata || typeof state.metadata !== 'object' || Array.isArray(state.metadata)) {
      errors.push({ nodeId, field: 'metadata', message: 'Node metadata is required.' });
    } else {
      METADATA_FIELDS.forEach((field) => {
        if (!normalizeMetadataPart(state.metadata[field])) {
          errors.push({ nodeId, field: `metadata.${field}`, message: `${field} is required.` });
        }
      });
      const expectedId = buildNodeIdentity(state.metadata);
      if (expectedId !== nodeId) {
        errors.push({ nodeId, field: 'metadata', message: `Node identity must match metadata: ${expectedId}.` });
      }
    }
    if (!NODE_TYPES.some((item) => item.type === state.type)) {
      errors.push({
        nodeId,
        field: 'type',
        message: `Unsupported execution type "${state.type || '(missing)'}". Existing data is preserved; choose one of the four supported types to change it.`,
      });
    }
    if (!state.edges || typeof state.edges !== 'object' || Array.isArray(state.edges)) {
      errors.push({ nodeId, field: 'edges', message: 'Edges must be an object.' });
      return;
    }
    Object.entries(state.edges).forEach(([edgeName, edge]) => {
      if (!edge || typeof edge !== 'object' || Array.isArray(edge)) {
        errors.push({ nodeId, field: `edges.${edgeName}`, message: 'Edge configuration must be an object.' });
      } else if (!edge.toState || !Object.hasOwn(workflow.states, edge.toState)) {
        errors.push({
          nodeId,
          field: `edges.${edgeName}.toState`,
          message: `Edge destination "${edge.toState || '(missing)'}" does not exist.`,
        });
      }
      if (edge?.ruleEngine) {
        const groupOperator = edge.ruleEngine.operator || edge.ruleEngine.type;
        if (!['AND', 'OR'].includes(groupOperator)) {
          errors.push({
            nodeId,
            field: `edges.${edgeName}.ruleEngine.operator`,
            message: 'Rule group must use AND or OR.',
          });
        }
        if (!Array.isArray(edge.ruleEngine.conditions) || edge.ruleEngine.conditions.length === 0) {
          errors.push({
            nodeId,
            field: `edges.${edgeName}.ruleEngine.conditions`,
            message: 'A rule must contain at least one condition.',
          });
        } else {
          edge.ruleEngine.conditions.forEach((condition, index) => {
            if (!condition || typeof condition !== 'object' || !condition.field || !condition.operator || !Object.hasOwn(condition, 'value')) {
              errors.push({
                nodeId,
                field: `edges.${edgeName}.ruleEngine.conditions.${index}`,
                message: 'Each condition requires a field, operator, and value.',
              });
            }
          });
        }
      }
    });
  });
  return errors;
}

export function localDraftKey(prefix = 'draft') {
  const id = globalThis.crypto?.randomUUID?.()
    || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `local-${prefix}-${id}`;
}

export function makeLocalWorkflowDraft(name, workflow) {
  const key = localDraftKey();
  return {
    draftKey: key,
    configurationDraftKey: localDraftKey('configuration'),
    name: String(name || 'Untitled workflow').trim() || 'Untitled workflow',
    workflow: structuredClone(workflow),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
