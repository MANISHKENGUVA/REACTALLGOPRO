export const COMPONENT_ROUTE_MAP = {
  'PERSONAL-INFO-V1': '/loan-flow/personal-info',
  'ADDRESS-INFO-V1': '/loan-flow/address-info',
  'KYC-UPLOAD-V1': '/loan-flow/kyc-upload',
  'FACE-VERIFICATION-V1': '/loan-flow/face-verification',
  'PAN-VERIFICATION-V1': '/loan-flow/pan-verification',
  'AADHAR-VERIFICATION-V1': '/loan-flow/aadhar-verification',
  'EMPLOYMENT-INFO-V1': '/loan-flow/employment-info',
  'SALARY-INFO-V1': '/loan-flow/salary-info',
  'BUSINESS-INFO-V1': '/loan-flow/business-info',
  'BANK-DETAILS-V1': '/loan-flow/bank-details',
  'BANK-STATEMENT-UPLOAD-V1': '/loan-flow/bank-statement-upload',
  'DOCUMENT-UPLOAD-V1': '/loan-flow/document-upload',
  'CREDIT-CHECK-V1': '/loan-flow/credit-check',
  'RISK-ASSESSMENT-V1': '/loan-flow/risk-assessment',
  'FRAUD-CHECK-V1': '/loan-flow/fraud-check',
  'CIBIL-CHECK-V1': '/loan-flow/cibil-check',
  'COBORROWER-KYC-V1': '/loan-flow/coborrower-kyc',
  'GUARANTOR-KYC-V1': '/loan-flow/guarantor-kyc',
  'UNDERWRITER-CHECK-V1': '/loan-flow/underwriter-review',
  'FINAL-APPROVAL-V1': '/loan-flow/manager-approval',
  'LOAN-DISBURSEMENT-V1': '/loan-flow/disbursement',
};

export const resolveWorkflowRoute = (workflowResult) => {
  const componentKey = workflowResult?.componentviewrender?.componentKey;
  const route = COMPONENT_ROUTE_MAP[componentKey] || '/loan-flow/address-info';

  const url = new URL(route, window.location.origin);

  if (workflowResult?.workflowId) {
    url.searchParams.set('WORKFLOW_ID', workflowResult.workflowId);
  }

  if (workflowResult?.workflowActor) {
    url.searchParams.set('WORKFLOW_ACTOR', workflowResult.workflowActor);
  }

  return url.pathname + url.search;
};
