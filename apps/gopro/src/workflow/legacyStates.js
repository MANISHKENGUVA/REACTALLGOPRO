// Legacy workflow states that predate the LOAN-FLOW-V6 actor/node naming
// convention. They are kept behind an explicit allowlist so the frontend never
// accepts an arbitrary STATE/COMPONENT_KEY value from the URL or from a
// backend response and forwards it to the event API.
//
// `actor` is the closest permitted application actor for the state. The
// backend must still enforce ownership and authorisation; this map only
// constrains what the browser is willing to submit.
export const LEGACY_WORKFLOW_STATES = Object.freeze({
  'BORROWER-CREDIT-V1-CREDIT-CHECK-V1': {
    actor: 'BORROWER',
    componentKey: 'BORROWER-CREDIT-CHECK-V1',
    routes: ['/loan-flow/borrower-credit-check'],
  },
  'BORROWER-DOCUMENTS-V1-DOCUMENT-UPLOAD-V1': {
    actor: 'BORROWER',
    componentKey: 'DOCUMENT-UPLOAD-V1',
    routes: ['/loan-flow/document-upload'],
  },
  'BORROWER-KYC-V1-TERMINAL-FACEVERIFICATION-V1': {
    actor: 'BORROWER',
    componentKey: 'TERMINAL-FACEVERIFICATION-V1',
    routes: ['/loan-flow/terminal-face-verification'],
  },
  'BORROWER-STATUS-V1-APPROVED-V1': {
    actor: 'BORROWER',
    componentKey: 'APPROVED-V1',
    routes: ['/loan-flow/approved'],
  },
  'DISBURSEMENT-PAYMENT-V1-LOAN-DISBURSEMENT-V1': {
    actor: 'LENDER',
    componentKey: 'DISBURSEMENT-REQUEST-V1',
    routes: ['/loan-flow/disbursement'],
  },
  'GUARANTOR-KYC-V1-KYC-UPLOAD-V1': {
    actor: 'COBORROWER',
    componentKey: 'GUARANTOR-KYC-V1',
    routes: ['/loan-flow/guarantor-kyc'],
  },
  'LENDER-DISBURSEMENT-V1-DISBURSEMENT-FAILED-V1': {
    actor: 'LENDER',
    componentKey: 'DISBURSEMENT-FAILED-V1',
    routes: ['/loan-flow/disbursement-failed'],
  },
  'MANAGER-FRAUD-CHECK-V1-FRAUD-CHECK-PENDING-V1': {
    actor: 'MANAGER',
    componentKey: 'FRAUD-CHECK-PENDING-V1',
    routes: ['/loan-flow/fraud-check-pending', '/loan-flow/manager-fraud-review'],
  },
  'RISKENGINE-CIBIL-V1-CIBIL-CHECK-V1': {
    actor: 'LENDER',
    componentKey: 'CIBIL-CHECK-V1',
    routes: ['/loan-flow/cibil-check'],
  },
  'UNDERWRITER-REVIEW-V1-UNDERWRITER-CHECK-V1': {
    actor: 'MANAGER',
    componentKey: 'UNDERWRITER-REVIEW-V1',
    routes: ['/loan-flow/underwriter-review'],
  },
});

export function getLegacyState(stateId) {
  const value = String(stateId || '').trim().toUpperCase();
  const entry = LEGACY_WORKFLOW_STATES[value];
  if (!entry) return null;
  return Object.freeze({
    stateId: value,
    actor: entry.actor,
    componentKey: entry.componentKey,
    routes: Object.freeze([...entry.routes]),
  });
}

export function isLegacyState(stateId) {
  return getLegacyState(stateId) !== null;
}

export function isLegacyStateAllowedOnRoute(stateId, routePath) {
  const entry = getLegacyState(stateId);
  if (!entry) return false;
  return entry.routes.includes(String(routePath || ''));
}
