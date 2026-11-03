# GOPRO UI/UX audit

## Scope and method

This audit is based on the React Router configuration (`apps/gopro/src/router.jsx`), the shared component export surface (`packages/artiqui/src/routerEngine.js`), the application shell, the homepage, shared page/form styles, the base theme tokens, and representative shared controls. The repository is a JavaScript React 19/Vite workspace with Sass and React Router 7; validation uses the existing Zod dependency. The registered paths below are the authoritative route inventory. Route pages and workflows must continue to be resolved by the backend/workflow configuration; this document does not prescribe additional UI routes.

## Registered route inventory

| Route | Page/component | Journey / actor area |
|---|---|---|
| `/` | `HomePage` | Public entry |
| `/display-all-components-with-all-possible-props-and-combinations` | `AllComponentsPlaygroundPage` (development only) | Component showcase |
| `/workflow` | `WorkflowHost` | Workflow/session entry |
| `/workflow-navigator` | Loader redirect/resolution | Workflow bootstrap |
| `/loan-flow/workflow` | `WorkflowHost` | Workflow/session recovery |
| `/loan-flow/navigator` | `WorkflowHost` | Workflow/session entry alias |
| `/loan-flow/navigater` | `WorkflowHost` | Legacy workflow/session alias |
| `/loan-flow/personal-info` | `PersonalInfoPage` | Borrower profile |
| `/loan-flow/address-info` | `AddressInfoPage` | Borrower profile |
| `/loan-flow/kyc-upload` | `KYCUploadPage` | Borrower identity and documents |
| `/loan-flow/face-verification` | `FaceVerificationPage` | Borrower identity verification |
| `/loan-flow/terminal-face-verification` | `TerminalFaceVerificationPage` | Verification result |
| `/loan-flow/verification-pending` | `VerificationPendingPage` | Verification status |
| `/loan-flow/pan-verification` | `PANVerificationPage` | Borrower identity verification |
| `/loan-flow/aadhar-verification` | `AadharVerificationPage` | Borrower identity verification |
| `/loan-flow/employment-info` | `EmploymentInfoPage` | Borrower employment |
| `/loan-flow/salary-info` | `SalaryInfoPage` | Borrower income |
| `/loan-flow/business-info` | `BusinessInfoPage` | Borrower business income |
| `/loan-flow/bank-details` | `BankDetailsPage` | Borrower banking |
| `/loan-flow/bank-account-verification` | `BankAccountVerificationEngine` | Borrower banking verification |
| `/loan-flow/bank-statement-upload` | `BankStatementUploadPage` | Borrower banking documents |
| `/loan-flow/document-upload` | `DocumentUploadPage` | Borrower documents |
| `/loan-flow/loan-consent` | `LoanConsentPage` | Borrower consent |
| `/loan-flow/borrower-credit-check` | `BorrowerCreditCheckPage` | Borrower verification |
| `/loan-flow/approved` | `ApplicationApprovedPage` | Terminal application state |
| `/loan-flow/rejected` | `ApplicationRejectedPage` | Terminal application state |
| `/loan-flow/cancelled` | `ApplicationCancelledPage` | Terminal application state |
| `/loan-flow/coborrower-kyc` | `CoBorrowerKYCPage` | Co-borrower identity |
| `/loan-flow/coborrower-personal-info` | `CoborrowerPersonalInfoPage` | Co-borrower profile |
| `/loan-flow/coborrower-address-info` | `CoborrowerAddressInfoPage` | Co-borrower profile |
| `/loan-flow/coborrower-kyc-upload` | `CoborrowerKYCUploadPage` | Co-borrower documents |
| `/loan-flow/coborrower-pan-verification` | `PANVerificationPage` with co-borrower metadata | Co-borrower identity verification |
| `/loan-flow/coborrower-aadhar-verification` | `AadharVerificationPage` with co-borrower metadata | Co-borrower identity verification |
| `/loan-flow/coborrower-face-verification` | `CoborrowerFaceVerificationEngine` | Co-borrower identity verification |
| `/loan-flow/coborrower-employment-info` | `CoborrowerEmploymentInfoPage` | Co-borrower employment |
| `/loan-flow/coborrower-salary-info` | `CoborrowerSalaryInfoPage` | Co-borrower income |
| `/loan-flow/coborrower-business-info` | `CoborrowerBusinessInfoPage` | Co-borrower business income |
| `/loan-flow/coborrower-bank-details` | `CoborrowerBankDetailsPage` | Co-borrower banking |
| `/loan-flow/coborrower-rejected` | `CoborrowerRejectedPage` | Co-borrower terminal state |
| `/loan-flow/guarantor-kyc` | `GuarantorKYCPage` | Guarantor identity |
| `/loan-flow/not-your-turn` | `NotYourTurnPage` | Actor/access state |
| `/loan-flow/credit-check` | `CreditCheckPage` | Lender review |
| `/loan-flow/fraud-check` | `FraudCheckPage` | Lender review |
| `/loan-flow/cibil-check` | `CibilCheckPage` | Lender review |
| `/loan-flow/document-verification` | `DocumentVerificationEngine` | Lender review |
| `/loan-flow/risk-assessment` | `RiskAssessmentPage` | Lender review |
| `/loan-flow/eligibility-check` | `EligibilityEngine` | Lender review |
| `/loan-flow/loan-amount` | `LoanAmountPage` | Lender decision |
| `/loan-flow/interest-rate` | `InterestRateEngine` | Lender decision |
| `/loan-flow/loan-offer` | `LoanOfferPage` | Offer |
| `/loan-flow/agreement-generation` | `AgreementGenerationEngine` | Agreement |
| `/loan-flow/esign` | `ESignPage` | Agreement |
| `/loan-flow/mandate-setup` | `MandateSetupPage` | Repayment mandate |
| `/loan-flow/disbursement` | `DisbursementPage` | Disbursement |
| `/loan-flow/disbursement-request` | `DisbursementRequestEngine` | Disbursement |
| `/loan-flow/disbursement-confirmation` | `DisbursementConfirmationEngine` | Disbursement |
| `/loan-flow/disbursement-failed` | `DisbursementFailedPage` | Disbursement recovery |
| `/loan-flow/underwriter-review` | `UnderwriterReviewPage` | Manager/underwriter review |
| `/loan-flow/manager-approval` | `ManagerApprovalPage` | Manager decision |
| `/loan-flow/manager-fraud-review` | `ManagerFraudReviewPage` | Manager review |
| `/loan-flow/manager-credit-exception` | `ManagerCreditExceptionPage` | Manager review |
| `/loan-flow/manager-document-review` | `ManagerDocumentReviewPage` | Manager review |
| `/loan-flow/manager-eligibility-review` | `ManagerEligibilityReviewPage` | Manager review |
| `/loan-flow/manager-risk-review` | `ManagerRiskReviewPage` | Manager review |
| `/loan-flow/fraud-check-pending` | `FraudCheckPendingPage` | Review status |
| `/loan-flow/manager-disbursement-review` | `ManagerDisbursementReviewPage` | Manager review |
| `*` | `WorkflowErrorBoundary` | Not found / workflow error |

## Shared Artiqui component inventory

The package exports: `AUBUTTON`, `AUINPUT`, `AUTEXTAREA`, `AUSELECT`, `AUTOGGLE`, `AURANGE`, `AUDATEPICKER`, `AUCHECKBOX`, `AUCHECKBOXGROUP`, `AURADIO`, `AURADIOGROUP`, `AUCARD`, `AUMODAL`, `AUTOAST`/`AUTOASTCONTAINER`, `AUTOOLTIP`, `AUPOPOVER`, `AUPROGRESS`, `AUPAGINATION`, `AUMENU`/`AUMENUDROPDOWN`, `AUSTEPPER`, `AUCHIP`, `AUTIMELINE`, and `AULISTGROUP`. The package stylesheet is assembled by Sass imports under `packages/artiqui/src/assets/sass/compo/`; the GOPRO app layers matching palette and control refinements through `apps/gopro/src/assets/sass/compo/_au-overrides.scss`. Call sites should be rechecked whenever a public prop contract changes; this implementation keeps the modal API backward compatible.

## Findings and design decisions

- The homepage previously wrapped its start action in nested card-like surfaces and rendered seven journey descriptions as independent cards. That gave the entry page a dashboard/catalog feel and visually competed with the primary action.
- The base application has semantic tokens, a skip link, a responsive shell, field-level error styles, workflow-derived progress, and reduced-motion handling. Keep these shared foundations rather than adding page-specific CSS patches or inventing workflow progress.
- The app and shared library already have separate responsibilities. Continue to keep business logic, API calls, workflow resolution, session handling, and actor authorization in GOPRO; Artiqui remains generic.
- The current `AUMODAL` implementation lacked an accessible name when no title was supplied, focus placement/restoration, and keyboard focus containment. These are addressed without changing its existing props or callback contract.
- Do not infer completion state, eligibility, or required workflow stages from the landing page. Its preparation guidance is explicitly illustrative; the backend continues to determine requested fields and the next step.

## Implementation checklist

- [x] Inventory every registered route and map it to its router element or loader.
- [x] Identify the app shell, theme token layer, app-level Artiqui overrides, and library Sass entry.
- [x] Simplify the landing page hierarchy and prioritize the existing workflow start action.
- [x] Improve shared modal focus, escape-key, and accessible naming behavior.
- [ ] Conduct visual and keyboard verification of every workflow page in a running browser at mobile, tablet, laptop, and desktop sizes.
- [ ] Run repository lint, test, and production build scripts in an installed workspace.

## Verification limits

The route inventory comes directly from `router.jsx`. This remote repository-editing session does not provide a local checkout, browser session, or command runner, so no claim is made that every route was manually exercised, that all component call sites were exhaustively tested, or that lint/tests/build passed. Complete the unchecked verification items in CI or a local checkout before treating the full redesign as finished.
