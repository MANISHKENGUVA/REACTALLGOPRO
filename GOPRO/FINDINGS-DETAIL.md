# Findings Detail — REACTGOPRO/GOPRO

### GOPRO-F-001 / P2-C1-02

Status: VALIDATED. Title: Unguarded loan-flow rendering with missing or foreign workflow IDs. Category: C1 routing.

Source evidence: GOPRO/src/router.jsx:181-218,294-367; GOPRO/src/layouts/LoanFlowLayout.jsx:17-35; GOPRO/src/pages/loanFlow/PersonalInfoPage.jsx:29-36.

Data flow: direct step URL to loader null or workflowData to layout Outlet to query-derived workflowMetadata to event POST.

Security significance: frontend step exposure and ordering weakness. Scope boundary: no backend authorization bypass claimed. Unresolved: backend state-machine and ID binding. Remediation: loader guard and safe deny route.

### GOPRO-F-002 / P2-C2-01

Status: VALIDATED. Title: PII event POSTs with no frontend auth material and hardcoded cleartext endpoint. Category: C2 loan form/API/PII.

Source evidence: GOPRO/src/pages/loanFlow/PersonalInfoPage.jsx:50-64; GOPRO/src/pages/loanFlow/VerificationPendingPage.jsx:35-42; GOPRO/src/router.jsx:38.

Data flow: formData plus query workflowMetadata to JSON.stringify to fetch http POST with Content-Type only.

Security significance: missing frontend auth material and cleartext default. Scope boundary: backend unauthenticated access not claimed. Unresolved: backend auth, ID entropy, production host. Remediation: centralized authenticated API client.

### GOPRO-F-003 / P2-C2-02

Status: VALIDATED. Title: PII and workflow IDs in console, DOM, and URL. Category: C2 PII retention.

Source evidence: GOPRO/src/pages/loanFlow/PersonalInfoPage.jsx:56,89-92; GOPRO/src/router.jsx:14-18,54-58; GOPRO/src/utils/globalRouterNavigator.js:260-266.

Data flow: payload and viewResult to console, IDs to JSX text and URL params.

Security significance: local and history retention expansion. Scope boundary: remote aggregation not claimed. Unresolved: log aggregation. Remediation: remove or gate logs; stop rendering IDs.

### GOPRO-F-004 / P2-C2-04

Status: VALIDATED. Title: Query-controlled state keys rendered and re-POSTed. Category: C2 state reflection.

Source evidence: GOPRO/src/pages/loanFlow/PersonalInfoPage.jsx:31-32,89,50-54.

Data flow: query STATE/COMPONENT_KEY to workflowMetadata to JSX text and POST JSON.

Security significance: semantic spoofing and binding confusion; XSS disproved. Scope boundary: no script execution. Unresolved: backend use of state keys. Remediation: allowlist and derive from bootstrap.

### GOPRO-F-005 / P2-C3-01

Status: VALIDATED. Title: Document steps advance on filenames or booleans without validation or binary upload. Category: C3 KYC/document.

Source evidence: GOPRO/src/pages/loanFlow/KYCUploadPage.jsx:26-49,83; GOPRO/src/pages/loanFlow/DocumentUploadPage.jsx:21-36; GOPRO/src/pages/loanFlow/BankStatementUploadPage.jsx:34-42.

Data flow: files to presence check to names/counts/booleans to JSON POST; bytes never sent.

Security significance: fake completion and weak client checks. Scope boundary: server upload not claimed. Unresolved: backend intake policy. Remediation: client checks plus multipart upload with server validation.

### GOPRO-F-006 / P2-C4-01

Status: VALIDATED. Title: Polling auto-navigation on unallowlisted componentKey. Category: C4 polling.

Source evidence: GOPRO/src/pages/loanFlow/VerificationPendingPage.jsx:11-18,28-60.

Data flow: query IDs to 3s poll to componentKey to resolveWorkflowRoute to navigate.

Security significance: trust-driven navigation without transition allowlist. Scope boundary: backend auth not claimed. Unresolved: backend auth/rate limit. Remediation: authenticate, backoff, allowlist transitions, https.

### GOPRO-F-007 / P2-C7-01

Status: VALIDATED. Title: Hardcoded cleartext localhost default with conflicting documented env and port. Category: C7 configuration.

Source evidence: GOPRO/src/router.jsx:38; GOPRO/SETUP_GUIDE.md:235-240; GOPRO/vite.config.js:62-82.

Data flow: absent env to hardcoded http default to fetch; documented port 3001 variable unused.

Security significance: unsafe default and configuration drift. Scope boundary: production deployment not claimed. Unresolved: production env values. Remediation: single HTTPS env base, fail closed, align docs.

### GOPRO-F-008 / P2-C8-01

Status: VALIDATED. Title: Root route exposes playground with demo identities. Category: C8 demo exposure.

Source evidence: GOPRO/src/router.jsx:282-289; GOPRO/src/pages/AllComponentsPlaygroundPage.jsx:556-566; GOPRO/src/pages/playgroundSnippets.js:42-45.

Data flow: root route to playground component tree with demo values and no environment guard.

Security significance: source exposure and insecure defaults hygiene. Scope boundary: production exposure not claimed. Unresolved: deployment routing. Remediation: gate behind DEV and use synthetic placeholders.

### GOPRO-F-009 / P2-C2-03

Status: NEEDS_VALIDATION. Title: Client-asserted verification outcomes; backend trust unresolved. Category: C2 verification fields.

Source evidence: GOPRO/src/pages/loanFlow/PANVerificationPage.jsx:30-32,51-57; GOPRO/src/pages/loanFlow/AadharVerificationPage.jsx:30,49-56; GOPRO/src/pages/loanFlow/CoborrowerFaceVerificationEngine.jsx:23-31.

What exists: local/mock verdict values enter formData and are posted as workflow events.

Why incomplete: GOPRO source cannot show whether the backend treats these verdict fields as authoritative, ignored, or replaced by independent checks. Needs backend/deployment validation.

Required evidence: backend field-authority contract, signed verification artifact requirement, per-eventType API contract.

Must not assume: KYC, bank, or liveness verification bypass.

### GOPRO-F-010 / P2-C7-02

Status: NEEDS_VALIDATION. Title: Theme env into path.resolve without allowlist; control unresolved. Category: C7 build configuration.

Source evidence: GOPRO/vite.config.js:66-77; GOPRO/src/assets/scss2/main.scss:7.

What exists: VITE_APP_THEME feeds path.resolve for the @theme alias consumed by SCSS import, with no allowlist, separator rejection, or parent-sequence rejection in source.

Why incomplete: source cannot establish who controls build environment variables. Needs build/deployment validation.

Required evidence: CI/build env ownership, allowed theme directory set, fail-closed behavior on unknown theme.

Must not assume: remotely exploitable path traversal or attacker-controlled CI.

### GOPRO-F-011 / P2-C1-01

Status: REJECTED. Title: Rejected external open redirect. Category: C1 routing.

Source evidence: GOPRO/src/router.jsx:105-135,137-157,159-179,200-214.

Independent Phase 5 verification: constructRedirectUrl returns payload.redirectUrl, but appendWorkflowParamsToRedirect parses it with new URL against a localhost base and returns only pathname plus search, so an absolute external origin is stripped before redirect(). External open redirect is disproved.

Residual observation: backend may still select a same-origin path with workflow IDs appended; this is not an external redirect and is not reported as an active vulnerability.
