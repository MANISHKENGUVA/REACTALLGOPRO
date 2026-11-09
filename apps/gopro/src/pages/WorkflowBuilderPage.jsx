import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import loanFlow from '../loanFlowV6.json';
import Button from '../components/ui/Button';
import {
  buildNodeIdentity,
  createNodeState,
  createWorkflowDefinition,
  makeLocalWorkflowDraft,
  moveWorkflowEdge,
  NODE_TYPES,
  renameNode,
  updateWorkflowEdge,
  validateWorkflowDefinition,
  WORKFLOW_DRAFTS_STORAGE_KEY,
} from '../workflow/WorkflowBuilderModel';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const RULE_OPERATORS = ['=', '!=', '>', '>=', '<', '<=', 'IN', 'NOT_IN', 'CONTAINS'];

function readLocalDrafts() {
  try {
    const raw = window.localStorage.getItem(WORKFLOW_DRAFTS_STORAGE_KEY);
    if (!raw) return { drafts: [], error: '' };
    const drafts = JSON.parse(raw);
    if (!Array.isArray(drafts) || drafts.some((draft) => (
      !draft || typeof draft.draftKey !== 'string'
      || typeof draft.configurationDraftKey !== 'string'
      || typeof draft.name !== 'string'
      || !draft.workflow || typeof draft.workflow !== 'object'
    ))) {
      throw new Error('Stored workflow drafts have an invalid format.');
    }
    return { drafts, error: '' };
  } catch (error) {
    return { drafts: [], error: `Local drafts could not be loaded: ${error.message}` };
  }
}

function formatValue(value) {
  if (typeof value === 'string') return value;
  return value === undefined ? '' : JSON.stringify(value, null, 2);
}

function parseRuleValue(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function fieldValueFor(node, field) {
  if (field.kind === 'json') return formatValue(node[field.name]);
  return node[field.name] ?? '';
}

function workflowErrors(workflow) {
  return validateWorkflowDefinition(workflow);
}

function WorkflowList({ drafts, selectedKey, onSelect, query, onQueryChange }) {
  const filtered = drafts.filter((draft) => draft.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <aside className="wb-sidebar" aria-label="Workflow drafts">
      <div className="wb-sidebar__heading">
        <div>
          <span className="wb-eyebrow">Workspace</span>
          <h2>Local drafts</h2>
        </div>
        <span className="wb-count">{filtered.length}</span>
      </div>
      <label className="wb-search">
        <span className="wb-visually-hidden">Search workflow drafts</span>
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search drafts" />
      </label>
      <div className="wb-workflow-list">
        {filtered.length ? filtered.map((draft) => (
          <button
            type="button"
            className={`wb-workflow-item${draft.draftKey === selectedKey ? ' is-active' : ''}`}
            key={draft.draftKey}
            onClick={() => onSelect(draft.draftKey)}
          >
            <span className="wb-workflow-item__title">{draft.name}</span>
            <span className="wb-workflow-item__meta">{draft.workflow.workflowVersion || 'No version'} · Local draft</span>
          </button>
        )) : (
          <p className="wb-empty">No drafts match your search.</p>
        )}
      </div>
      <div className="wb-sidebar__footer">
        <span className="wb-dot" aria-hidden="true" />
        Stored in this browser only
      </div>
    </aside>
  );
}

function RuleEditor({ edge, onChange }) {
  const rule = edge.ruleEngine || {};
  const groupKey = Object.hasOwn(rule, 'operator') ? 'operator' : (Object.hasOwn(rule, 'type') ? 'type' : 'operator');
  const groupOperator = rule[groupKey] || 'AND';
  const conditions = Array.isArray(rule.conditions) ? rule.conditions : [];
  const updateRule = (next) => onChange({ ...edge, ruleEngine: { ...rule, ...next } });
  const updateCondition = (index, key, value) => {
    const nextConditions = conditions.map((condition, conditionIndex) => (
      conditionIndex === index ? { ...condition, [key]: value } : condition
    ));
    updateRule({ conditions: nextConditions });
  };
  const addCondition = () => updateRule({
    conditions: [...conditions, { field: '', operator: '=', value: '' }],
  });
  const removeCondition = (index) => updateRule({
    conditions: conditions.filter((_, conditionIndex) => conditionIndex !== index),
  });

  return (
    <div className="wb-rule">
      <div className="wb-rule__header">
        <strong>Edge rule</strong>
        <label className="wb-inline-field">
          <span>Match</span>
          <select
            aria-label="Rule group operator"
            value={groupOperator}
            onChange={(event) => updateRule({ [groupKey]: event.target.value })}
          >
            <option value="AND">All (AND)</option>
            <option value="OR">Any (OR)</option>
          </select>
        </label>
      </div>
      {conditions.map((condition, index) => (
        <div className="wb-condition" key={index}>
          <label>
            <span>Field</span>
            <input
              aria-label={`Condition ${index + 1} field`}
              value={condition.field || ''}
              placeholder="e.g. creditScore"
              onChange={(event) => updateCondition(index, 'field', event.target.value)}
            />
          </label>
          <label>
            <span>Operator</span>
            <select
              aria-label={`Condition ${index + 1} operator`}
              value={condition.operator || '='}
              onChange={(event) => updateCondition(index, 'operator', event.target.value)}
            >
              {RULE_OPERATORS.map((operator) => <option key={operator} value={operator}>{operator}</option>)}
            </select>
          </label>
          <label>
            <span>Value (JSON or text)</span>
            <input
              aria-label={`Condition ${index + 1} value`}
              value={formatValue(condition.value)}
              onChange={(event) => updateCondition(index, 'value', parseRuleValue(event.target.value))}
            />
          </label>
          <button type="button" className="wb-icon-button" aria-label={`Remove condition ${index + 1}`} onClick={() => removeCondition(index)}>×</button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addCondition}>Add condition</Button>
    </div>
  );
}

function EdgeEditor({ edgeName, edge, states, onChange, onRename, onRemove, onMove, index, count }) {
  const isFallback = edgeName === 'DEFAULT' && !edge.ruleEngine;
  return (
    <section className="wb-edge" aria-label={`Edge ${edgeName}`}>
      <div className="wb-edge__top">
        <label className="wb-field">
          <span>Edge name</span>
          <input value={edgeName} onChange={(event) => onRename(event.target.value)} />
        </label>
        <div className="wb-edge__actions">
          <button type="button" className="wb-icon-button" aria-label={`Move ${edgeName} up`} disabled={index === 0} onClick={() => onMove(-1)}>↑</button>
          <button type="button" className="wb-icon-button" aria-label={`Move ${edgeName} down`} disabled={index === count - 1} onClick={() => onMove(1)}>↓</button>
          <button type="button" className="wb-icon-button wb-icon-button--danger" aria-label={`Remove ${edgeName}`} onClick={onRemove}>×</button>
        </div>
      </div>
      <label className="wb-field">
        <span>Next node</span>
        <select value={edge.toState || ''} onChange={(event) => onChange({ ...edge, toState: event.target.value })}>
          <option value="">Choose destination</option>
          {states.map(([stateId, state]) => (
            <option key={stateId} value={stateId}>
              {state.metadata?.node || stateId} · {state.metadata?.actor || 'Unknown actor'}
            </option>
          ))}
        </select>
      </label>
      {isFallback ? (
        <p className="wb-fallback-note">This is the fallback edge, identified by the edge name <code>DEFAULT</code>. No rule is attached.</p>
      ) : edge.ruleEngine ? (
        <RuleEditor edge={edge} onChange={onChange} />
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange({ ...edge, ruleEngine: { operator: 'AND', conditions: [{ field: '', operator: '=', value: '' }] } })}
        >
          Add rule
        </Button>
      )}
    </section>
  );
}

export default function WorkflowBuilderPage() {
  const initial = useMemo(readLocalDrafts, []);
  const [drafts, setDrafts] = useState(initial.drafts);
  const [selectedKey, setSelectedKey] = useState(initial.drafts[0]?.draftKey || '');
  const [storeError, setStoreError] = useState(initial.error);
  const [query, setQuery] = useState('');
  const [newName, setNewName] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [jsonText, setJsonText] = useState(
    initial.drafts[0] ? JSON.stringify(initial.drafts[0].workflow, null, 2) : '',
  );
  const [jsonError, setJsonError] = useState('');
  const [notice, setNotice] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldBuffers, setFieldBuffers] = useState({});
  const [activeTab, setActiveTab] = useState('design');

  const selectedDraft = drafts.find((draft) => draft.draftKey === selectedKey) || null;
  const workflow = selectedDraft?.workflow;
  const states = workflow?.states || {};
  const stateEntries = Object.entries(states);
  const activeNodeId = Object.hasOwn(states, selectedNodeId) ? selectedNodeId : (workflow?.startState || stateEntries[0]?.[0] || '');
  const selectedNode = states[activeNodeId];
  const selectedNodeType = NODE_TYPES.find(({ type }) => type === selectedNode?.type);
  const errors = workflow ? workflowErrors(workflow) : [];
  const hasUnappliedJson = Boolean(workflow)
    && jsonText !== JSON.stringify(workflow, null, 2);
  const actorSuggestions = [...new Set(stateEntries.map(([, state]) => state.metadata?.actor).filter(Boolean))];
  const moduleSuggestions = [...new Set(stateEntries.map(([, state]) => state.metadata?.module).filter(Boolean))];

  const canLeaveJsonEditor = () => !hasUnappliedJson
    || window.confirm('Discard unapplied JSON edits? Choose Cancel to keep editing them.');

  const persistDrafts = (nextDrafts) => {
    try {
      window.localStorage.setItem(WORKFLOW_DRAFTS_STORAGE_KEY, JSON.stringify(nextDrafts));
      setDrafts(nextDrafts);
      setStoreError('');
      return true;
    } catch (error) {
      setDrafts(nextDrafts);
      setStoreError(`This change is only in memory; local storage failed: ${error.message}`);
      return false;
    }
  };

  const replaceDraft = (updated) => {
    const nextDrafts = drafts.map((draft) => (
      draft.draftKey === updated.draftKey
        ? { ...updated, updatedAt: new Date().toISOString() }
        : draft
    ));
    persistDrafts(nextDrafts);
  };

  const updateWorkflow = (nextWorkflow) => {
    if (!selectedDraft) return;
    replaceDraft({ ...selectedDraft, workflow: nextWorkflow });
    setJsonText(JSON.stringify(nextWorkflow, null, 2));
    setJsonError('');
    setNotice('Local draft saved in this browser.');
  };

  const createDraft = (source) => {
    if (!canLeaveJsonEditor()) return;
    const name = newName.trim() || (source === 'sample' ? 'Loan flow V6 copy' : 'Untitled workflow');
    const definition = source === 'sample'
      ? structuredClone(loanFlow)
      : createWorkflowDefinition('NEW-WORKFLOW-V1');
    const draft = makeLocalWorkflowDraft(name, definition);
    const nextDrafts = [...drafts, draft];
    persistDrafts(nextDrafts);
    setSelectedKey(draft.draftKey);
    setSelectedNodeId(definition.startState || '');
    setJsonText(JSON.stringify(definition, null, 2));
    setJsonError('');
    setNewName('');
    setActiveTab('design');
    setNotice('Created a browser-only draft. No server workflow or configuration was created.');
  };

  const updateState = (nextState) => {
    updateWorkflow({ ...workflow, states: { ...states, [activeNodeId]: nextState } });
  };

  const changeMetadata = (field, value) => {
    const nextMetadata = { ...selectedNode.metadata, [field]: value };
    const result = renameNode(workflow, activeNodeId, nextMetadata);
    if (result.error) {
      setFieldErrors({ metadata: result.error });
      return;
    }
    setFieldErrors({});
    setSelectedNodeId(buildNodeIdentity(nextMetadata));
    updateWorkflow(result.workflow);
  };

  const updateTypeField = (field, value) => {
    const currentErrors = { ...fieldErrors };
    delete currentErrors[field];
    setFieldErrors(currentErrors);
    updateState({ ...selectedNode, [field]: value });
  };

  const updateTypeJsonField = (field, raw) => {
    setFieldBuffers({ ...fieldBuffers, [field]: raw });
    try {
      updateTypeField(field, JSON.parse(raw));
    } catch {
      setFieldErrors({ ...fieldErrors, [field]: 'Enter valid JSON before this setting can be saved.' });
    }
  };

  const addNode = (type) => {
    let index = stateEntries.length + 1;
    let node = createNodeState(type, index);
    let nodeId = buildNodeIdentity(node.metadata);
    while (Object.hasOwn(states, nodeId)) {
      index += 1;
      node = createNodeState(type, index);
      nodeId = buildNodeIdentity(node.metadata);
    }
    updateWorkflow({ ...workflow, states: { ...states, [nodeId]: node } });
    setSelectedNodeId(nodeId);
  };

  const addEdge = (fallback = false) => {
    const name = fallback ? 'DEFAULT' : `EDGE-${String(Object.keys(selectedNode.edges || {}).length + 1).padStart(2, '0')}`;
    if (Object.hasOwn(selectedNode.edges || {}, name)) {
      setNotice(`An edge named ${name} already exists.`);
      return;
    }
    const destination = stateEntries.find(([id]) => id !== activeNodeId)?.[0] || activeNodeId;
    const edge = fallback
      ? { toState: destination }
      : { toState: destination, ruleEngine: { operator: 'AND', conditions: [{ field: '', operator: '=', value: '' }] } };
    updateState({ ...selectedNode, edges: { ...(selectedNode.edges || {}), [name]: edge } });
  };

  const updateEdge = (oldName, nextName, nextEdge) => {
    const result = updateWorkflowEdge(workflow, activeNodeId, oldName, nextName, nextEdge);
    if (result.error) {
      setNotice(result.error);
      return;
    }
    updateWorkflow(result.workflow);
  };

  const reorderEdge = (edgeName, offset) => {
    updateWorkflow(moveWorkflowEdge(workflow, activeNodeId, edgeName, offset));
  };

  const removeNode = () => {
    const incoming = stateEntries.some(([id, state]) => id !== activeNodeId
      && Object.values(state.edges || {}).some((edge) => edge.toState === activeNodeId));
    if (activeNodeId === workflow.startState || incoming) {
      setNotice('Choose another start node and remove incoming edges before deleting this node.');
      return;
    }
    if (stateEntries.length < 2) {
      setNotice('A workflow must retain at least one node.');
      return;
    }
    const nextStates = { ...states };
    delete nextStates[activeNodeId];
    const nextWorkflow = { ...workflow, states: nextStates };
    updateWorkflow(nextWorkflow);
    setSelectedNodeId(nextWorkflow.startState);
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Workflow JSON must be an object.');
      }
      updateWorkflow(parsed);
      setSelectedNodeId(parsed.startState || Object.keys(parsed.states || {})[0] || '');
      setNotice('JSON applied to the visual editor and saved as a local draft.');
    } catch (error) {
      setJsonError(error.message);
    }
  };

  const importJsonFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (!canLeaveJsonEditor()) return;
      const content = await file.text();
      const parsed = JSON.parse(content);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Workflow JSON must be an object.');
      const draft = makeLocalWorkflowDraft(file.name.replace(/\.json$/i, ''), parsed);
      persistDrafts([...drafts, draft]);
      setSelectedKey(draft.draftKey);
      setSelectedNodeId(parsed.startState || Object.keys(parsed.states || {})[0] || '');
      setJsonText(JSON.stringify(parsed, null, 2));
      setJsonError('');
      setNotice('Imported a JSON file as a browser-only local draft.');
    } catch (error) {
      setNotice(`JSON import failed: ${error.message}`);
    } finally {
      event.target.value = '';
    }
  };

  const deleteDraft = () => {
    if (!selectedDraft) return;
    const next = drafts.filter((draft) => draft.draftKey !== selectedKey);
    persistDrafts(next);
    setSelectedKey(next[0]?.draftKey || '');
    setSelectedNodeId(next[0]?.workflow.startState || '');
    setJsonText(next[0] ? JSON.stringify(next[0].workflow, null, 2) : '');
    setNotice('Local draft removed from this browser.');
  };

  return (
    <main className="wb-page">
      <header className="wb-topbar">
        <Link className="wb-brand" to="/" aria-label="Go to GoPro home">
          <span className="wb-brand__mark">G</span>
          <span>GoPro <strong>Workflow Studio</strong></span>
        </Link>
        <span className="wb-local-badge"><span aria-hidden="true" /> Browser-only workspace</span>
      </header>

      <div className="wb-shell">
        <WorkflowList
          drafts={drafts}
          selectedKey={selectedKey}
          onSelect={(key) => {
            if (!canLeaveJsonEditor()) return;
            const draft = drafts.find((item) => item.draftKey === key);
            setSelectedKey(key);
            setSelectedNodeId(draft?.workflow.startState || '');
            setJsonText(draft ? JSON.stringify(draft.workflow, null, 2) : '');
            setJsonError('');
            setFieldBuffers({});
            setFieldErrors({});
            setNotice('');
          }}
          query={query}
          onQueryChange={setQuery}
        />

        <section className="wb-main">
          <div className="wb-page-heading">
            <div>
              <span className="wb-eyebrow">Workflow management</span>
              <h1>Workflow builder</h1>
              <p>Design and validate local workflow drafts before connecting a management API.</p>
            </div>
            <label className="wb-import-button">
              <span>Import JSON</span>
              <input type="file" accept="application/json,.json" onChange={importJsonFile} />
            </label>
          </div>

          <div className="wb-local-warning" role="note">
            <span className="wb-warning-icon" aria-hidden="true">!</span>
            <p><strong>Local-only mode.</strong> Drafts and configuration keys are stored in this browser. They are not server IDs; this editor cannot create, validate, publish, or execute live workflows.</p>
          </div>
          {storeError ? <div className="wb-alert wb-alert--error" role="alert">{storeError}</div> : null}
          {notice ? <div className="wb-alert" role="status">{notice}</div> : null}

          <section className="wb-create-card" aria-label="Create a workflow draft">
            <div>
              <h2>Create a local draft</h2>
              <p>Every draft receives exactly one distinct local configuration key.</p>
            </div>
            <label className="wb-create-name">
              <span className="wb-visually-hidden">Workflow draft name</span>
              <input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Name your workflow" />
            </label>
            <div className="wb-create-actions">
              <Button variant="primary" onClick={() => createDraft('blank')}>New blank draft</Button>
              <Button variant="outline" onClick={() => createDraft('sample')}>Copy V6 workflow</Button>
            </div>
          </section>

          {!selectedDraft ? (
            <section className="wb-empty-state">
              <span className="wb-empty-state__icon" aria-hidden="true">⌘</span>
              <h2>No workflow selected</h2>
              <p>Create a blank draft, copy the existing V6 workflow, or import a workflow JSON file to begin.</p>
            </section>
          ) : (
            <>
              <section className="wb-summary">
                <div className="wb-summary__title">
                  <div>
                    <span className="wb-eyebrow">Draft workflow</span>
                    <h2>{selectedDraft.name}</h2>
                  </div>
                  <span className="wb-status">Draft · Local only</span>
                </div>
                <div className="wb-identities">
                  <div><span>Local workflow draft key</span><code>{selectedDraft.draftKey}</code></div>
                  <div><span>Linked local configuration draft key</span><code>{selectedDraft.configurationDraftKey}</code></div>
                </div>
                <label className="wb-version-field">
                  <span>Workflow version</span>
                  <input
                    value={workflow.workflowVersion || ''}
                    onChange={(event) => updateWorkflow({ ...workflow, workflowVersion: event.target.value })}
                    aria-label="Workflow version"
                  />
                </label>
              </section>

              <nav className="wb-tabs" aria-label="Workflow editor">
                <button type="button" className={activeTab === 'design' ? 'is-active' : ''} disabled={hasUnappliedJson} onClick={() => setActiveTab('design')}>Visual designer</button>
                <button type="button" className={activeTab === 'json' ? 'is-active' : ''} onClick={() => setActiveTab('json')}>Workflow JSON</button>
                <button type="button" className={activeTab === 'versions' ? 'is-active' : ''} onClick={() => setActiveTab('versions')}>Versions & execution</button>
              </nav>

              {activeTab === 'design' ? (
                <div className="wb-designer">
                  <section className="wb-canvas" aria-label="Workflow node canvas">
                    <div className="wb-canvas__heading">
                      <div><h2>Workflow nodes</h2><p>{stateEntries.length} node{stateEntries.length === 1 ? '' : 's'} · click to configure</p></div>
                      <label className="wb-add-node">
                        <span className="wb-visually-hidden">Add node type</span>
                        <select value="" onChange={(event) => { if (event.target.value) addNode(event.target.value); }}>
                          <option value="">+ Add node</option>
                          {NODE_TYPES.map(({ type, label }) => <option key={type} value={type}>{label}</option>)}
                        </select>
                      </label>
                    </div>
                    <div className="wb-node-list">
                      {stateEntries.map(([stateId, state]) => {
                        const type = NODE_TYPES.find((item) => item.type === state.type);
                        return (
                          <button
                            type="button"
                            key={stateId}
                            className={`wb-node${activeNodeId === stateId ? ' is-selected' : ''}${workflow.startState === stateId ? ' is-start' : ''}`}
                            onClick={() => {
                              setSelectedNodeId(stateId);
                              setFieldBuffers({});
                              setFieldErrors({});
                            }}
                          >
                            <span className={`wb-node__type wb-node__type--${type ? state.type.toLowerCase() : 'legacy'}`}>{type?.label || `Legacy ${state.type || 'unknown'}`}</span>
                            <strong>{state.metadata?.node || stateId}</strong>
                            <span className="wb-node__meta">{state.metadata?.actor || 'No actor'} · {Object.keys(state.edges || {}).length} edges</span>
                            {workflow.startState === stateId ? <span className="wb-start-tag">Start</span> : null}
                            <span className="wb-node__connector" aria-hidden="true" />
                          </button>
                        );
                      })}
                    </div>
                    <div className="wb-canvas__footer">
                      <span>Start node</span>
                      <select
                        aria-label="Workflow start state"
                        value={workflow.startState || ''}
                        onChange={(event) => updateWorkflow({ ...workflow, startState: event.target.value })}
                      >
                        <option value="">Select start node</option>
                        {stateEntries.map(([id, state]) => <option key={id} value={id}>{state.metadata?.node || id}</option>)}
                      </select>
                    </div>
                  </section>

                  <section className="wb-inspector" aria-label="Node configuration">
                    {!selectedNode ? (
                      <div className="wb-inspector__empty"><h2>Select a node</h2><p>Choose a node from the canvas or create one.</p></div>
                    ) : (
                      <>
                        <div className="wb-inspector__heading">
                          <div><span className="wb-eyebrow">Node configuration</span><h2>{selectedNode.metadata?.node || activeNodeId}</h2></div>
                          {workflow.startState !== activeNodeId ? <Button variant="danger" size="sm" onClick={removeNode}>Delete node</Button> : null}
                        </div>
                        <p className="wb-node-identity"><span>Generated node identity</span><code>{buildNodeIdentity(selectedNode.metadata)}</code></p>

                        <div className="wb-form-section">
                          <h3>Execution type</h3>
                          {!selectedNodeType ? <p className="wb-legacy-note">Existing type <code>{selectedNode.type || '(missing)'}</code> is preserved from the imported workflow. Change it to one of the four supported types to configure it here.</p> : null}
                          <label className="wb-field">
                            <span>Node type</span>
                            <select
                              value={selectedNodeType?.type || ''}
                              onChange={(event) => {
                                const type = event.target.value;
                                if (type) updateState({ ...selectedNode, type });
                              }}
                            >
                              <option value="" disabled>Choose one of four types</option>
                              {NODE_TYPES.map(({ type, label }) => <option key={type} value={type}>{label}</option>)}
                            </select>
                          </label>
                        </div>

                        <div className="wb-form-section">
                          <h3>Actor and module metadata</h3>
                          <p>Each value is stored separately. Multiword values remain intact.</p>
                          <div className="wb-metadata-grid">
                            {[
                              ['actor', 'Actor', actorSuggestions],
                              ['module', 'Module', moduleSuggestions],
                              ['moduleVersion', 'Module version', []],
                              ['node', 'Node name', []],
                              ['nodeVersion', 'Node version', []],
                            ].map(([field, label, suggestions]) => (
                              <label className="wb-field" key={field}>
                                <span>{label}</span>
                                <input
                                  list={suggestions.length ? `wb-${field}-options` : undefined}
                                  value={selectedNode.metadata?.[field] || ''}
                                  onChange={(event) => changeMetadata(field, event.target.value)}
                                />
                                {suggestions.length ? (
                                  <datalist id={`wb-${field}-options`}>
                                    {suggestions.map((value) => <option key={value} value={value} />)}
                                  </datalist>
                                ) : null}
                                {field === 'node' ? <small>Use hyphens for multiword names, e.g. FACE-VERIFICATION.</small> : null}
                              </label>
                            ))}
                          </div>
                          {fieldErrors.metadata ? <p className="wb-field-error" role="alert">{fieldErrors.metadata}</p> : null}
                        </div>

                        {selectedNodeType ? (
                          <div className="wb-form-section">
                            <h3>{selectedNodeType.label} settings</h3>
                            <p>Structured values are saved in the node JSON and unrelated fields are retained.</p>
                            {selectedNodeType.fields.map((field) => (
                              <label className="wb-field" key={field.name}>
                                <span>{field.label}</span>
                                {field.kind === 'json' ? (
                                  <textarea
                                    rows={field.name === 'settings' ? 3 : 4}
                                    value={fieldBuffers[field.name] ?? fieldValueFor(selectedNode, field)}
                                    onChange={(event) => updateTypeJsonField(field.name, event.target.value)}
                                    aria-invalid={Boolean(fieldErrors[field.name])}
                                  />
                                ) : field.kind === 'method' ? (
                                  <select value={selectedNode[field.name] || 'POST'} onChange={(event) => updateTypeField(field.name, event.target.value)}>
                                    {METHODS.map((method) => <option key={method} value={method}>{method}</option>)}
                                  </select>
                                ) : (
                                  <input
                                    type={field.kind === 'number' ? 'number' : 'text'}
                                    value={selectedNode[field.name] ?? ''}
                                    onChange={(event) => updateTypeField(
                                      field.name,
                                      field.kind === 'number' && event.target.value !== ''
                                        ? Number(event.target.value)
                                        : event.target.value,
                                    )}
                                  />
                                )}
                                {fieldErrors[field.name] ? <small className="wb-field-error">{fieldErrors[field.name]}</small> : null}
                              </label>
                            ))}
                          </div>
                        ) : null}

                        <div className="wb-form-section wb-edges-section">
                          <div className="wb-section-heading">
                            <div><h3>Outgoing edges</h3><p>Conditions are attached to edges; the backend evaluates them.</p></div>
                            <div className="wb-edge-add-actions">
                              <Button variant="outline" size="sm" onClick={() => addEdge(false)}>Add edge</Button>
                              <Button variant="outline" size="sm" onClick={() => addEdge(true)}>Add fallback</Button>
                            </div>
                          </div>
                          {Object.entries(selectedNode.edges || {}).length ? (
                            Object.entries(selectedNode.edges || {}).map(([edgeName, edge], index, entries) => (
                              <EdgeEditor
                                key={`${activeNodeId}-${index}`}
                                edgeName={edgeName}
                                edge={edge}
                                states={stateEntries}
                                index={index}
                                count={entries.length}
                                onChange={(next) => updateEdge(edgeName, edgeName, next)}
                                onRename={(nextName) => updateEdge(edgeName, nextName, edge)}
                                onRemove={() => {
                                  const nextEdges = { ...selectedNode.edges };
                                  delete nextEdges[edgeName];
                                  updateState({ ...selectedNode, edges: nextEdges });
                                }}
                                onMove={(offset) => reorderEdge(edgeName, offset)}
                              />
                            ))
                          ) : <p className="wb-empty">No outgoing edges. Add a transition or leave this node terminal.</p>}
                        </div>
                      </>
                    )}
                  </section>
                </div>
              ) : null}

              {activeTab === 'json' ? (
                <section className="wb-json-panel">
                  <div className="wb-json-toolbar">
                    <div><h2>Workflow configuration JSON</h2><p>Visual edits update this document. Apply valid JSON to update the visual designer.</p></div>
                    <Button variant="primary" onClick={applyJson}>Apply JSON</Button>
                  </div>
                  {hasUnappliedJson ? (
                    <div className="wb-alert wb-json-unsynced" role="status">
                      <span>JSON edits are not yet applied. Apply them or discard them before returning to the visual designer.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setJsonText(JSON.stringify(workflow, null, 2));
                          setJsonError('');
                        }}
                      >
                        Discard JSON edits
                      </button>
                    </div>
                  ) : null}
                  {jsonError ? <div className="wb-alert wb-alert--error" role="alert">{jsonError}</div> : null}
                  <label className="wb-json-editor">
                    <span className="wb-visually-hidden">Workflow JSON editor</span>
                    <textarea spellCheck="false" value={jsonText} onChange={(event) => { setJsonText(event.target.value); setJsonError(''); }} />
                  </label>
                </section>
              ) : null}

              {activeTab === 'versions' ? (
                <section className="wb-version-panel">
                  <div className="wb-version-panel__card">
                    <span className="wb-eyebrow">Current local version</span>
                    <h2>{workflow.workflowVersion || 'Unversioned'}</h2>
                    <p>This browser draft has not been validated or published by a workflow service.</p>
                    <span className="wb-status">Draft · Local only</span>
                  </div>
                  <div className="wb-version-panel__card">
                    <span className="wb-eyebrow">Execution monitor</span>
                    <h2>No live execution data</h2>
                    <p>Execution status, event history, and errors must come from backend APIs. No such management or execution contract is configured in this repository.</p>
                  </div>
                  <div className="wb-version-panel__actions">
                    <Button variant="outline" onClick={deleteDraft}>Delete local draft</Button>
                    <p>Publishing and version comparison are unavailable until the backend contract is provided.</p>
                  </div>
                </section>
              ) : null}

              <section className="wb-validation" aria-live="polite">
                <div className="wb-validation__heading">
                  <div><h2>Local structure validation</h2><p>Checks JSON shape, metadata identity, start node, and edge destinations.</p></div>
                  <span className={errors.length ? 'wb-validation__count has-errors' : 'wb-validation__count'}>{errors.length ? `${errors.length} issue${errors.length === 1 ? '' : 's'}` : 'No issues'}</span>
                </div>
                {errors.length ? (
                  <ul>
                    {errors.map((error, index) => (
                      <li key={`${error.nodeId}-${error.field}-${index}`}>
                        <code>{error.nodeId || 'workflow'}{error.field ? ` · ${error.field}` : ''}</code>
                        <span>{error.message}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="wb-validation__success">This draft passes the local structural checks. This is not backend validation.</p>}
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
