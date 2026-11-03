// One public surface for the app's shared primitives. Pages import from this
// barrel so a component can change implementation without touching every page.
// The legacy page-level components (PageHeader, FormSection, FormActions,
// InlineAlert, FileUpload, StatusHero, ProcessingPanel, StatusBadge) are the
// canonical versions; duplicate primitives were removed. None of these modules
// import the workflow, the API client or page logic.
export { default as BackendStepPage } from './BackendStepPage';
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as CheckboxField } from './CheckboxField';
export { default as ConfirmDialog } from './ConfirmDialog';
export { default as DateField } from './DateField';
export { default as ErrorSummary } from './ErrorSummary';
export { default as Field } from './Field';
export { default as FileUpload } from './FileUpload';
export { default as FormActions } from './FormActions';
export { default as FormSection } from './FormSection';
export { Icon, StageIcon } from './Icons';
export { default as InlineAlert } from './InlineAlert';
export { default as OtpField } from './OtpField';
export { default as PageHeader } from './PageHeader';
export { default as PhoneField } from './PhoneField';
export { default as ProcessingPanel } from './ProcessingPanel';
export { default as ProgressBar } from './ProgressBar';
export { default as RadioGroup } from './RadioGroup';
export { default as SelectField } from './SelectField';
export { EmptyState, ErrorState, LoadingState } from './States';
export { default as StatusBadge } from './StatusBadge';
export { default as StatusHero } from './StatusHero';
export { default as SummaryList } from './SummaryList';
export { default as TextArea } from './TextArea';
export { default as TextField } from './TextField';
