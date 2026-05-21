/**
 * LOAN-FLOW-V5 Workflow Router
 * Manages state transitions and component routing for loan application workflow
 * 
 * Workflow ID: LOAN-FLOW-V5
 * Start State: BORROWER-DETAILS-V1-PERSONAL-INFO-V1
 */

// ============================================================================
// STATE DEFINITIONS
// ============================================================================

const WORKFLOW_STATES = {
  // BORROWER DETAILS MODULE
  PERSONAL_INFO: {
    id: "BORROWER-DETAILS-V1-PERSONAL-INFO-V1",
    type: "FORM",
    component: "PersonalInfoPage",
    actor: "BORROWER",
    module: "DETAILS",
    stage: "PERSONAL-INFO",
    order: 1,
    description: "Collects basic personal and identity details",
    nextStateOnSuccess: "BORROWER-ADDRESS-V1-ADDRESS-INFO-V1",
    nextStateOnFailure: null,
    successCondition: "PERSONALDETAILS.basicInfoCompleted",
    fields: [
      "fullName",
      "fathersName",
      "mothersName",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "emailId",
      "mobileNumber",
      "panNumber",
      "aadhaarNumber",
      "employmentType",
      "monthlyIncome",
      "loanPurpose",
    ],
  },

  // ADDRESS MODULE
  ADDRESS_INFO: {
    id: "BORROWER-ADDRESS-V1-ADDRESS-INFO-V1",
    type: "FORM",
    component: "AddressInfoPage",
    actor: "BORROWER",
    module: "ADDRESS",
    stage: "ADDRESS-INFO",
    order: 2,
    description: "Captures current and permanent address for KYC",
    previousState: "BORROWER-DETAILS-V1-PERSONAL-INFO-V1",
    nextStateOnSuccess: "BORROWER-KYC-V1-KYC-UPLOAD-V1",
    nextStateOnFailure: "BORROWER-ADDRESS-V1-ADDRESS-INFO-V1",
    successCondition: "Address verified && Pincode valid",
    fields: ["flatNo", "building", "street", "landmark", "city", "district", "state", "pincode", "residenceType", "permanentAddressSameAsCurrent"],
  },

  // KYC MODULE - DOCUMENT UPLOAD
  KYC_UPLOAD: {
    id: "BORROWER-KYC-V1-KYC-UPLOAD-V1",
    type: "FORM",
    component: "KYCUploadPage",
    actor: "BORROWER",
    module: "KYC",
    stage: "KYC-UPLOAD",
    order: 3,
    description: "Borrower uploads identity documents",
    previousState: "BORROWER-ADDRESS-V1-ADDRESS-INFO-V1",
    nextStateOnSuccess: "BORROWER-KYC-V1-FACE-VERIFICATION-V1",
    nextStateOnFailure: "BORROWER-KYC-V1-KYC-UPLOAD-V1",
    successCondition: "Both Aadhaar and PAN documents uploaded",
    documents: ["aadhaarCardFront", "aadhaarCardBack", "panCardFront"],
  },

  // KYC MODULE - FACE VERIFICATION
  FACE_VERIFICATION: {
    id: "BORROWER-KYC-V1-FACE-VERIFICATION-V1",
    type: "SYSTEM",
    component: "FaceVerificationEngine",
    actor: "BORROWER",
    module: "KYC",
    stage: "FACE-VERIFICATION",
    order: 4,
    description: "Performs liveness check and face matching with documents",
    previousState: "BORROWER-KYC-V1-KYC-UPLOAD-V1",
    nextStateOnSuccess: "BORROWER-KYC-V1-PAN-VERIFICATION-V1",
    nextStateOnFailure: "MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1",
    successCondition: "Match Score >= 80 && Liveness Passed",
    checks: ["livenessCheck", "faceMatching", "matchScore"],
  },

  // KYC MODULE - PAN VERIFICATION
  PAN_VERIFICATION: {
    id: "BORROWER-KYC-V1-PAN-VERIFICATION-V1",
    type: "SYSTEM",
    component: "PANVerificationEngine",
    actor: "BORROWER",
    module: "KYC",
    stage: "PAN-VERIFICATION",
    order: 5,
    description: "Automated PAN verification",
    previousState: "BORROWER-KYC-V1-FACE-VERIFICATION-V1",
    nextStateOnSuccess: "BORROWER-KYC-V1-AADHAR-VERIFICATION-V1",
    nextStateOnFailure: null,
    successCondition: "PAN active && Name match && Not blacklisted",
    checks: ["panActive", "nameMatch", "blacklistCheck"],
  },

  // KYC MODULE - AADHAAR VERIFICATION
  AADHAAR_VERIFICATION: {
    id: "BORROWER-KYC-V1-AADHAR-VERIFICATION-V1",
    type: "SYSTEM",
    component: "AadharVerificationEngine",
    actor: "BORROWER",
    module: "KYC",
    stage: "AADHAR-VERIFICATION",
    order: 6,
    description: "Verify Aadhaar and mobile linkage",
    previousState: "BORROWER-KYC-V1-PAN-VERIFICATION-V1",
    nextStateOnSuccess: "BORROWER-EMPLOYMENT-V1-EMPLOYMENT-INFO-V1",
    nextStateOnFailure: null,
    successCondition: "Aadhaar valid && Mobile linked",
    checks: ["aadhaarValid", "mobileLinkage"],
  },

  // EMPLOYMENT MODULE
  EMPLOYMENT_INFO: {
    id: "BORROWER-EMPLOYMENT-V1-EMPLOYMENT-INFO-V1",
    type: "FORM",
    component: "EmploymentInfoPage",
    actor: "BORROWER",
    module: "EMPLOYMENT",
    stage: "EMPLOYMENT-INFO",
    order: 7,
    description: "Collect employment or business details",
    previousState: "BORROWER-KYC-V1-AADHAR-VERIFICATION-V1",
    nextStates: {
      "Salaried": "BORROWER-SALARY-V1-SALARY-INFO-V1",
      "Business Owner": "BORROWER-BUSINESS-V1-BUSINESS-INFO-V1",
      "Unemployed": null,
    },
    successCondition: "Employment type selected",
    fields: ["employmentType", "companyName", "designation", "yearsOfExperience"],
  },

  // SALARY MODULE (for Salaried)
  SALARY_INFO: {
    id: "BORROWER-SALARY-V1-SALARY-INFO-V1",
    type: "FORM",
    component: "SalaryInfoPage",
    actor: "BORROWER",
    module: "SALARY",
    stage: "SALARY-INFO",
    order: 8,
    description: "Collect salary details for salaried applicants",
    previousState: "BORROWER-EMPLOYMENT-V1-EMPLOYMENT-INFO-V1",
    nextStateOnSuccess: "BORROWER-BANK-V1-BANK-DETAILS-V1",
    nextStateOnAlternate: "COBORROWER-KYC-V1-KYC-UPLOAD-V1", // Low income path
    successCondition: "Monthly Income >= 50000",
    fields: ["monthlyIncome", "payslips", "companyInfo", "bankAccountDetails"],
  },

  // BUSINESS MODULE (for Self-Employed)
  BUSINESS_INFO: {
    id: "BORROWER-BUSINESS-V1-BUSINESS-INFO-V1",
    type: "FORM",
    component: "BusinessInfoPage",
    actor: "BORROWER",
    module: "BUSINESS",
    stage: "BUSINESS-INFO",
    order: 9,
    description: "Collect business details for self-employed",
    previousState: "BORROWER-EMPLOYMENT-V1-EMPLOYMENT-INFO-V1",
    nextStateOnSuccess: "BORROWER-BANK-V1-BANK-DETAILS-V1",
    nextStateOnFailure: null,
    successCondition: "Revenue criteria met",
    fields: ["businessName", "annualRevenue", "gstNumber", "itrDocuments", "businessType"],
  },

  // BANK MODULE - BANK DETAILS
  BANK_DETAILS: {
    id: "BORROWER-BANK-V1-BANK-DETAILS-V1",
    type: "FORM",
    component: "BankDetailsPage",
    actor: "BORROWER",
    module: "BANK",
    stage: "BANK-DETAILS",
    order: 10,
    description: "Collect bank account for disbursement and repayment",
    previousState: ["BORROWER-SALARY-V1-SALARY-INFO-V1", "BORROWER-BUSINESS-V1-BUSINESS-INFO-V1"],
    nextStateOnSuccess: "BORROWER-BANK-V1-BANK-STATEMENT-UPLOAD-V1",
    nextStateOnFailure: "BORROWER-BANK-V1-BANK-DETAILS-V1",
    successCondition: "Valid bank account",
    fields: ["accountNumber", "ifscCode", "bankName", "cancelledCheque", "accountHolder"],
  },

  // BANK MODULE - STATEMENT UPLOAD
  BANK_STATEMENT_UPLOAD: {
    id: "BORROWER-BANK-V1-BANK-STATEMENT-UPLOAD-V1",
    type: "FORM",
    component: "BankStatementUploadPage",
    actor: "BORROWER",
    module: "BANK",
    stage: "BANK-STATEMENT-UPLOAD",
    order: 11,
    description: "Upload bank statements for income analysis",
    previousState: "BORROWER-BANK-V1-BANK-DETAILS-V1",
    nextStateOnSuccess: "BORROWER-DOCUMENTS-V1-DOCUMENT-UPLOAD-V1",
    nextStateOnFailure: "BORROWER-BANK-V1-BANK-STATEMENT-UPLOAD-V1",
    successCondition: "Valid bank statements uploaded",
    fields: ["bankStatements", "statementPeriod"],
  },

  // DOCUMENTS MODULE
  DOCUMENT_UPLOAD: {
    id: "BORROWER-DOCUMENTS-V1-DOCUMENT-UPLOAD-V1",
    type: "FORM",
    component: "AdditionalDocumentUploadPage",
    actor: "BORROWER",
    module: "DOCUMENTS",
    stage: "DOCUMENT-UPLOAD",
    order: 12,
    description: "Upload supporting documents (ITR, Form-16, etc.)",
    previousState: "BORROWER-BANK-V1-BANK-STATEMENT-UPLOAD-V1",
    nextStateOnSuccess: "BORROWER-CREDIT-V1-CREDIT-CHECK-V1",
    nextStateOnFailure: "BORROWER-DOCUMENTS-V1-DOCUMENT-UPLOAD-V1",
    successCondition: "Required documents uploaded",
    fields: ["itrDocuments", "form16", "otherDocuments"],
  },

  // CREDIT MODULE
  CREDIT_CHECK: {
    id: "BORROWER-CREDIT-V1-CREDIT-CHECK-V1",
    type: "SYSTEM",
    component: "CreditCheckEngine",
    actor: "SYSTEM",
    module: "CREDIT",
    stage: "CREDIT-CHECK",
    order: 13,
    description: "Automated credit history and score check",
    previousState: "BORROWER-DOCUMENTS-V1-DOCUMENT-UPLOAD-V1",
    nextStateOnSuccess: "BORROWER-RISK-V1-RISK-ASSESSMENT-V1",
    nextStateOnFailure: "MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1",
    successCondition: "Credit score >= threshold",
    checks: ["creditScore", "creditHistory", "paymentDefaults"],
  },

  // RISK MODULE
  RISK_ASSESSMENT: {
    id: "BORROWER-RISK-V1-RISK-ASSESSMENT-V1",
    type: "SYSTEM",
    component: "RiskAssessmentEngine",
    actor: "SYSTEM",
    module: "RISK",
    stage: "RISK-ASSESSMENT",
    order: 14,
    description: "Overall risk scoring of the application",
    previousState: "BORROWER-CREDIT-V1-CREDIT-CHECK-V1",
    nextStateOnSuccess: "RISKENGINE-FRAUD-V1-FRAUD-CHECK-V1",
    nextStateOnFailure: "MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1",
    successCondition: "Risk score acceptable",
    checks: ["riskScore", "applicationProfile"],
  },

  // FRAUD CHECK
  FRAUD_CHECK: {
    id: "RISKENGINE-FRAUD-V1-FRAUD-CHECK-V1",
    type: "SYSTEM",
    component: "FraudCheckEngine",
    actor: "SYSTEM",
    module: "RISKENGINE",
    stage: "FRAUD-CHECK",
    order: 15,
    description: "Detect potential fraud in the application",
    previousState: "BORROWER-RISK-V1-RISK-ASSESSMENT-V1",
    nextStateOnSuccess: "RISKENGINE-CIBIL-V1-CIBIL-CHECK-V1",
    nextStateOnFailure: null,
    successCondition: "No fraud detected",
    checks: ["fraudIndicators", "documentVerification", "inconsistencyCheck"],
  },

  // CIBIL CHECK
  CIBIL_CHECK: {
    id: "RISKENGINE-CIBIL-V1-CIBIL-CHECK-V1",
    type: "SYSTEM",
    component: "CibilCheckEngine",
    actor: "SYSTEM",
    module: "RISKENGINE",
    stage: "CIBIL-CHECK",
    order: 16,
    description: "Fetch and analyze CIBIL score",
    previousState: "RISKENGINE-FRAUD-V1-FRAUD-CHECK-V1",
    nextStateOnSuccess: "COBORROWER-KYC-V1-KYC-UPLOAD-V1",
    nextStateOnFailure: "MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1",
    successCondition: "CIBIL score acceptable",
    checks: ["cibilScore", "loanDefaults", "creditRepaymentHistory"],
  },

  // CO-BORROWER KYC
  COBORROWER_KYC: {
    id: "COBORROWER-KYC-V1-KYC-UPLOAD-V1",
    type: "FORM",
    component: "CoBorrowerKYCUploadPage",
    actor: "COBORROWER",
    module: "KYC",
    stage: "KYC-UPLOAD",
    order: 17,
    description: "Co-borrower uploads their KYC documents",
    previousState: ["BORROWER-SALARY-V1-SALARY-INFO-V1", "RISKENGINE-CIBIL-V1-CIBIL-CHECK-V1"],
    nextStateOnSuccess: "GUARANTOR-KYC-V1-KYC-UPLOAD-V1",
    nextStateOnFailure: "GUARANTOR-KYC-V1-KYC-UPLOAD-V1",
    successCondition: "Co-borrower documents uploaded",
    documents: ["aadhaarCardFront", "aadhaarCardBack", "panCardFront"],
    optional: true,
  },

  // GUARANTOR KYC
  GUARANTOR_KYC: {
    id: "GUARANTOR-KYC-V1-KYC-UPLOAD-V1",
    type: "FORM",
    component: "GuarantorKYCUploadPage",
    actor: "GUARANTOR",
    module: "KYC",
    stage: "KYC-UPLOAD",
    order: 18,
    description: "Guarantor uploads their KYC documents",
    previousState: "COBORROWER-KYC-V1-KYC-UPLOAD-V1",
    nextStateOnSuccess: "UNDERWRITER-REVIEW-V1-UNDERWRITER-CHECK-V1",
    nextStateOnFailure: "UNDERWRITER-REVIEW-V1-UNDERWRITER-CHECK-V1",
    successCondition: "Guarantor documents uploaded",
    documents: ["aadhaarCardFront", "aadhaarCardBack", "panCardFront"],
    optional: true,
  },

  // UNDERWRITER REVIEW
  UNDERWRITER_REVIEW: {
    id: "UNDERWRITER-REVIEW-V1-UNDERWRITER-CHECK-V1",
    type: "MANUAL",
    component: "UnderwriterReviewPage",
    actor: "UNDERWRITER",
    module: "UNDERWRITER",
    stage: "UNDERWRITER-CHECK",
    order: 19,
    description: "Manual review by underwriter team",
    previousState: "GUARANTOR-KYC-V1-KYC-UPLOAD-V1",
    nextStateOnApprove: "MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1",
    nextStateOnReject: null,
    nextStateOnPending: "UNDERWRITER-REVIEW-V1-UNDERWRITER-CHECK-V1",
    successCondition: "Underwriter approval received",
    reviewCriteria: ["documentVerification", "creditAnalysis", "riskAssessment", "completeInformation"],
  },

  // MANAGER FINAL APPROVAL
  MANAGER_APPROVAL: {
    id: "MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1",
    type: "MANUAL",
    component: "ManagerFinalApprovalPage",
    actor: "MANAGER",
    module: "MANAGER",
    stage: "FINAL-APPROVAL",
    order: 20,
    description: "Final approval by sanctioning manager",
    previousState: ["BORROWER-KYC-V1-FACE-VERIFICATION-V1", "BORROWER-CREDIT-V1-CREDIT-CHECK-V1", "BORROWER-RISK-V1-RISK-ASSESSMENT-V1", "RISKENGINE-CIBIL-V1-CIBIL-CHECK-V1", "UNDERWRITER-REVIEW-V1-UNDERWRITER-CHECK-V1"],
    nextStateOnApprove: "DISBURSEMENT-PAYMENT-V1-LOAN-DISBURSEMENT-V1",
    nextStateOnReject: null,
    nextStateOnModify: "UNDERWRITER-REVIEW-V1-UNDERWRITER-CHECK-V1",
    successCondition: "Manager approved",
    approvalCriteria: ["allDocumentsVerified", "creditWorthiness", "loanAmount", "tenor"],
  },

  // DISBURSEMENT
  LOAN_DISBURSEMENT: {
    id: "DISBURSEMENT-PAYMENT-V1-LOAN-DISBURSEMENT-V1",
    type: "SYSTEM",
    component: "LoanDisbursementEngine",
    actor: "SYSTEM",
    module: "DISBURSEMENT",
    stage: "LOAN-DISBURSEMENT",
    order: 21,
    description: "Final step - Disburse loan amount to borrower's bank account",
    previousState: "MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1",
    nextStateOnSuccess: null,
    nextStateOnFailure: "MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1",
    successCondition: "Amount disbursed successfully",
    checks: ["accountVerification", "amountValidation", "bankTransfer"],
  },
};

// ============================================================================
// STATE MAPPINGS & LOOKUP TABLES
// ============================================================================

const STATE_ID_MAP = Object.values(WORKFLOW_STATES).reduce((acc, state) => {
  acc[state.id] = state;
  return acc;
}, {});

const STATE_BY_ORDER = Object.values(WORKFLOW_STATES).sort((a, b) => a.order - b.order);

const MODULE_STATES = Object.values(WORKFLOW_STATES).reduce((acc, state) => {
  if (!acc[state.module]) acc[state.module] = [];
  acc[state.module].push(state);
  return acc;
}, {});

const ACTOR_STATES = Object.values(WORKFLOW_STATES).reduce((acc, state) => {
  if (!acc[state.actor]) acc[state.actor] = [];
  acc[state.actor].push(state);
  return acc;
}, {});

// ============================================================================
// ROUTER CLASS
// ============================================================================

class LoanFlowRouter {
  constructor() {
    this.currentState = null;
    this.previousStates = [];
    this.workflowHistory = [];
    this.applicationData = {};
  }

  /**
   * Initialize workflow at start state
   */
  initializeWorkflow() {
    this.currentState = WORKFLOW_STATES.PERSONAL_INFO;
    this.workflowHistory.push({
      state: this.currentState.id,
      timestamp: new Date(),
      action: "WORKFLOW_INITIALIZED",
    });
    return this.currentState;
  }

  /**
   * Get current state details
   */
  getCurrentState() {
    return this.currentState;
  }

  /**
   * Get state by ID
   */
  getStateById(stateId) {
    return STATE_ID_MAP[stateId];
  }

  /**
   * Get next state based on outcome
   */
  getNextState(outcome = "success") {
    if (!this.currentState) return null;

    let nextStateId = null;

    switch (outcome) {
      case "success":
        nextStateId = this.currentState.nextStateOnSuccess;
        break;
      case "failure":
        nextStateId = this.currentState.nextStateOnFailure;
        break;
      case "alternate":
        nextStateId = this.currentState.nextStateOnAlternate;
        break;
      case "approve":
        nextStateId = this.currentState.nextStateOnApprove;
        break;
      case "reject":
        nextStateId = this.currentState.nextStateOnReject;
        break;
      case "modify":
        nextStateId = this.currentState.nextStateOnModify;
        break;
      case "pending":
        nextStateId = this.currentState.nextStateOnPending;
        break;
      default:
        nextStateId = this.currentState.nextStateOnSuccess;
    }

    return nextStateId ? STATE_ID_MAP[nextStateId] : null;
  }

  /**
   * Get next states for conditional logic (employment type, etc.)
   */
  getConditionalNextStates() {
    if (!this.currentState.nextStates) return null;
    return this.currentState.nextStates;
  }

  /**
   * Transition to next state
   */
  transitionToState(stateId, data = {}) {
    const nextState = STATE_ID_MAP[stateId];

    if (!nextState) {
      console.error(`Invalid state transition: ${stateId}`);
      return false;
    }

    // Store previous state
    if (this.currentState) {
      this.previousStates.push(this.currentState);
    }

    // Update application data
    this.applicationData = { ...this.applicationData, ...data };

    // Update current state
    this.currentState = nextState;

    // Add to history
    this.workflowHistory.push({
      state: nextState.id,
      timestamp: new Date(),
      action: "STATE_TRANSITION",
      data: data,
    });

    return true;
  }

  /**
   * Move to next state based on outcome
   */
  moveToNextState(outcome = "success", data = {}) {
    const nextState = this.getNextState(outcome);

    if (!nextState) {
      console.warn(`No next state for outcome: ${outcome}`);
      return false;
    }

    return this.transitionToState(nextState.id, data);
  }

  /**
   * Get workflow progress
   */
  getWorkflowProgress() {
    const totalStates = STATE_BY_ORDER.length;
    const currentOrder = this.currentState?.order || 0;
    const progress = (currentOrder / totalStates) * 100;

    return {
      current: currentOrder,
      total: totalStates,
      percentage: Math.round(progress),
      currentState: this.currentState?.id,
      currentStage: `${this.currentState?.module} - ${this.currentState?.stage}`,
    };
  }

  /**
   * Get all states for a specific module
   */
  getModuleStates(moduleName) {
    return MODULE_STATES[moduleName] || [];
  }

  /**
   * Get all states for a specific actor
   */
  getActorStates(actor) {
    return ACTOR_STATES[actor] || [];
  }

  /**
   * Get workflow history
   */
  getWorkflowHistory() {
    return this.workflowHistory;
  }

  /**
   * Get all states ordered by sequence
   */
  getAllStatesByOrder() {
    return STATE_BY_ORDER;
  }

  /**
   * Get state component to render
   */
  getComponentToRender() {
    if (!this.currentState) return null;
    return this.currentState.component;
  }

  /**
   * Validate if state transition is allowed
   */
  canTransitionTo(stateId) {
    const targetState = STATE_ID_MAP[stateId];

    if (!targetState) return false;

    // Check if targetState is a valid next state
    const conditionalNextStates = this.getConditionalNextStates();

    if (conditionalNextStates) {
      return Object.values(conditionalNextStates).includes(stateId);
    }

    const nextState = this.getNextState();
    return nextState?.id === stateId;
  }

  /**
   * Get application data
   */
  getApplicationData() {
    return this.applicationData;
  }

  /**
   * Update application data
   */
  updateApplicationData(data) {
    this.applicationData = { ...this.applicationData, ...data };
  }

  /**
   * Reset workflow to start
   */
  resetWorkflow() {
    this.currentState = null;
    this.previousStates = [];
    this.workflowHistory = [];
    this.applicationData = {};
    return this.initializeWorkflow();
  }

  /**
   * Go back to previous state
   */
  goToPreviousState() {
    if (this.previousStates.length === 0) return false;

    const previousState = this.previousStates.pop();
    this.currentState = previousState;

    this.workflowHistory.push({
      state: previousState.id,
      timestamp: new Date(),
      action: "GOBACK",
    });

    return true;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  LoanFlowRouter,
  WORKFLOW_STATES,
  STATE_ID_MAP,
  STATE_BY_ORDER,
  MODULE_STATES,
  ACTOR_STATES,
};

export default LoanFlowRouter;
