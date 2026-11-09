# Workflow Builder: current architecture and implementation

## Existing architecture

- `apps/gopro` is the React 19/Vite application. `src/router.jsx` owns application routes; the loan applicant flow remains under `/loan-flow`.
- `src/workflow/WorkflowClient.js` is the existing HTTP boundary. Its known contracts cover application sessions, recovery, node resolution, and workflow events. It has no workflow-management CRUD, registry, validation, publish/version, or execution-history contract.
- `src/workflow/workflowConfig.js` centralizes those existing endpoints and validates the current static definition at startup.
- `src/loanFlowV6.json` is the current workflow definition. It uses `workflowVersion`, `startState`, keyed `states`, structured `metadata`, and edge-level `ruleEngine`; existing node types include the legacy value `FORM`.
- `packages/artiqui` provides shared UI primitives. The GoPro app also has `src/components/ui` wrappers and imports its Sass through `src/assets/sass/main.scss`.

## Relevant files added or extended

- `apps/gopro/src/pages/WorkflowBuilderPage.jsx` adds `/workflow-builder`, local workflow-draft management, node/edge editing, JSON import/editing, and draft validation.
- `apps/gopro/src/workflow/WorkflowBuilderModel.js` centralizes the four supported execution types, metadata identity generation, safe node renaming, and structural validation.
- `apps/gopro/src/workflow/WorkflowBuilderModel.test.js` tests identity generation, multiword metadata, preservation of unknown node fields, duplicate identity prevention, edge validation, and local configuration linkage.
- `apps/gopro/src/assets/sass/compo/_workflow-builder.scss` supplies the responsive builder styling; the existing Sass index imports it.
- `apps/gopro/src/router.jsx` adds the builder route; the development home page links to it without changing the existing loan-flow routes.

## Implementation plan and current boundary

1. Inspect the existing router, UI package, static workflow, and HTTP client before adding the builder. **Complete.**
2. Add a centralized node-type model and metadata-authoritative identity handling. **Complete.**
3. Implement local draft creation/import, visual node and edge editing, JSON editing, and local structural validation while retaining unknown JSON fields. **Complete.**
4. Verify focused tests, lint, and the production build. **Complete.**
5. Once the actual management API contract is available, add API methods for workflow/configuration CRUD, actor/module capabilities, backend validation, publishing/version retrieval, and execution events; then enable server-backed workflow IDs and publish/monitor actions. **Deferred.**

## Local-only behavior

The current UI stores drafts in this browser's `localStorage` under
`gopro.workflowBuilder.localDrafts.v1`. The generated `local-draft-*` and
`local-configuration-*` keys are local handles, not backend workflow or
configuration IDs. Local structural checks do not replace backend validation.
The editor intentionally does not claim to publish workflows, compare server
versions, or display execution events.

Imported legacy types and unrecognized JSON properties are retained. The four
new execution types offered by the editor are `ACTOR`,
`SYSTEM_INTERNAL_PROCESS`, `WEBHOOK`, and `API`.
