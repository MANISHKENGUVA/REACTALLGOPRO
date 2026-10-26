# Needs Validation — REACTGOPRO/GOPRO

These two records are NOT confirmed vulnerabilities. They are source-grounded weaknesses whose security impact depends on evidence outside GOPRO source.

## GOPRO-F-009 / P2-C2-03

Title: Client-asserted verification outcomes; backend trust unresolved.

Current evidence: GOPRO/src/pages/loanFlow/PANVerificationPage.jsx:30-32,51-57; GOPRO/src/pages/loanFlow/AadharVerificationPage.jsx:30,49-56; GOPRO/src/pages/loanFlow/CoborrowerFaceVerificationEngine.jsx:23-31.

Why validation is incomplete: source proves local or mock verdict values are placed in formData and posted, but not whether the backend treats them as authoritative.

Additional evidence required: backend field-authority contract, signed verification artifact requirement, per-eventType API contract.

Must not assume: KYC, bank, or liveness verification bypass.

## GOPRO-F-010 / P2-C7-02

Title: Theme env into path.resolve without allowlist; control unresolved.

Current evidence: GOPRO/vite.config.js:66-77; GOPRO/src/assets/scss2/main.scss:7.

Why validation is incomplete: source proves the unsanitized pattern but not who controls build environment variables.

Additional evidence required: CI/build env ownership, allowed theme directory set, fail-closed behavior.

Must not assume: remotely exploitable path traversal or attacker-controlled CI.