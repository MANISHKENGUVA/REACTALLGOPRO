import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUTEXTAREA, AUCARD, AUDATEPICKER } from 'artiqui/dist/router-engine.es.js';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { publicErrorMessage } from '../../utils/security';
import {
  PERSONAL_INFO_GENDER_OPTIONS,
  validatePersonalInfo,
} from './personalInfoValidation';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import { clearFieldError } from '../../utils/formValidation';
import { useFormDraft } from '../../workflow/useFormDraft';

const INITIAL_DETAILS = {
  fullName: '',
  fathersName: '',
  mothersName: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  email: '',
  mobileNumber: '',
  panNumber: '',
  aadhaarNumber: '',
  employmentType: '',
  monthlyIncome: '',
  loanPurpose: '',
};

export default function PersonalInfoPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-DETAILS-V1-PERSONAL-INFO-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/personal-info',
  }), [metadata, searchParams]);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Draft: restores this step's values after a refresh and keeps them while
  // the applicant is mid-application; cleared as soon as the backend accepts.
  const {
    values: formData,
    setValues: setFormData,
    clearDraft,
  } = useFormDraft({
    workflowId: workflowMetadata.workflowId,
    actor: workflowMetadata.workflowActor,
    stateId: workflowMetadata.componentViewRenderState,
    initialValues: INITIAL_DETAILS,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => clearFieldError(clearFieldError(prev, name), 'submit'));
  };

  const handleNext = async (event) => {
    event?.preventDefault?.();
    const { errors: nextErrors, data } = validatePersonalInfo(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await EventPublisher.publishAndNavigate({
        navigate,
        searchParams,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'PERSONAL_INFO_SUBMITTED',
        formData: data,
        workflowMetadata,
      });
      // The backend accepted the step; the draft must not be restored again.
      clearDraft();
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Failed to submit. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Step 1 · Borrower"
        title="Personal information"
        description="Tell us who you are and how we can reach you. Use the details printed on your PAN and Aadhaar."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not save these details">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection
            title="Identity"
            description="Names must match your government-issued documents."
          >
            <div className="gp-form-grid">
              <AUINPUT
                type="text"
                label="Full name (as per PAN)"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                error={errors.fullName || ''}
                required
              />
              <AUINPUT
                type="text"
                label="Father's name"
                name="fathersName"
                value={formData.fathersName}
                onChange={handleChange}
                placeholder="Enter father's name"
                autoComplete="off"
              />
              <AUINPUT
                type="text"
                label="Mother's name"
                name="mothersName"
                value={formData.mothersName}
                onChange={handleChange}
                placeholder="Enter mother's name"
                autoComplete="off"
              />
              <AUDATEPICKER
                label="Date of birth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                placeholder="Select date of birth"
                disableFuture
                error={errors.dateOfBirth || ''}
                required
              />
              <AUSELECT
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={PERSONAL_INFO_GENDER_OPTIONS}
                error={errors.gender || ''}
                required
              />
              <AUSELECT
                label="Marital status"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                options={[
                  { label: 'Select status', value: '' },
                  { label: 'Single', value: 'single' },
                  { label: 'Married', value: 'married' },
                  { label: 'Divorced', value: 'divorced' },
                  { label: 'Widowed', value: 'widowed' },
                ]}
                error={errors.maritalStatus || ''}
              />
            </div>
          </FormSection>

          <FormSection
            title="Contact"
            description="We use these details only for this application."
          >
            <div className="gp-form-grid">
              <AUINPUT
                type="email"
                label="Email address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email || ''}
                required
              />
              <AUINPUT
                type="tel"
                label="Mobile number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                error={errors.mobileNumber || ''}
                required
              />
            </div>
          </FormSection>

          <FormSection
            title="Tax and employment"
            description="Your PAN is checked against the details on file with the tax authority."
          >
            <div className="gp-form-grid">
              <AUINPUT
                type="text"
                label="PAN number"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                autoComplete="off"
                maxLength={10}
                error={errors.panNumber || ''}
                required
              />
              <AUINPUT
                type="text"
                label="Aadhaar number"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                placeholder="12-digit Aadhaar number"
                inputMode="numeric"
                maxLength={12}
                error={errors.aadhaarNumber || ''}
              />
              <AUSELECT
                label="Employment type"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                options={[
                  { label: 'Select employment type', value: '' },
                  { label: 'Salaried', value: 'salaried' },
                  { label: 'Business owner', value: 'business' },
                  { label: 'Other', value: 'others' },
                ]}
                error={errors.employmentType || ''}
                required
              />
              <AUINPUT
                type="number"
                label="Approximate monthly income (₹)"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                placeholder="Enter monthly income"
                inputMode="numeric"
                error={errors.monthlyIncome || ''}
              />
              <div className="gp-form-grid__full">
                <AUTEXTAREA
                  label="Loan purpose"
                  name="loanPurpose"
                  value={formData.loanPurpose}
                  onChange={handleChange}
                  placeholder="Describe what the loan is for"
                  rows="4"
                />
              </div>
            </div>
          </FormSection>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate('/')}>
                Cancel
              </AUBUTTON>
            )}
            hint="Your details are sent only when you continue."
          >
            <AUBUTTON type="submit" variant="primary" disabled={submitting} loading={submitting} loadingText="Submitting…">
              Save and continue
            </AUBUTTON>
          </FormActions>
        </form>
      </AUCARD>
    </div>
  );
}
