# Loan Flow V5 - Complete Implementation Guide

## Overview
This document provides a comprehensive guide to the LOAN-FLOW-V5 implementation in the GOPRO project using ARTI UI components.

## Project Structure

```
GOPRO/
├── src/
│   ├── App.jsx                           # Main app with RouterProvider & LoanProvider
│   ├── main.jsx                          # Entry point
│   ├── router.js                         # 21 routes for loan flow states
│   ├── context/
│   │   └── LoanContext.jsx               # Global state management for loan data
│   ├── layouts/
│   │   └── LoanFlowLayout.jsx            # Shared layout with stepper
│   └── pages/
│       ├── HomePage.jsx                  # Landing page
│       └── loanFlow/                     # 21 loan flow pages
│           ├── PersonalInfoPage.jsx      # STATE 1: Personal details
│           ├── AddressInfoPage.jsx       # STATE 2: Address details
│           ├── KYCUploadPage.jsx         # STATE 3: KYC document upload
│           ├── FaceVerificationPage.jsx  # STATE 4: Face verification (SYSTEM)
│           ├── PANVerificationPage.jsx   # STATE 5: PAN verification (SYSTEM)
│           ├── AadharVerificationPage.jsx # STATE 6: Aadhaar verification (SYSTEM)
│           ├── EmploymentInfoPage.jsx    # STATE 7: Employment details (FORM)
│           ├── SalaryInfoPage.jsx        # STATE 8: Salary details (FORM for salaried)
│           ├── BusinessInfoPage.jsx      # STATE 9: Business details (FORM for self-employed)
│           ├── BankDetailsPage.jsx       # STATE 10: Bank account details
│           ├── BankStatementUploadPage.jsx # STATE 11: Bank statement upload
│           ├── DocumentUploadPage.jsx    # STATE 12: Additional documents
│           ├── CreditCheckPage.jsx       # STATE 13: Credit check (SYSTEM)
│           ├── FraudCheckPage.jsx        # STATE 15: Fraud detection (SYSTEM)
│           ├── CibilCheckPage.jsx        # STATE 16: CIBIL check (SYSTEM)
│           ├── RiskAssessmentPage.jsx    # STATE 14: Risk assessment (SYSTEM)
│           ├── UnderwriterReviewPage.jsx # STATE 19: Manual underwriter review
│           ├── ManagerApprovalPage.jsx   # STATE 20: Manager approval
│           ├── DisbursementPage.jsx      # STATE 21: Loan disbursement (SYSTEM)
│           ├── CoBorrowerKYCPage.jsx     # STATE 17: Co-borrower KYC
│           └── GuarantorKYCPage.jsx      # STATE 18: Guarantor KYC
```

## 21 Loan Application States

### 1. BORROWER-DETAILS-V1-PERSONAL-INFO-V1 (FORM)
**Component**: PersonalInfoPage
**Purpose**: Collect basic personal and identity details
**Key Fields**:
- Full Name, Father's Name, Mother's Name
- Date of Birth, Gender, Marital Status
- Email, Mobile Number
- PAN Number, Aadhaar Number
- Employment Type, Monthly Income
- Loan Purpose

**Next State**: BORROWER-ADDRESS-V1-ADDRESS-INFO-V1

### 2. BORROWER-ADDRESS-V1-ADDRESS-INFO-V1 (FORM)
**Component**: AddressInfoPage
**Purpose**: Capture current and permanent address
**Key Fields**:
- Flat No, Building, Street, Landmark
- City, District, State, Pincode
- Residence Type (Owned/Rented/With Parents)
- Permanent Address Same as Current

**Verification**: Pincode API validation
**Next State**: BORROWER-KYC-V1-KYC-UPLOAD-V1

### 3. BORROWER-KYC-V1-KYC-UPLOAD-V1 (FORM)
**Component**: KYCUploadPage
**Purpose**: Upload identity documents
**Documents Required**:
- Aadhaar Card (Front + Back)
- PAN Card (Front)

**Success Path**: → Face Verification
**Failure Path**: → Rejected

### 4. BORROWER-KYC-V1-FACE-VERIFICATION-V1 (SYSTEM)
**Component**: FaceVerificationEngine
**Purpose**: Liveness check and face matching
**Requirements**:
- Match Score ≥ 80
- Liveness Check Passed

**Success**: → PAN Verification
**Failure**: → Manager Approval (High Risk)

### 5. BORROWER-KYC-V1-PAN-VERIFICATION-V1 (SYSTEM)
**Component**: PANVerificationEngine
**Purpose**: Automated PAN verification
**Checks**:
- PAN active status
- Name match
- Not blacklisted

**Success**: → Aadhaar Verification
**Failure**: → Application Rejected

### 6. BORROWER-KYC-V1-AADHAR-VERIFICATION-V1 (SYSTEM)
**Component**: AadharVerificationEngine
**Purpose**: Verify Aadhaar and mobile linkage
**Checks**:
- Aadhaar validity
- Mobile linked status

**Success**: → Employment Info
**Failure**: → Application Rejected

### 7. BORROWER-EMPLOYMENT-V1-EMPLOYMENT-INFO-V1 (FORM)
**Component**: EmploymentInfoPage
**Purpose**: Employment or business details
**Dynamic Routing**:
- Salaried → Salary Info
- Business Owner → Business Info
- Unemployed → Rejected

### 8. BORROWER-SALARY-V1-SALARY-INFO-V1 (FORM)
**Component**: SalaryInfoPage
**Purpose**: Salary details for salaried applicants
**Key Fields**:
- Monthly Income
- Last 3 Months Payslips
- Company Information

**Criteria**: Income ≥ ₹50,000/month
**Success**: → Bank Details
**Alternate**: (Low Income) → Co-Borrower

### 9. BORROWER-BUSINESS-V1-BUSINESS-INFO-V1 (FORM)
**Component**: BusinessInfoPage
**Purpose**: Business details for self-employed
**Key Fields**:
- Business Name
- Annual Revenue
- GST Number
- Last 2 Years ITR

**Criteria**: Revenue ≥ ₹5,00,000/annum
**Success**: → Bank Details
**Failure**: → Rejected

### 10. BORROWER-BANK-V1-BANK-DETAILS-V1 (FORM)
**Component**: BankDetailsPage
**Purpose**: Bank account details for disbursement
**Key Fields**:
- Account Number
- IFSC Code
- Bank Name
- Cancelled Cheque

**Next**: → Bank Statement Upload

### 11. BORROWER-BANK-V1-BANK-STATEMENT-UPLOAD-V1 (FORM)
**Component**: BankStatementUploadPage
**Purpose**: Upload bank statements for income analysis
**Requirements**:
- Last 6 months statements
- PDF or image format

**Next**: → Document Upload

### 12. BORROWER-DOCUMENTS-V1-DOCUMENT-UPLOAD-V1 (FORM)
**Component**: DocumentUploadPage
**Purpose**: Additional supporting documents
**Acceptable Documents**:
- ITR, Form-16
- Property documents
- Previous loan statements

**Status**: Optional but recommended
**Next**: → Credit Check

### 13. BORROWER-CREDIT-V1-CREDIT-CHECK-V1 (SYSTEM)
**Component**: CreditCheckEngine
**Purpose**: Credit history and score analysis
**Checks**:
- Credit score (simulated: 600-750)
- Default history
- EMI payment record
- Legal proceedings

**Outcome**: Credit Score Display
**Next**: → Fraud Check

### 14. BORROWER-RISK-V1-RISK-ASSESSMENT-V1 (SYSTEM)
**Component**: RiskAssessmentEngine
**Purpose**: Overall risk scoring
**Factors Analyzed**:
- Income Stability
- Credit History
- Debt-to-Income Ratio
- Employment Stability

**Risk Levels**: LOW, MEDIUM, HIGH
**Routing**:
- LOW/MEDIUM → Underwriter Review
- HIGH → Manager Approval

### 15. RISKENGINE-FRAUD-V1-FRAUD-CHECK-V1 (SYSTEM)
**Component**: FraudCheckEngine
**Purpose**: Fraud detection
**Checks**:
- Document authenticity
- Duplicate applications
- Income verification
- Cross-verification

**Outcome**: Clean/Flagged
**Next**: → CIBIL Check

### 16. RISKENGINE-CIBIL-V1-CIBIL-CHECK-V1 (SYSTEM)
**Component**: CibilCheckEngine
**Purpose**: CIBIL score analysis
**Details**:
- CIBIL Score (simulated: 600-900)
- Credit Account Details
- Inquiry History
- Payment Behavior

**Score Ranges**:
- 750+ : Excellent
- 700-749: Good
- Below 700: Average

**Next**: → Risk Assessment

### 17. COBORROWER-KYC-V1-KYC-UPLOAD-V1 (FORM)
**Component**: CoBorrowerKYCPage
**Purpose**: Co-borrower identity verification
**When Used**: For low-income borrowers
**Documents**: Aadhaar, PAN (same as main applicant)

### 18. GUARANTOR-KYC-V1-KYC-UPLOAD-V1 (FORM)
**Component**: GuarantorKYCPage
**Purpose**: Guarantor identity verification
**When Used**: For high-risk applications
**Documents**: Aadhaar, PAN

### 19. UNDERWRITER-REVIEW-V1-UNDERWRITER-CHECK-V1 (MANUAL)
**Component**: UnderwriterReviewPage
**Purpose**: Manual review by underwriter team
**Output**:
- Loan Amount Recommended
- Recommended Tenure
- Recommended Interest Rate

**Decision**: Approved / Rejected
**Next**: → Manager Approval or Home

### 20. MANAGER-APPROVAL-V1-FINAL-APPROVAL-V1 (MANUAL)
**Component**: ManagerFinalApprovalPage
**Purpose**: Final approval by sanctioning manager
**Outputs** (if approved):
- Final Loan Amount
- Interest Rate
- Monthly EMI
- Total Amount Payable

**Decision**: Approved / Rejected
**Next**: → Disbursement or Home

### 21. DISBURSEMENT-PAYMENT-V1-LOAN-DISBURSEMENT-V1 (SYSTEM)
**Component**: DisbursementPage
**Purpose**: Disburse loan to borrower's account
**Process**:
1. Account verification
2. Microdeposit confirmation
3. Fund transfer
4. Confirmation SMS
5. Loan documents delivery

**Final Status**: Loan Disbursed ✓

## Context State Management (LoanContext)

The `LoanContext` manages all application data:

```javascript
{
  personalDetails: { ... },      // State 1
  addressDetails: { ... },        // State 2
  kycDocuments: { ... },          // State 3
  employmentDetails: { ... },     // State 7
  salaryDetails: { ... },         // State 8
  businessDetails: { ... },       // State 9
  bankDetails: { ... },           // State 10
  verificationStatus: { ... },    // Track verification results
  coBorrower: { ... },            // State 17
  guarantor: { ... },             // State 18
}
```

## ARTI UI Components Used

1. **AUBUTTON** - Action buttons with variants (primary, secondary, outline, ghost, danger, link)
2. **AUINPUT** - Text inputs with various types (text, email, tel, date, number)
3. **AUSELECT** - Dropdown selection with options
4. **AUTEXTAREA** - Multi-line text input
5. **AUCHECKBOX** - Single and checkbox groups
6. **AURADIO** - Radio button groups
7. **AUCARD** - Container for content sections
8. **AUPROGRESS** - Progress visualization
9. **AUSTEPPER** - Step indicator
10. **AULISTGROUP** - List of items display
11. **AUTOAST** - Toast notifications (error, success, warning, info)
12. **AUMODAL** - Dialog boxes
13. **AURANGE** - Range sliders

## Key Features

### ✅ Responsive Design
- Mobile-first approach
- Flexible layout grids
- Touch-friendly components

### ✅ Validation
- Form field validation
- Pincode verification
- Document type checking
- Income criteria validation

### ✅ State Persistence
- LoanContext stores all form data
- Navigation with back/next buttons
- Resume application functionality

### ✅ Conditional Routing
- Dynamic next state based on employment type
- Risk-based routing to manager approval
- Rejection handling

### ✅ Progress Tracking
- Stepper component shows progress
- Visual indicators for each state
- Completion percentage

## How to Use

### Starting the Application
```bash
npm install
npm run dev
```

### Navigation Flow
1. User lands on HomePage
2. Click "Start Loan Application"
3. Fill in Personal Info → Address → KYC → Verification
4. Employment section branches based on employment type
5. Bank details and document upload
6. Automated checks (Credit, Fraud, CIBIL, Risk)
7. Manual reviews (Underwriter, Manager)
8. Final disbursement

### Adding New States
1. Create new page component in `pages/loanFlow/`
2. Add context update function if needed
3. Create route in `router.js`
4. Link navigation from previous/next states

### Customizing Components
- All pages use ARTI UI components
- Styling via inline styles or SCSS
- Form validation in each component
- Success conditions trigger navigation

## Error Handling
- Form validation before next state
- API verification simulations
- Rejection paths to home page
- Error toast notifications

## API Placeholders
Replace simulated API calls with real endpoints:
- Pincode verification
- Document upload
- KYC verification (Face, PAN, Aadhaar)
- Credit check (Credit score APIs)
- CIBIL check
- Fraud detection
- Underwriter assignment
- Disbursement processing

## File Structure Summary
- **21 State Pages**: Complete loan application workflow
- **1 Layout Component**: Stepper navigation
- **1 Context Provider**: Global state management
- **1 Router Configuration**: All 21 routes mapped
- **1 Home Page**: Application landing page

Total: **28 Pages/Components + Context + Router**

---

**Workflow ID**: LOAN-FLOW-V5
**Start State**: BORROWER-DETAILS-V1-PERSONAL-INFO-V1
**End State**: DISBURSEMENT-PAYMENT-V1-LOAN-DISBURSEMENT-V1
**Total States**: 21
**Form States**: 12
**System States**: 7
**Manual States**: 2
