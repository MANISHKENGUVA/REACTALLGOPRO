import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildNodeIdentity,
  createWorkflowDefinition,
  makeLocalWorkflowDraft,
  moveWorkflowEdge,
  NODE_TYPES,
  renameNode,
  updateWorkflowEdge,
  validateWorkflowDefinition,
} from './WorkflowBuilderModel.js';

test('builds identity from structured metadata without splitting multiword values', () => {
  assert.equal(buildNodeIdentity({
    actor: 'borrower',
    module: 'details',
    moduleVersion: 'v1',
    node: 'personal-info',
    nodeVersion: 'v1',
  }), 'BORROWER-DETAILS-V1-PERSONAL-INFO-V1');
});

test('exposes exactly the four supported execution types', () => {
  assert.deepEqual(NODE_TYPES.map(({ type }) => type), [
    'ACTOR',
    'SYSTEM_INTERNAL_PROCESS',
    'WEBHOOK',
    'API',
  ]);
});

test('renaming metadata preserves unknown state fields and updates references', () => {
  const workflow = createWorkflowDefinition();
  const originalId = workflow.startState;
  workflow.states[originalId].vendorConfiguration = { retained: true };
  workflow.states[originalId].edges.NEXT = { toState: originalId, customRule: { enabled: true } };

  const result = renameNode(workflow, originalId, {
    actor: 'BORROWER',
    module: 'DETAILS',
    moduleVersion: 'V1',
    node: 'FACE-VERIFICATION',
    nodeVersion: 'V2',
  });

  assert.equal(result.error, '');
  assert.equal(result.workflow.startState, 'BORROWER-DETAILS-V1-FACE-VERIFICATION-V2');
  assert.deepEqual(result.workflow.states[result.workflow.startState].vendorConfiguration, { retained: true });
  assert.deepEqual(result.workflow.states[result.workflow.startState].edges.NEXT, {
    toState: result.workflow.startState,
    customRule: { enabled: true },
  });
});

test('rejects duplicate node identities', () => {
  const workflow = createWorkflowDefinition();
  workflow.states['MANAGER-RISK-V1-REVIEW-V1'] = {
    type: 'ACTOR',
    metadata: { actor: 'MANAGER', module: 'RISK', moduleVersion: 'V1', node: 'REVIEW', nodeVersion: 'V1' },
    edges: {},
  };
  const result = renameNode(workflow, workflow.startState, {
    actor: 'MANAGER',
    module: 'RISK',
    moduleVersion: 'V1',
    node: 'REVIEW',
    nodeVersion: 'V1',
  });
  assert.match(result.error, /already exists/);
});

test('edits edge rules without dropping unknown edge fields and supports edge ordering', () => {
  const workflow = createWorkflowDefinition();
  const nodeId = workflow.startState;
  workflow.states[nodeId].edges = {
    FIRST: { toState: nodeId, customCondition: { retained: true } },
    SECOND: { toState: nodeId },
  };

  const edited = updateWorkflowEdge(workflow, nodeId, 'FIRST', 'APPROVED', {
    ...workflow.states[nodeId].edges.FIRST,
    ruleEngine: {
      operator: 'OR',
      conditions: [{ field: 'creditScore', operator: '>=', value: 700 }],
    },
  });
  assert.equal(edited.error, '');
  assert.deepEqual(edited.workflow.states[nodeId].edges.APPROVED.customCondition, { retained: true });

  const reordered = moveWorkflowEdge(edited.workflow, nodeId, 'APPROVED', 1);
  assert.deepEqual(Object.keys(reordered.states[nodeId].edges), ['SECOND', 'APPROVED']);
  assert.equal(edited.workflow.states[nodeId].edges.APPROVED.ruleEngine.operator, 'OR');
});

test('validates dangling edges and invalid workflow start states', () => {
  const workflow = createWorkflowDefinition();
  workflow.startState = 'MISSING';
  workflow.states[Object.keys(workflow.states)[0]].edges.BROKEN = { toState: 'ALSO-MISSING' };
  const messages = validateWorkflowDefinition(workflow).map(({ message }) => message);
  assert.ok(messages.some((message) => message.includes('Start state')));
  assert.ok(messages.some((message) => message.includes('does not exist')));
});

test('validates edge condition groups and required condition fields', () => {
  const workflow = createWorkflowDefinition();
  const nodeId = workflow.startState;
  workflow.states[nodeId].edges.BROKEN = {
    toState: nodeId,
    ruleEngine: { operator: 'XOR', conditions: [{ field: '', operator: '=', value: undefined }] },
  };
  const errors = validateWorkflowDefinition(workflow);
  assert.ok(errors.some(({ field }) => field.endsWith('ruleEngine.operator')));
  assert.ok(errors.some(({ field }) => field.endsWith('ruleEngine.conditions.0')));
});

test('local workflow drafts always link one distinct local configuration key', () => {
  const definition = createWorkflowDefinition();
  const draft = makeLocalWorkflowDraft('Loan workflow', definition);
  assert.match(draft.draftKey, /^local-draft-/);
  assert.match(draft.configurationDraftKey, /^local-configuration-/);
  assert.notEqual(draft.draftKey, draft.configurationDraftKey);
  assert.deepEqual(draft.workflow, definition);
});
