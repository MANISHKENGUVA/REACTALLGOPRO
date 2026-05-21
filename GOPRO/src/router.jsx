import { createBrowserRouter } from 'react-router-dom';

// Layouts
import LoanFlowLayout from './layouts/LoanFlowLayout';

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

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
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
        element: <PersonalInfoPage />,
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
