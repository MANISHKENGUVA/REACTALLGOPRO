import { createBrowserRouter, redirect } from 'react-router-dom';
import { WorkflowClient } from './workflow/WorkflowClient';
import { SessionManager } from './workflow/SessionManager';
import { assertActorCanView, getRouteActor, resolveWorkflowRoute, WORKFLOW_ROUTE_PATHS } from './utils/globalRouterNavigator';
import {
  normalizeActor,
  safeWorkflowPath,
  sanitizeSessionId,
  sanitizeWorkflowId,
} from './utils/security';

// Layouts
import LoanFlowLayout from './layouts/LoanFlowLayout';
import NotYourTurnPage from './pages/loanFlow/NotYourTurnPage';
import WorkflowHost from './workflow/components/WorkflowHost';
import WorkflowErrorBoundary from './workflow/components/WorkflowErrorBoundary';

const ALLOWED_REDIRECT_PATHS = new Set([
  ...WORKFLOW_ROUTE_PATHS,
  '/loan-flow/workflow',
  '/loan-flow/not-your-turn',
  '/',
]);

const workflowContextFromUrl = (requestUrl) => {
  const url = new URL(requestUrl);
  const meta = SessionManager.getSessionMeta() || {};
  // A missing URL value is not fatal: the destination page owns the actor and
  // the stored session owns the workflow. An empty result is handled by the
  // caller, which forwards to the hub instead of failing the page.
  const workflowId = sanitizeWorkflowId(url.searchParams.get('WORKFLOW_ID') || meta.workflowId || '');
  const workflowActor = normalizeActor(
    url.searchParams.get('WORKFLOW_ACTOR') || meta.actorId || meta.workflowActor,
  );
  return {
    workflowId,
    workflowActor,
    // The session is kept in sessionStorage, not in the URL (it would leak
    // through history, logs and referrers). The query parameter is only an
    // explicit override, so fall back to the stored session for every page
    // loader after the initial bootstrap.
    sessionId:
      sanitizeSessionId(url.searchParams.get('sessionId')) ||
      SessionManager.getSessionId(url.searchParams),
  };
};

const bootstrapWorkflowRequest = async (request, context) => {
  const result = await WorkflowClient.resolveNode({ ...context, signal: request.signal });
  if (!result) throw new Error('The workflow service returned an empty response.');
  if (!assertActorCanView(result, context.workflowActor)) {
    return { status: 'NOT_YOUR_TURN', ...context };
  }
  return result;
};

const constructRedirectUrl = (viewResult) => {
  const payload = viewResult?.data ?? viewResult;
  const status = String(payload?.status || '').toUpperCase();
  if (status === 'NOT_YOUR_TURN' || status === 'INTERNAL') return '/loan-flow/not-your-turn';
  if (['CAPTCHA_REQUIRED', 'AUTHENTICATION_REQUIRED', 'SESSION_EXPIRED', 'SESSION_INVALID'].includes(status)) {
    return '/loan-flow/workflow';
  }
  const route = resolveWorkflowRoute(payload);
  if (route) return route;
  if (payload?.redirectUrl) {
    const target = safeWorkflowPath(payload.redirectUrl, {
      allowedPaths: ALLOWED_REDIRECT_PATHS,
      allowedParams: ['WORKFLOW_ID', 'WORKFLOW_ACTOR'],
    });
    if (!target) throw new Error('The workflow returned an invalid redirect destination.');
    return target;
  }
  throw new Error('The workflow destination is unknown or has no registered page.');
};

const appendWorkflowParamsToRedirect = (redirectUrl, context) => {
  const target = safeWorkflowPath(redirectUrl, {
    allowedPaths: ALLOWED_REDIRECT_PATHS,
    allowedParams: ['WORKFLOW_ID', 'WORKFLOW_ACTOR'],
  });
  if (!target) throw new Error('The workflow returned an invalid redirect destination.');

  const targetUrl = new URL(target, 'https://app.invalid');
  // The destination page owns its actor. Keeping the actor of the page that
  // requested the redirect would break cross-actor transitions and cause the
  // destination loader to reject the backend state it just resolved.
  const destinationActor = getRouteActor(targetUrl.pathname) || context.workflowActor;
  targetUrl.searchParams.set('WORKFLOW_ID', context.workflowId);
  targetUrl.searchParams.set('WORKFLOW_ACTOR', destinationActor);

  return safeWorkflowPath(`${targetUrl.pathname}${targetUrl.search}`, {
    allowedPaths: ALLOWED_REDIRECT_PATHS,
    allowedParams: ['WORKFLOW_ID', 'WORKFLOW_ACTOR'],
  });
};

// The hub owns session recovery, so it needs the identity the page link carried.
// Dropping it here is what turned a resume into a brand-new application.
const hubRedirect = (context) => {
  const params = new URLSearchParams();
  if (context.workflowId) params.set('WORKFLOW_ID', context.workflowId);
  if (context.workflowActor) params.set('WORKFLOW_ACTOR', context.workflowActor);
  const query = params.toString();
  return redirect(`/loan-flow/workflow${query ? `?${query}` : ''}`);
};

const resolveLoanFlowRequest = async (request) => {
  const context = workflowContextFromUrl(request.url);
  // A deep link must be self-healing. The verified backend answers
  // `401 UNAUTHORIZED "sessionId is required"` when /workflow/resolve is called
  // without a session, and a pasted URL in a fresh tab never has one — the
  // session lives in sessionStorage. Forward to the hub, which bootstraps a
  // session and re-resolves, instead of dead-ending on an error page.
  if (!context.workflowId || !context.workflowActor || !context.sessionId) {
    return hubRedirect(context);
  }

  let viewResult;
  try {
    viewResult = await bootstrapWorkflowRequest(request, context);
  } catch (e) {
    const expired = Number(e?.status) === 401 ||
      e?.payload?.code === 'UNAUTHORIZED' ||
      SessionManager.isSessionInvalidResponse(e?.payload);
    if (expired) {
      // The backend no longer knows this session (idle expiry). Drop it so the
      // hub cannot keep reusing a dead id, then let it start a fresh one.
      SessionManager.clearSession();
      return hubRedirect(context);
    }
    throw e;
  }

  const finalRedirectUrl = appendWorkflowParamsToRedirect(constructRedirectUrl(viewResult), context);
  if (!finalRedirectUrl) throw new Error('The workflow destination is invalid.');
  const target = new URL(finalRedirectUrl, window.location.origin);
  const current = new URL(request.url);
  if (target.pathname !== current.pathname) return redirect(finalRedirectUrl);
  return { workflowData: viewResult };
};

const workflowBootstrapLoader = async ({ request }) => resolveLoanFlowRequest(request);
const loanFlowWorkflowLoader = async ({ request }) => {
  const url = new URL(request.url);
  if (['/loan-flow/workflow', '/loan-flow/navigator', '/loan-flow/navigater', '/loan-flow/not-your-turn'].includes(url.pathname)) return null;
  return resolveLoanFlowRequest(request);
};

// Pages - Loan Flow
import PersonalInfoPage from './pages/loanFlow/PersonalInfoPage';
import AddressInfoPage from './pages/loanFlow/AddressInfoPage';
import KYCUploadPage from './pages/loanFlow/KYCUploadPage';
import FaceVerificationPage from './pages/loanFlow/FaceVerificationPage';
import TerminalFaceVerificationPage from './pages/loanFlow/TerminalFaceVerificationPage';
import VerificationPendingPage from './pages/loanFlow/VerificationPendingPage';
import PANVerificationPage from './pages/loanFlow/PANVerificationPage';
import AadharVerificationPage from './pages/loanFlow/AadharVerificationPage';

const coborrowerPANMetadata = {
  componentViewRenderState: 'COBORROWER-KYC-V1-PAN-VERIFICATION-V1',
  componentKey: 'PAN-VERIFICATION-V1',
  workflowActor: 'COBORROWER',
};
const coborrowerAadharMetadata = {
  componentViewRenderState: 'COBORROWER-KYC-V1-AADHAR-VERIFICATION-V1',
  componentKey: 'AADHAR-VERIFICATION-V1',
  workflowActor: 'COBORROWER',
};
import EmploymentInfoPage from './pages/loanFlow/EmploymentInfoPage';
import SalaryInfoPage from './pages/loanFlow/SalaryInfoPage';
import BusinessInfoPage from './pages/loanFlow/BusinessInfoPage';
import BankDetailsPage from './pages/loanFlow/BankDetailsPage';
import BankAccountVerificationEngine from './pages/loanFlow/BankAccountVerificationEngine';
import BankStatementUploadPage from './pages/loanFlow/BankStatementUploadPage';
import DocumentUploadPage from './pages/loanFlow/DocumentUploadPage';
import LoanConsentPage from './pages/loanFlow/LoanConsentPage';
import BorrowerCreditCheckPage from './pages/loanFlow/BorrowerCreditCheckPage';
import CreditCheckPage from './pages/loanFlow/CreditCheckPage';
import FraudCheckPage from './pages/loanFlow/FraudCheckPage';
import CibilCheckPage from './pages/loanFlow/CibilCheckPage';
import RiskAssessmentPage from './pages/loanFlow/RiskAssessmentPage';
import DocumentVerificationEngine from './pages/loanFlow/DocumentVerificationEngine';
import EligibilityEngine from './pages/loanFlow/EligibilityEngine';
import LoanAmountPage from './pages/loanFlow/LoanAmountPage';
import InterestRateEngine from './pages/loanFlow/InterestRateEngine';
import LoanOfferPage from './pages/loanFlow/LoanOfferPage';
import AgreementGenerationEngine from './pages/loanFlow/AgreementGenerationEngine';
import ESignPage from './pages/loanFlow/ESignPage';
import MandateSetupPage from './pages/loanFlow/MandateSetupPage';
import UnderwriterReviewPage from './pages/loanFlow/UnderwriterReviewPage';
import ManagerApprovalPage from './pages/loanFlow/ManagerApprovalPage';
import ManagerFraudReviewPage from './pages/loanFlow/ManagerFraudReviewPage';
import ManagerCreditExceptionPage from './pages/loanFlow/ManagerCreditExceptionPage';
import ManagerDocumentReviewPage from './pages/loanFlow/ManagerDocumentReviewPage';
import ManagerEligibilityReviewPage from './pages/loanFlow/ManagerEligibilityReviewPage';
import ManagerRiskReviewPage from './pages/loanFlow/ManagerRiskReviewPage';
import FraudCheckPendingPage from './pages/loanFlow/FraudCheckPendingPage';
import ManagerDisbursementReviewPage from './pages/loanFlow/ManagerDisbursementReviewPage';
import DisbursementPage from './pages/loanFlow/DisbursementPage';
import DisbursementRequestEngine from './pages/loanFlow/DisbursementRequestEngine';
import DisbursementConfirmationEngine from './pages/loanFlow/DisbursementConfirmationEngine';
import DisbursementFailedPage from './pages/loanFlow/DisbursementFailedPage';
import ApplicationApprovedPage from './pages/loanFlow/ApplicationApprovedPage';
import ApplicationRejectedPage from './pages/loanFlow/ApplicationRejectedPage';
import ApplicationCancelledPage from './pages/loanFlow/ApplicationCancelledPage';

import CoBorrowerKYCPage from './pages/loanFlow/CoBorrowerKYCPage';
import CoborrowerPersonalInfoPage from './pages/loanFlow/CoborrowerPersonalInfoPage';
import CoborrowerAddressInfoPage from './pages/loanFlow/CoborrowerAddressInfoPage';
import CoborrowerKYCUploadPage from './pages/loanFlow/CoborrowerKYCUploadPage';
import CoborrowerFaceVerificationEngine from './pages/loanFlow/CoborrowerFaceVerificationEngine';
import CoborrowerEmploymentInfoPage from './pages/loanFlow/CoborrowerEmploymentInfoPage';
import CoborrowerSalaryInfoPage from './pages/loanFlow/CoborrowerSalaryInfoPage';
import CoborrowerBusinessInfoPage from './pages/loanFlow/CoborrowerBusinessInfoPage';
import CoborrowerBankDetailsPage from './pages/loanFlow/CoborrowerBankDetailsPage';
import CoborrowerRejectedPage from './pages/loanFlow/CoborrowerRejectedPage';
import GuarantorKYCPage from './pages/loanFlow/GuarantorKYCPage';
import HomePage from './pages/HomePage';
import AllComponentsPlaygroundPage from './pages/AllComponentsPlaygroundPage';
import WorkflowBuilderPage from './pages/WorkflowBuilderPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <WorkflowErrorBoundary />,
  },
  {
    path: '/display-all-components-with-all-possible-props-and-combinations',
    element: import.meta.env.DEV ? <AllComponentsPlaygroundPage /> : <WorkflowErrorBoundary />,
  },
  {
    path: '/workflow-builder',
    element: <WorkflowBuilderPage />,
    errorElement: <WorkflowErrorBoundary />,
  },
  {
    path: '/workflow',
    element: <WorkflowHost />,
    errorElement: <WorkflowErrorBoundary />,
  },
  {
    path: '/workflow-navigator',
    loader: workflowBootstrapLoader,
    errorElement: <WorkflowErrorBoundary />,
  },
  {
    path: '/loan-flow',
    element: <LoanFlowLayout />,
    errorElement: <WorkflowErrorBoundary />,
    loader: loanFlowWorkflowLoader,
    shouldRevalidate: () => true,
    children: [
      // Session-aware entry: backend resolves current node (PUBLIC/CAPTCHA/ACTOR/INTERNAL).
      { path: 'workflow', element: <WorkflowHost /> },
      { path: 'navigator', element: <WorkflowHost /> },
      { path: 'navigater', element: <WorkflowHost /> },
      // Borrower Nodes
      { path: 'personal-info', element: <PersonalInfoPage /> },
      { path: 'address-info', element: <AddressInfoPage /> },
      { path: 'kyc-upload', element: <KYCUploadPage /> },
      { path: 'face-verification', element: <FaceVerificationPage /> },
      { path: 'terminal-face-verification', element: <TerminalFaceVerificationPage /> },
      { path: 'verification-pending', element: <VerificationPendingPage /> },
      { path: 'pan-verification', element: <PANVerificationPage /> },
      { path: 'aadhar-verification', element: <AadharVerificationPage /> },
      { path: 'employment-info', element: <EmploymentInfoPage /> },
      { path: 'salary-info', element: <SalaryInfoPage /> },
      { path: 'business-info', element: <BusinessInfoPage /> },
      { path: 'bank-details', element: <BankDetailsPage /> },
      { path: 'bank-account-verification', element: <BankAccountVerificationEngine /> },
      { path: 'bank-statement-upload', element: <BankStatementUploadPage /> },
      { path: 'document-upload', element: <DocumentUploadPage /> },
      { path: 'loan-consent', element: <LoanConsentPage /> },
      { path: 'borrower-credit-check', element: <BorrowerCreditCheckPage /> },

      // Status Nodes
      { path: 'approved', element: <ApplicationApprovedPage /> },
      { path: 'rejected', element: <ApplicationRejectedPage /> },
      { path: 'cancelled', element: <ApplicationCancelledPage /> },

      // Co-Borrower Nodes
      { path: 'coborrower-kyc', element: <CoBorrowerKYCPage /> },
      { path: 'coborrower-personal-info', element: <CoborrowerPersonalInfoPage /> },
      { path: 'coborrower-address-info', element: <CoborrowerAddressInfoPage /> },
      { path: 'coborrower-kyc-upload', element: <CoborrowerKYCUploadPage /> },
      { path: 'coborrower-pan-verification', element: <PANVerificationPage metadata={coborrowerPANMetadata} /> },
      { path: 'coborrower-aadhar-verification', element: <AadharVerificationPage metadata={coborrowerAadharMetadata} /> },
      { path: 'coborrower-face-verification', element: <CoborrowerFaceVerificationEngine /> },
      { path: 'coborrower-employment-info', element: <CoborrowerEmploymentInfoPage /> },
      { path: 'coborrower-salary-info', element: <CoborrowerSalaryInfoPage /> },
      { path: 'coborrower-business-info', element: <CoborrowerBusinessInfoPage /> },
      { path: 'coborrower-bank-details', element: <CoborrowerBankDetailsPage /> },
      { path: 'coborrower-rejected', element: <CoborrowerRejectedPage /> },
      { path: 'guarantor-kyc', element: <GuarantorKYCPage /> },

      // Lender & Risk Nodes
      { path: 'not-your-turn', element: <NotYourTurnPage /> },
      { path: 'credit-check', element: <CreditCheckPage /> },
      { path: 'fraud-check', element: <FraudCheckPage /> },
      { path: 'cibil-check', element: <CibilCheckPage /> },
      { path: 'document-verification', element: <DocumentVerificationEngine /> },
      { path: 'risk-assessment', element: <RiskAssessmentPage /> },
      { path: 'eligibility-check', element: <EligibilityEngine /> },
      { path: 'loan-amount', element: <LoanAmountPage /> },
      { path: 'interest-rate', element: <InterestRateEngine /> },
      { path: 'loan-offer', element: <LoanOfferPage /> },
      { path: 'agreement-generation', element: <AgreementGenerationEngine /> },
      { path: 'esign', element: <ESignPage /> },
      { path: 'mandate-setup', element: <MandateSetupPage /> },
      { path: 'disbursement', element: <DisbursementPage /> },
      { path: 'disbursement-request', element: <DisbursementRequestEngine /> },
      { path: 'disbursement-confirmation', element: <DisbursementConfirmationEngine /> },
      { path: 'disbursement-failed', element: <DisbursementFailedPage /> },

      // Manager Review Nodes
      { path: 'underwriter-review', element: <UnderwriterReviewPage /> },
      { path: 'manager-approval', element: <ManagerApprovalPage /> },
      { path: 'manager-fraud-review', element: <ManagerFraudReviewPage /> },
      { path: 'manager-credit-exception', element: <ManagerCreditExceptionPage /> },
      { path: 'manager-document-review', element: <ManagerDocumentReviewPage /> },
      { path: 'manager-eligibility-review', element: <ManagerEligibilityReviewPage /> },
      { path: 'manager-risk-review', element: <ManagerRiskReviewPage /> },
      { path: 'fraud-check-pending', element: <FraudCheckPendingPage /> },
      { path: 'manager-disbursement-review', element: <ManagerDisbursementReviewPage /> },
    ],
  },
  {
    path: '*',
    element: <WorkflowErrorBoundary />,
  },
]);

export default router;
