import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import { SessionManager } from '../../workflow/SessionManager';
import { EventPublisher } from '../../workflow/EventPublisher';
import { publicErrorMessage, UPLOAD_POLICIES, validateUploadFiles } from '../../utils/security';
import PageHeader from '../../components/ui/PageHeader';
import FormSection from '../../components/ui/FormSection';
import FormActions from '../../components/ui/FormActions';
import InlineAlert from '../../components/ui/InlineAlert';
import FileUpload from '../../components/ui/FileUpload';

export default function BankStatementUploadPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [statements, setStatements] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const workflowMetadata = useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-BANK-V1-BANK-STATEMENT-UPLOAD-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/bank-statement-upload',
  }), [metadata, searchParams]);

  const handleFileChange = (event) => {
    setStatements(Array.from(event.target.files || []));
    setErrors({});
  };

  const handleNext = async (event) => {
    event?.preventDefault?.();
    if (statements.length === 0) {
      setErrors({ statements: 'Upload at least one bank statement.' });
      return;
    }
    const validation = validateUploadFiles(statements, UPLOAD_POLICIES.bankStatement);
    if (!validation.ok) {
      setErrors({ statements: validation.error });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await EventPublisher.publishLegacyAndNavigate({
        navigate,
        sessionId: SessionManager.getSessionId(searchParams),
        eventType: 'BANK_STATEMENT_UPLOADED',
        formData: {
          uploaded: true,
          statementCount: statements.length,
          statementNames: statements.map((file) => file.name),
        },
        workflowMetadata,
        fallbackRoute: '/loan-flow/document-upload',
      });
    } catch (error) {
      setErrors({ submit: publicErrorMessage(error, 'Failed to submit the bank statements. Please try again.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · Bank"
        title="Upload bank statements"
        description="Upload the statements for the last six months so the loan service can analyse income and repayment capacity."
      />

      <AUCARD className="loan-flow-card">
        {errors.submit ? (
          <InlineAlert tone="error" title="We could not submit the statements">
            <p>{errors.submit}</p>
          </InlineAlert>
        ) : null}
        {errors.statements ? (
          <InlineAlert tone="error" title="Check your files">
            <p>{errors.statements}</p>
          </InlineAlert>
        ) : null}

        <form className="gp-stack" onSubmit={handleNext} noValidate>
          <FormSection title="Statement files">
            <FileUpload
              id="bank-statements"
              name="statements"
              label="Bank statements covering the last six months"
              hint="Up to 6 files. PDF, JPG, PNG, WEBP, DOC or DOCX, each up to 5 MB."
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              multiple
              required
              files={statements}
              onChange={handleFileChange}
              error={errors.statements || ''}
              actionLabel="Choose statements"
            />
          </FormSection>

          <InlineAlert tone="info" title="What the loan service reviews">
            <p>Average balance, income patterns, expenses and transaction history. Upload complete statements rather than screenshots of individual transactions.</p>
          </InlineAlert>

          <FormActions
            secondary={(
              <AUBUTTON type="button" variant="outline" onClick={() => navigate(-1)}>
                Back
              </AUBUTTON>
            )}
            hint={statements.length ? `${statements.length} file${statements.length === 1 ? '' : 's'} selected.` : 'At least one statement is required.'}
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
