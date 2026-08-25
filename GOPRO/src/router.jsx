import { createBrowserRouter, redirect } from 'react-router-dom';

// Layouts
import LoanFlowLayout from './layouts/LoanFlowLayout';

const bootstrapCache = new Map();

const bootstrapWorkflowRequest = async (requestUrl) => {
  const url = new URL(requestUrl);
  const workflowId = url.searchParams.get('WORKFLOW_ID');
  const workflowActor = url.searchParams.get('WORKFLOW_ACTOR');

  console.info('[workflow-bootstrap] request incoming', {
    requestUrl,
    workflowId,
    workflowActor,
  });

  if (!workflowId || !workflowActor) {
    console.warn('[workflow-bootstrap] missing workflow params', {
      workflowId,
      workflowActor,
    });
    return null;
  }

  const cacheKey = `${workflowId}:${workflowActor}`;
  const now = Date.now();
  if (bootstrapCache.has(cacheKey)) {
    const entry = bootstrapCache.get(cacheKey);
    if (now - entry.timestamp < 3000) {
      console.info('[workflow-bootstrap] returning cached response for', cacheKey);
      return entry.data;
    }
  }

  const endpoint = import.meta.env.VITE_WORKFLOW_BOOTSTRAP_URL || 'http://localhost:3000/api/workflow-navigator';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        WORKFLOW_ID: workflowId,
        WORKFLOW_ACTOR: workflowActor,
      }),
    });

    const payload = await response.json().catch(() => null);

    console.info('[workflow-bootstrap] response received', {
      status: response.status,
      ok: response.ok,
      payload,
    });

    if (!response.ok) {
      throw new Error(payload?.message || `Workflow bootstrap failed with status ${response.status}`);
    }

    console.info('[workflow-bootstrap] success', payload);
    if (payload) {
      bootstrapCache.set(cacheKey, { timestamp: now, data: payload });
    }
    return payload;
  } catch (error) {
    console.error('[workflow-bootstrap] failed', error);
    return null;
  }
};

import { COMPONENT_ROUTE_MAP } from './utils/globalRouterNavigator';

const resolveRouteFromComponentView = (componentView) => {
  if (!componentView) {
    return null;
  }

  const componentKey = componentView.componentKey || componentView.componentviewrender?.componentKey;
  const componentName = componentView.component || componentView.componentviewrender?.component;
  const moduleName = componentView.module || componentView.componentviewrender?.module;
  const componentState = componentView.componentviewrenderState || componentView.componentState;

  const keyToMatch = String(componentKey || '').toUpperCase();
  const componentToMatch = String(componentName || '').toUpperCase();
  const moduleToMatch = String(moduleName || '').toUpperCase();
  const stateToMatch = String(componentState || '').toUpperCase();
  const stateSuffix = stateToMatch.split('-').slice(-2).join('-');
  const stateLastPart = stateToMatch.split('-').slice(-1)[0];

  return (
    COMPONENT_ROUTE_MAP[keyToMatch] ||
    COMPONENT_ROUTE_MAP[stateToMatch] ||
    COMPONENT_ROUTE_MAP[moduleToMatch] ||
    COMPONENT_ROUTE_MAP[componentToMatch] ||
    COMPONENT_ROUTE_MAP[stateSuffix] ||
    COMPONENT_ROUTE_MAP[stateLastPart] ||
    null
  );
};

const constructRedirectUrl = (viewResult) => {
  const payload = viewResult?.data ?? viewResult;

  if (!payload) {
    console.warn('[workflow-bootstrap] no payload available for redirect resolution');
    return null;
  }

  if (payload.redirectUrl) {
    console.info('[workflow-bootstrap] redirectUrl found', payload.redirectUrl);
    return payload.redirectUrl;
  }

  const componentView = payload.componentviewrender || payload;
  const resolvedRoute = resolveRouteFromComponentView(componentView) || resolveRouteFromComponentView(payload) || null;

  console.info('[workflow-bootstrap] route resolved', {
    payload,
    componentView,
    resolvedRoute,
  });

  return resolvedRoute;
};

const appendWorkflowParamsToRedirect = (redirectUrl, requestUrl) => {
  const sourceUrl = new URL(requestUrl);
  const workflowId = sourceUrl.searchParams.get('WORKFLOW_ID');
  const workflowActor = sourceUrl.searchParams.get('WORKFLOW_ACTOR');

  if (!workflowId && !workflowActor) {
    return redirectUrl;
  }

  const targetUrl = new URL(redirectUrl, 'http://localhost');

  if (workflowId) {
    targetUrl.searchParams.set('WORKFLOW_ID', workflowId);
  }

  if (workflowActor) {
    targetUrl.searchParams.set('WORKFLOW_ACTOR', workflowActor);
  }

  return `${targetUrl.pathname}${targetUrl.search}`;
};

const workflowBootstrapLoader = async ({ request }) => {
  console.info('[workflow-bootstrap] loader invoked', request.url);
  const viewResult = await bootstrapWorkflowRequest(request.url);

  if (!viewResult) {
    console.warn('[workflow-bootstrap] no workflow bootstrap result, defaulting to /');
    return redirect('/');
  }

  const redirectUrl = constructRedirectUrl(viewResult);

  if (!redirectUrl) {
    console.warn('[workflow-bootstrap] route resolution failed, defaulting to /');
    return redirect('/');
  }

  const finalRedirectUrl = appendWorkflowParamsToRedirect(redirectUrl, request.url, viewResult);

  console.info('[workflow-bootstrap] loader redirecting to', finalRedirectUrl);
  return redirect(finalRedirectUrl);
};

const loanFlowWorkflowLoader = async ({ request }) => {
  console.info('[workflow-bootstrap] loan-flow loader invoked for URL:', request.url);

  const url = new URL(request.url);
  const workflowId = url.searchParams.get('WORKFLOW_ID');
  const workflowActor = url.searchParams.get('WORKFLOW_ACTOR');

  if (!workflowId || !workflowActor) {
    console.info('[workflow-bootstrap] missing workflow params on loan-flow, skipping API bootstrap call');
    return null;
  }

  const viewResult = await bootstrapWorkflowRequest(request.url);

  if (!viewResult) {
    console.warn('[workflow-bootstrap] no workflow bootstrap result returned from API');
    return null;
  }

  const redirectUrl = constructRedirectUrl(viewResult);

  if (!redirectUrl) {
    console.warn('[workflow-bootstrap] route resolution failed from API result');
    return { workflowData: viewResult };
  }

  const finalRedirectUrl = appendWorkflowParamsToRedirect(redirectUrl, request.url);
  const currentPathWithSearch = `${url.pathname}${url.search}`;

  console.info('[workflow-bootstrap] current URL:', currentPathWithSearch, '| calculated target:', finalRedirectUrl);

  if (finalRedirectUrl !== currentPathWithSearch) {
    console.info('[workflow-bootstrap] redirecting to workflow target step:', finalRedirectUrl);
    return redirect(finalRedirectUrl);
  }

  return { workflowData: viewResult };
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <AllComponentsPlaygroundPage />,
  },
  {
    path: '/display-all-components-with-all-possible-props-and-combinations',
    element: <AllComponentsPlaygroundPage />,
  },
  {
    path: '/workflow-navigator',
    loader: workflowBootstrapLoader,
  },
  {
    path: '/loan-flow',
    element: <LoanFlowLayout />,
    loader: loanFlowWorkflowLoader,
    shouldRevalidate: () => true,
    children: [
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
      { path: 'coborrower-face-verification', element: <CoborrowerFaceVerificationEngine /> },
      { path: 'coborrower-employment-info', element: <CoborrowerEmploymentInfoPage /> },
      { path: 'coborrower-salary-info', element: <CoborrowerSalaryInfoPage /> },
      { path: 'coborrower-business-info', element: <CoborrowerBusinessInfoPage /> },
      { path: 'coborrower-bank-details', element: <CoborrowerBankDetailsPage /> },
      { path: 'coborrower-rejected', element: <CoborrowerRejectedPage /> },
      { path: 'guarantor-kyc', element: <GuarantorKYCPage /> },

      // Lender & Risk Nodes
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
]);

export default router;
