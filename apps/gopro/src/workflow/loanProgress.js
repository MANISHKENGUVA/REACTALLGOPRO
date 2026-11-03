// Pure loan-progress projection for the persistent tracker.
//
// The tracker must never guess. It receives the state the backend resolved and
// places that state on the borrower journey. It does not look at the URL, at
// visited routes, or at what the user clicked. If the backend reports a status
// that is not a normal step (waiting, verification gate, rejection, cancel),
// the projection says so instead of advancing the tracker.
//
// Stage states:
//   completed      - the backend has moved past this stage
//   available      - this stage is a form the borrower can act on now
//   current        - this stage is being processed by the backend now
//   pending        - an explicit wait for another party / verification
//   needs-attention- a gate, expiry or session issue stops this stage
//   failed         - the application ended here
//   skipped        - the journey was cancelled
//   locked         - not reached yet

export const PROGRESS_ACTOR_LABELS = Object.freeze({
  BORROWER: 'Borrower',
  COBORROWER: 'Co-borrower',
  LENDER: 'Lender',
  MANAGER: 'Credit manager',
});

export const LOAN_STAGES = Object.freeze([
  {
    id: 'profile',
    label: 'Profile',
    description: 'Personal details and address',
    nodes: ['PERSONAL-INFO', 'ADDRESS-INFO'],
    modules: ['DETAILS', 'ADDRESS'],
  },
  {
    id: 'identity',
    label: 'Identity & KYC',
    description: 'Documents, PAN, Aadhaar and face verification',
    nodes: [
      'KYC-UPLOAD',
      'PAN-VERIFICATION',
      'AADHAR-VERIFICATION',
      'FACE-VERIFICATION',
      'VERIFICATION-PENDING',
      'TERMINAL-FACEVERIFICATION',
    ],
    modules: ['KYC'],
  },
  {
    id: 'employment',
    label: 'Employment & income',
    description: 'Salary or business details',
    nodes: ['EMPLOYMENT-INFO', 'SALARY-INFO', 'BUSINESS-INFO'],
    modules: ['EMPLOYMENT', 'SALARY', 'BUSINESS'],
  },
  {
    id: 'banking',
    label: 'Bank & documents',
    description: 'Account details, statements and supporting files',
    nodes: [
      'BANK-DETAILS',
      'BANK-ACCOUNT-VERIFICATION',
      'BANK-STATEMENT-UPLOAD',
      'DOCUMENT-UPLOAD',
      'DOCUMENTS-UPLOAD',
    ],
    modules: ['BANK', 'DOCUMENT', 'DOCUMENTS'],
  },
  {
    id: 'verification',
    label: 'Verification',
    description: 'Credit, fraud, risk and eligibility checks',
    nodes: [
      'CREDIT-CHECK',
      'BORROWER-CREDIT-CHECK',
      'CIBIL-CHECK',
      'FRAUD-CHECK',
      'DOCUMENT-VERIFICATION',
      'RISK-ASSESSMENT',
      'ELIGIBILITY-CHECK',
      'UNDERWRITER-REVIEW',
    ],
    modules: ['CREDIT', 'FRAUD', 'RISK', 'ELIGIBILITY'],
  },
  {
    id: 'offer',
    label: 'Offer & consent',
    description: 'Consent, amount, pricing and the offer',
    nodes: ['LOAN-CONSENT', 'LOAN-AMOUNT', 'INTEREST-RATE', 'LOAN-OFFER'],
    modules: ['CONSENT', 'OFFER'],
  },
  {
    id: 'agreement',
    label: 'Agreement & approval',
    description: 'Agreement, e-sign, mandate and final approval',
    nodes: [
      'AGREEMENT-GENERATION',
      'ESIGN',
      'MANDATE-SETUP',
      'FINAL-APPROVAL',
      'CREDIT-EXCEPTION',
      'FRAUD-REVIEW',
      'DOCUMENT-REVIEW',
      'RISK-REVIEW',
      'ELIGIBILITY-REVIEW',
      'FRAUD-CHECK-PENDING',
      'REVIEW',
    ],
    modules: ['AGREEMENT', 'MANDATE', 'REVIEW', 'APPROVAL'],
  },
  {
    id: 'disbursement',
    label: 'Disbursement',
    description: 'Release and confirmation of the loan transfer',
    nodes: [
      'DISBURSEMENT',
      'DISBURSEMENT-REQUEST',
      'DISBURSEMENT-CONFIRMATION',
      'DISBURSEMENT-REVIEW',
      'DISBURSEMENT-FAILED',
    ],
    modules: ['DISBURSEMENT'],
  },
  {
    id: 'decision',
    label: 'Decision',
    description: 'The final application status',
    nodes: ['STATUS', 'APPROVED', 'REJECTED', 'CANCELLED'],
    modules: ['STATUS'],
  },
]);

const STAGE_IDS = new Set(LOAN_STAGES.map((stage) => stage.id));

// A state reported by the backend may be a V6 node, a legacy component key, or
// a node suffix. Only allowlisted values are considered; an unknown value never
// advances the tracker.
const WAITING_NODES = new Set([
  'VERIFICATION-PENDING',
  'FRAUD-CHECK-PENDING',
  'NOT-YOUR-TURN',
]);

const FAILED_NODES = new Set(['REJECTED', 'DISBURSEMENT-FAILED']);
const CANCELLED_NODES = new Set(['CANCELLED']);
const APPROVED_NODES = new Set(['APPROVED']);
const SYSTEM_NODES = new Set([
  'PAN-VERIFICATION',
  'AADHAR-VERIFICATION',
  'FACE-VERIFICATION',
  'TERMINAL-FACEVERIFICATION',
  'BANK-ACCOUNT-VERIFICATION',
  'CREDIT-CHECK',
  'BORROWER-CREDIT-CHECK',
  'CIBIL-CHECK',
  'FRAUD-CHECK',
  'DOCUMENT-VERIFICATION',
  'RISK-ASSESSMENT',
  'ELIGIBILITY-CHECK',
  'AGREEMENT-GENERATION',
  'DISBURSEMENT-REQUEST',
  'DISBURSEMENT-CONFIRMATION',
  'VERIFICATION-PENDING',
  'FRAUD-CHECK-PENDING',
]);

const ATTENTION_STATUSES = new Set([
  'CAPTCHA_REQUIRED',
  'AUTHENTICATION_REQUIRED',
  'RECOVERY_REQUIRED',
  'IDENTITY_REQUIRED',
  'SESSION_EXPIRED',
  'SESSION_INVALID',
]);

const STATE_LABELS = Object.freeze({
  completed: 'Completed',
  available: 'Ready for you',
  current: 'In progress',
  pending: 'Waiting',
  'needs-attention': 'Needs attention',
  failed: 'Failed',
  skipped: 'Skipped',
  locked: 'Not started',
});

const OUTCOME_COPY = Object.freeze({
  approved: {
    tone: 'success',
    statusLabel: 'Approved',
    headline: 'Your loan is approved',
    note: 'The loan service reported the approval. Later steps depend on the lender.',
  },
  rejected: {
    tone: 'danger',
    statusLabel: 'Not approved',
    headline: 'The application was not approved',
    note: 'The loan service reported this decision. Contact the lender for the reason.',
  },
  cancelled: {
    tone: 'neutral',
    statusLabel: 'Cancelled',
    headline: 'The application was cancelled',
    note: 'The loan service reported this application as cancelled.',
  },
  'disbursement-failed': {
    tone: 'danger',
    statusLabel: 'Disbursement failed',
    headline: 'The loan transfer did not complete',
    note: 'The loan service reported a failed disbursement. No money has been moved by this page.',
  },
  waiting: {
    tone: 'warning',
    statusLabel: 'Waiting',
    headline: 'Waiting for the other party',
    note: 'The loan service says another party needs to act before this step can continue.',
  },
  attention: {
    tone: 'warning',
    statusLabel: 'Action needed',
    headline: 'This step needs your attention',
    note: 'The loan service stopped this step at a verification gate. Complete it to continue.',
  },
  processing: {
    tone: 'warning',
    statusLabel: 'In progress',
    headline: 'The loan team is processing this step',
    note: 'The loan service is still working on this step. You do not need to resubmit it.',
  },
  active: {
    tone: 'active',
    statusLabel: 'In progress',
    headline: '',
    note: 'Based on the current step reported by the loan service.',
  },
});

const text = (value) => (typeof value === 'string' ? value.trim().toUpperCase() : '');

export function getProgressActor(actor) {
  const key = text(actor);
  return PROGRESS_ACTOR_LABELS[key] ? key : '';
}

export function findStageIndex({ node = '', module = '' } = {}) {
  const nodeKey = text(node);
  const moduleKey = text(module);

  if (nodeKey) {
    const byNode = LOAN_STAGES.findIndex((stage) => stage.nodes.includes(nodeKey));
    if (byNode >= 0) return byNode;
  }
  if (moduleKey) {
    const byModule = LOAN_STAGES.findIndex((stage) => stage.modules.includes(moduleKey));
    if (byModule >= 0) return byModule;
  }
  return null;
}

function outcomeFor({ node, status, type }) {
  const nodeKey = text(node);
  const statusKey = text(status);

  if (statusKey === 'NOT_YOUR_TURN') return 'waiting';
  if (statusKey === 'INTERNAL') return 'processing';
  if (ATTENTION_STATUSES.has(statusKey)) return 'attention';
  if (APPROVED_NODES.has(nodeKey)) return 'approved';
  if (nodeKey === 'DISBURSEMENT-FAILED') return 'disbursement-failed';
  if (FAILED_NODES.has(nodeKey)) return 'rejected';
  if (CANCELLED_NODES.has(nodeKey)) return 'cancelled';
  if (WAITING_NODES.has(nodeKey)) return 'waiting';
  if (type === 'SYSTEM') return 'processing';
  return 'active';
}

function activeState(outcome, type) {
  if (outcome === 'approved') return 'completed';
  if (outcome === 'rejected' || outcome === 'disbursement-failed') return 'failed';
  if (outcome === 'cancelled') return 'skipped';
  if (outcome === 'waiting') return 'pending';
  if (outcome === 'attention') return 'needs-attention';
  if (type === 'SYSTEM' || outcome === 'processing') return 'current';
  return 'available';
}

/**
 * Project the nine-stage journey from one authoritative workflow answer.
 *
 * @param {object} input
 * @param {string} input.actor   actor from the resolved node metadata
 * @param {string} input.node    resolved node name
 * @param {string} input.module  resolved module
 * @param {string} input.status  backend status (UPPER_SNAKE is accepted)
 * @param {string} input.type    FORM | SYSTEM | TERMINAL
 * @param {string} input.stateId actor-qualified state id
 * @param {string} input.stageId optional direct stage id (used by tests)
 */
export function buildLoanProgress({
  actor,
  node,
  module,
  status,
  type,
  stateId = '',
  stageId = '',
} = {}) {
  const actorKey = getProgressActor(actor);
  if (!actorKey) return null;

  const directStage = STAGE_IDS.has(text(stageId).toLowerCase()) ? text(stageId).toLowerCase() : '';
  const currentIndex = directStage
    ? LOAN_STAGES.findIndex((stage) => stage.id === directStage)
    : findStageIndex({ node, module });
  const outcome = outcomeFor({ node, status, type });
  const copy = OUTCOME_COPY[outcome] || OUTCOME_COPY.active;
  const active = activeState(outcome, text(type));

  const stages = LOAN_STAGES.map((stage, index) => {
    let state = 'locked';
    if (currentIndex === null) {
      state = 'locked';
    } else if (index < currentIndex) {
      state = 'completed';
    } else if (index === currentIndex) {
      state = active;
    } else if (outcome === 'cancelled') {
      state = 'skipped';
    } else if (outcome === 'approved') {
      state = 'completed';
    }

    return {
      id: stage.id,
      label: stage.label,
      description: stage.description,
      state,
      stateLabel: STATE_LABELS[state],
      active: index === currentIndex && state !== 'completed' && state !== 'locked',
    };
  });

  const completedCount = stages.filter((stage) => stage.state === 'completed').length;
  const currentStage = currentIndex === null ? null : LOAN_STAGES[currentIndex];
  const percent = outcome === 'approved'
    ? 100
    : Math.round((completedCount / LOAN_STAGES.length) * 100);

  const headline = copy.headline
    || (currentStage
      ? `Step ${currentIndex + 1} of ${LOAN_STAGES.length}: ${currentStage.label}`
      : 'Current step reported by the service');

  return {
    known: currentIndex !== null,
    actor: actorKey,
    actorLabel: PROGRESS_ACTOR_LABELS[actorKey],
    stateId: text(stateId),
    stages,
    currentIndex,
    currentStageId: currentStage?.id || '',
    currentLabel: currentStage?.label || '',
    total: LOAN_STAGES.length,
    completed: completedCount,
    percent,
    outcome,
    activeState: active,
    needsAttention: stages.some((stage) => stage.state === 'needs-attention'),
    tone: copy.tone,
    statusLabel: copy.statusLabel,
    headline,
    note: currentIndex === null && outcome === 'active'
      ? 'The loan service reported a step that is not part of the standard journey, so the tracker cannot place it.'
      : copy.note,
  };
}
