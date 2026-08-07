import { createBrowserRouter, redirect } from 'react-router-dom';

// Layouts
import LoanFlowLayout from './layouts/LoanFlowLayout';

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
    return payload;
  } catch (error) {
    console.error('[workflow-bootstrap] failed', error);
    return null;
  }
};

const COMPONENT_ROUTE_MAP = {
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

const resolveRouteFromComponentView = (componentView) => {
  if (!componentView) {
    return null;
  }

  const componentKey = componentView.componentKey || componentView.componentviewrender?.componentKey;
  const normalizedComponentKey = String(componentKey || '').toUpperCase();

  if (normalizedComponentKey && COMPONENT_ROUTE_MAP[normalizedComponentKey]) {
    return COMPONENT_ROUTE_MAP[normalizedComponentKey];
  }

  const componentState = componentView.componentviewrenderState || componentView.componentState;
  const normalizedState = String(componentState || '').toUpperCase();
  const stateKey = normalizedState.split('-').slice(-1)[0];

  if (stateKey && COMPONENT_ROUTE_MAP[stateKey]) {
    return COMPONENT_ROUTE_MAP[stateKey];
  }

  return null;
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

// Pages - Loan Flow
import PersonalInfoPage from './pages/loanFlow/PersonalInfoPage';
import AddressInfoPage from './pages/loanFlow/AddressInfoPage';
import KYCUploadPage from './pages/loanFlow/KYCUploadPage';
import FaceVerificationPage from './pages/loanFlow/FaceVerificationPage';
import PANVerificationPage from './pages/loanFlow/PANVerificationPage';
import AadharVerificationPage from './pages/loanFlow/AadharVerificationPage';
import EmploymentInfoPage from './pages/loanFlow/EmploymentInfoPage';
import SalaryInfoPage from './pages/loanFlow/SalaryInfoPage';
import BusinessInfoPage from './pages/loanFlow/BusinessInfoPage';
import BankDetailsPage from './pages/loanFlow/BankDetailsPage';
import BankStatementUploadPage from './pages/loanFlow/BankStatementUploadPage';
import DocumentUploadPage from './pages/loanFlow/DocumentUploadPage';
import CreditCheckPage from './pages/loanFlow/CreditCheckPage';
import FraudCheckPage from './pages/loanFlow/FraudCheckPage';
import CibilCheckPage from './pages/loanFlow/CibilCheckPage';
import RiskAssessmentPage from './pages/loanFlow/RiskAssessmentPage';
import UnderwriterReviewPage from './pages/loanFlow/UnderwriterReviewPage';
import ManagerApprovalPage from './pages/loanFlow/ManagerApprovalPage';
import DisbursementPage from './pages/loanFlow/DisbursementPage';
import CoBorrowerKYCPage from './pages/loanFlow/CoBorrowerKYCPage';
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
    children: [
      // ==========================================
      // 1. BORROWER-DETAILS-V1-PERSONAL-INFO-V1
      // ==========================================
      {
        path: 'personal-info',
        element: (
          <PersonalInfoPage
            metadata={{
              workflowId: 'WF-101',
              workflowActor: 'BORROWER',
              componentKey: 'PERSONAL-INFO-V1',
              componentViewRenderState: 'BORROWER-DETAILS-V1-PERSONAL-INFO-V1',
            }}
          />
        ),
      },

      // ==========================================
      // 2. BORROWER-ADDRESS-V1-ADDRESS-INFO-V1
      // ==========================================
      {
        path: 'address-info',
        element: <AddressInfoPage />,
      },

      // ==========================================
      // 3. BORROWER-KYC-V1-KYC-UPLOAD-V1
      // ==========================================
      {
        path: 'kyc-upload',
        element: <KYCUploadPage />,
      },

      // ==========================================
      // 4. BORROWER-KYC-V1-FACE-VERIFICATION-V1
      // ==========================================
      {
        path: 'face-verification',
        element: <FaceVerificationPage />,
      },

      // ==========================================
      // 5. BORROWER-KYC-V1-PAN-VERIFICATION-V1
      // ==========================================
      {
        path: 'pan-verification',
        element: <PANVerificationPage />,
      },

      // ==========================================
      // 6. BORROWER-KYC-V1-AADHAR-VERIFICATION-V1
      // ==========================================
      {
        path: 'aadhar-verification',
        element: <AadharVerificationPage />,
      },

      // ==========================================
      // 7. BORROWER-EMPLOYMENT-V1-EMPLOYMENT-INFO-V1
      // ==========================================
      {
        path: 'employment-info',
        element: <EmploymentInfoPage />,
      },

      // ==========================================
      // 8. BORROWER-SALARY-V1-SALARY-INFO-V1
      // ==========================================
      {
        path: 'salary-info',
        element: <SalaryInfoPage />,
      },

      // ==========================================
      // 9. BORROWER-BUSINESS-V1-BUSINESS-INFO-V1
      // ==========================================
      {
        path: 'business-info',
        element: <BusinessInfoPage />,
      },

      // ==========================================
      // 10. BORROWER-BANK-V1-BANK-DETAILS-V1
      // ==========================================
      {
        path: 'bank-details',
        element: <BankDetailsPage />,
      },

      // ==========================================
      // 11. BORROWER-BANK-V1-BANK-STATEMENT-UPLOAD-V1
      // ==========================================
      {
        path: 'bank-statement-upload',
        element: <BankStatementUploadPage />,
      },

      // ==========================================
      // 12. BORROWER-DOCUMENTS-V1-DOCUMENT-UPLOAD-V1
      // ==========================================
      {
        path: 'document-upload',
        element: <DocumentUploadPage />,
      },

      // ==========================================
      // 13. BORROWER-CREDIT-V1-CREDIT-CHECK-V1
      // ==========================================
      {
        path: 'credit-check',
        element: <CreditCheckPage />,
      },

      // ==========================================
      // 14. BORROWER-RISK-V1-RISK-ASSESSMENT-V1
      // ==========================================
      {
        path: 'risk-assessment',
        element: <RiskAssessmentPage />,
      },

      // ==========================================
      // 15. RISKENGINE-FRAUD-V1-FRAUD-CHECK-V1
      // ==========================================
      {
        path: 'fraud-check',
        element: <FraudCheckPage />,
      },

      // ==========================================
      // 16. RISKENGINE-CIBIL-V1-CIBIL-CHECK-V1
      // ==========================================
      {
        path: 'cibil-check',
        element: <CibilCheckPage />,
      },

      // ==========================================
      // 17. COBORROWER-KYC-V1-KYC-UPLOAD-V1
      // ==========================================
      {
        path: 'coborrower-kyc',
        element: <CoBorrowerKYCPage />,
      },

      // ==========================================
      // 18. GUARANTOR-KYC-V1-KYC-UPLOAD-V1
      // ==========================================
      {
        path: 'guarantor-kyc',
        element: <GuarantorKYCPage />,
      },

      // ==========================================
      // 19. UNDERWRITER-REVIEW-V1-UNDERWRITER-CHECK-V1
      // ==========================================
      {
        path: 'underwriter-review',
        element: <UnderwriterReviewPage />,
      },

      // ==========================================
      // 20. MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1
      // ==========================================
      {
        path: 'manager-approval',
        element: <ManagerApprovalPage />,
      },

      // ==========================================
      // 21. DISBURSEMENT-PAYMENT-V1-LOAN-DISBURSEMENT-V1
      // ==========================================
      {
        path: 'disbursement',
        element: <DisbursementPage />,
      },
    ],
  },
]);

export default router;
