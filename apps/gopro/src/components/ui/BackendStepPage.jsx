import React from 'react';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import PageHeader from './PageHeader';
import FormSection from './FormSection';
import FormActions from './FormActions';
import InlineAlert from './InlineAlert';
import ProcessingPanel from './ProcessingPanel';

// Shared layout for backend-owned checks. The page supplies the event, payload
// and navigation; this component only renders the honest waiting state and the
// submit action. It never invents progress or a result.
export default function BackendStepPage({
  eyebrow,
  title,
  description,
  checks = [],
  checksTitle = 'What happens in this step',
  checksDescription = '',
  processingTitle = 'Waiting for the loan service',
  processingDescription = 'The result is returned by the backend.',
  processingSteps = [],
  submitLabel = 'Submit',
  loadingLabel = 'Submitting…',
  submitting = false,
  error = '',
  hint = '',
  onBack,
  onSubmit,
  children = null,
}) {
  return (
    <div className="gp-page">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <AUCARD className="loan-flow-card">
        {error ? (
          <InlineAlert tone="error" title="This step could not be submitted">
            <p>{error}</p>
          </InlineAlert>
        ) : null}

        {submitting ? (
          <ProcessingPanel
            title={processingTitle}
            description={processingDescription}
            steps={processingSteps}
          />
        ) : (
          <FormSection title={checksTitle} description={checksDescription}>
            {checks.length ? (
              <ul className="gp-stack--tight">
                {checks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
            ) : null}
            {children}
          </FormSection>
        )}

        <FormActions
          secondary={(
            <AUBUTTON type="button" variant="outline" onClick={onBack}>
              Back
            </AUBUTTON>
          )}
          hint={submitting ? 'Waiting for the loan service…' : hint}
        >
          <AUBUTTON
            variant="primary"
            disabled={submitting}
            loading={submitting}
            loadingText={loadingLabel}
            onClick={onSubmit}
          >
            {submitLabel}
          </AUBUTTON>
        </FormActions>
      </AUCARD>
    </div>
  );
}
