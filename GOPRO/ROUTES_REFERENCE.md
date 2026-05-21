# LOAN-FLOW-V5 - URL Routes & State Transitions

## Route Mappings

### Base URL: `/loan-flow/`

| State # | State ID | URL Path | Component | Type |
|---------|----------|----------|-----------|------|
| 1 | BORROWER-DETAILS-V1-PERSONAL-INFO-V1 | `/loan-flow/personal-info` | PersonalInfoPage | FORM |
| 2 | BORROWER-ADDRESS-V1-ADDRESS-INFO-V1 | `/loan-flow/address-info` | AddressInfoPage | FORM |
| 3 | BORROWER-KYC-V1-KYC-UPLOAD-V1 | `/loan-flow/kyc-upload` | KYCUploadPage | FORM |
| 4 | BORROWER-KYC-V1-FACE-VERIFICATION-V1 | `/loan-flow/face-verification` | FaceVerificationPage | SYSTEM |
| 5 | BORROWER-KYC-V1-PAN-VERIFICATION-V1 | `/loan-flow/pan-verification` | PANVerificationPage | SYSTEM |
| 6 | BORROWER-KYC-V1-AADHAR-VERIFICATION-V1 | `/loan-flow/aadhar-verification` | AadharVerificationPage | SYSTEM |
| 7 | BORROWER-EMPLOYMENT-V1-EMPLOYMENT-INFO-V1 | `/loan-flow/employment-info` | EmploymentInfoPage | FORM |
| 8 | BORROWER-SALARY-V1-SALARY-INFO-V1 | `/loan-flow/salary-info` | SalaryInfoPage | FORM |
| 9 | BORROWER-BUSINESS-V1-BUSINESS-INFO-V1 | `/loan-flow/business-info` | BusinessInfoPage | FORM |
| 10 | BORROWER-BANK-V1-BANK-DETAILS-V1 | `/loan-flow/bank-details` | BankDetailsPage | FORM |
| 11 | BORROWER-BANK-V1-BANK-STATEMENT-UPLOAD-V1 | `/loan-flow/bank-statement-upload` | BankStatementUploadPage | FORM |
| 12 | BORROWER-DOCUMENTS-V1-DOCUMENT-UPLOAD-V1 | `/loan-flow/document-upload` | DocumentUploadPage | FORM |
| 13 | BORROWER-CREDIT-V1-CREDIT-CHECK-V1 | `/loan-flow/credit-check` | CreditCheckPage | SYSTEM |
| 14 | BORROWER-RISK-V1-RISK-ASSESSMENT-V1 | `/loan-flow/risk-assessment` | RiskAssessmentPage | SYSTEM |
| 15 | RISKENGINE-FRAUD-V1-FRAUD-CHECK-V1 | `/loan-flow/fraud-check` | FraudCheckPage | SYSTEM |
| 16 | RISKENGINE-CIBIL-V1-CIBIL-CHECK-V1 | `/loan-flow/cibil-check` | CibilCheckPage | SYSTEM |
| 17 | COBORROWER-KYC-V1-KYC-UPLOAD-V1 | `/loan-flow/coborrower-kyc` | CoBorrowerKYCPage | FORM |
| 18 | GUARANTOR-KYC-V1-KYC-UPLOAD-V1 | `/loan-flow/guarantor-kyc` | GuarantorKYCPage | FORM |
| 19 | UNDERWRITER-REVIEW-V1-UNDERWRITER-CHECK-V1 | `/loan-flow/underwriter-review` | UnderwriterReviewPage | MANUAL |
| 20 | MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1 | `/loan-flow/manager-approval` | ManagerApprovalPage | MANUAL |
| 21 | DISBURSEMENT-PAYMENT-V1-LOAN-DISBURSEMENT-V1 | `/loan-flow/disbursement` | DisbursementPage | SYSTEM |

---

## State Transitions

### Standard Flow
```
/personal-info
    ↓ (Next)
/address-info
    ↓ (Next)
/kyc-upload
    ↓ (Next)
/face-verification
    ├─ Success → /pan-verification
    └─ Failure → /manager-approval
    
/pan-verification
    ├─ Success → /aadhar-verification
    └─ Failure → / (Rejected)

/aadhar-verification
    ├─ Success → /employment-info
    └─ Failure → / (Rejected)

/employment-info
    ├─ [Salaried] → /salary-info
    ├─ [Business] → /business-info
    └─ [Other] → / (Rejected)

/salary-info → /bank-details
/business-info → /bank-details

/bank-details
    ↓ (Next)
/bank-statement-upload
    ↓ (Next)
/document-upload
    ↓ (Next)
/credit-check
    ↓ (Next)
/fraud-check
    ↓ (Next)
/cibil-check
    ↓ (Next)
/risk-assessment
    ├─ [LOW/MEDIUM] → /underwriter-review
    └─ [HIGH] → /manager-approval

/underwriter-review
    ├─ Approved → /manager-approval
    └─ Rejected → / (Rejected)

/manager-approval
    ├─ Approved → /disbursement
    └─ Rejected → / (Rejected)

/disbursement
    ↓ (Completed)
/ (Dashboard with success message)
```

### Employment Type Decision Tree
```
/employment-info
    ├─ Salaried
    │   └─ /salary-info
    │       ├─ Income ≥ ₹50k → /bank-details
    │       └─ Income < ₹50k → (Optional) /coborrower-kyc
    │
    ├─ Business
    │   └─ /business-info
    │       ├─ Revenue ≥ ₹5L → /bank-details
    │       └─ Revenue < ₹5L → / (Rejected)
    │
    └─ Others → / (Rejected)
```

### Risk-Based Routing
```
/risk-assessment
    ├─ LOW RISK (60%)
    │   └─ /underwriter-review → Usually Approved
    │
    ├─ MEDIUM RISK (30%)
    │   ├─ /underwriter-review → May Need Escalation
    │   └─ /manager-approval → Final Decision
    │
    └─ HIGH RISK (10%)
        └─ /manager-approval → Special Review
```

### Optional Paths
```
Co-Borrower Path:
    /salary-info (Low Income)
        ├─ /coborrower-kyc (Add Co-Borrower)
        └─ Continue to /bank-details

Guarantor Path:
    /risk-assessment (HIGH RISK)
        ├─ /guarantor-kyc (Add Guarantor)
        └─ Continue to /manager-approval
```

---

## Context State Updates by Page

| Page | Context Update Function | Data Stored |
|------|--------------------------|-------------|
| PersonalInfoPage | `updatePersonalDetails()` | Full name, DOB, PAN, Aadhaar, etc. |
| AddressInfoPage | `updateAddressDetails()` | Address, city, pincode, state |
| KYCUploadPage | `updateKYCDocuments()` | Aadhaar & PAN file references |
| EmploymentInfoPage | `updateEmploymentDetails()` | Company, designation, experience |
| SalaryInfoPage | `updateSalaryDetails()` | Monthly income, payslips |
| BusinessInfoPage | `updateBusinessDetails()` | Business name, revenue, GST, ITR |
| BankDetailsPage | `updateBankDetails()` | Account number, IFSC, bank name |
| All Verification Pages | `updateVerificationStatus()` | Face, PAN, Aadhaar, Credit, etc. |

---

## Query Parameters (Optional)

Support for optional query parameters:

```
/loan-flow/personal-info?mode=edit&id=APP123
/loan-flow/personal-info?resume=true
```

---

## Error & Rejection Routes

| Scenario | Route | Component |
|----------|-------|-----------|
| PAN Verification Failed | `/` | HomePage (with error message) |
| Aadhaar Verification Failed | `/` | HomePage (with error message) |
| Income Criteria Not Met | `/` | HomePage (with suggestion) |
| Business Revenue Too Low | `/` | HomePage (with error message) |
| Underwriter Rejected | `/` | HomePage (with appeal option) |
| Manager Rejected | `/` | HomePage (with support contact) |

---

## Success Route

```
/loan-flow/disbursement (Completed)
    ↓
/ (HomePage with success banner)
    
Display Message:
"✓ Loan Approved & Disbursed
Amount: ₹5,00,000
Monthly EMI: ₹10,145
View Details | Download Documents"
```

---

## Navigation Helpers in Code

### Standard Next Button
```javascript
navigate('/loan-flow/next-page');
```

### Conditional Navigation
```javascript
if (employmentType === 'salaried') {
  navigate('/loan-flow/salary-info');
} else if (employmentType === 'business') {
  navigate('/loan-flow/business-info');
}
```

### Back Navigation
```javascript
navigate('/loan-flow/previous-page');
// or
navigate(-1); // Go back
```

### Direct Navigation (Home/Dashboard)
```javascript
navigate('/'); // Go to home
```

### URL Building
```javascript
const baseUrl = '/loan-flow';
const nextPage = `${baseUrl}/kyc-upload`;
navigate(nextPage);
```

---

## State Machine Validation

### Valid Transitions Only
- Each page has defined `Next` button logic
- Invalid state transitions rejected
- Data validation before page change

### Backwards Navigation
- Users can go back to previous pages
- All pages have `Back` button
- No loss of data on backward navigation

### Protected Routes (Future)
```javascript
// Can add authentication/authorization
// Only navigate if:
// 1. User authenticated
// 2. Previous state completed
// 3. Required fields filled
```

---

## Quick Reference URLs

**Application Start**:
- Home: `/`
- First Page: `/loan-flow/personal-info`

**Key Milestones**:
- KYC Complete: `/loan-flow/kyc-upload`
- Employment Selected: `/loan-flow/employment-info`
- Bank Details: `/loan-flow/bank-details`
- Approval: `/loan-flow/manager-approval`
- Disbursement: `/loan-flow/disbursement`

**Direct Access** (for development/testing):
```
http://localhost:5173/
http://localhost:5173/loan-flow/personal-info
http://localhost:5173/loan-flow/kyc-upload
http://localhost:5173/loan-flow/face-verification
http://localhost:5173/loan-flow/manager-approval
http://localhost:5173/loan-flow/disbursement
```

---

## Debugging Tips

### Check Current Route
```javascript
// In any component with useLocation()
import { useLocation } from 'react-router-dom';
const location = useLocation();
console.log('Current route:', location.pathname);
```

### Monitor State Changes
```javascript
// In LoanContext components
console.log('Loan Data:', loanApplicationData);
```

### Test Navigation
```javascript
// In browser console
window.location.href = '/loan-flow/personal-info'
```

---

**Total Routes**: 21 main paths + 1 home = 22 total routes
**State Type Distribution**: 12 FORM + 7 SYSTEM + 2 MANUAL
**Complexity**: Multi-step workflow with conditional branching
