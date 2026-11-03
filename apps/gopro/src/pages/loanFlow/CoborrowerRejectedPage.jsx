import React from 'react';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import PageHeader from '../../components/ui/PageHeader';
import StatusHero from '../../components/ui/StatusHero';
import InlineAlert from '../../components/ui/InlineAlert';

export default function CoborrowerRejectedPage() {
  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Co-borrower outcome"
        title="Co-borrower eligibility rejected"
        description="The loan service evaluated the co-borrower and did not approve them for this application."
      />

      <AUCARD className="loan-flow-card">
        <StatusHero
          tone="danger"
          title="The co-borrower did not meet the eligibility criteria"
          actions={(
            <AUBUTTON variant="primary" onClick={() => window.location.assign('/')}>
              Return to dashboard
            </AUBUTTON>
          )}
        >
          <p>
            The co-borrower evaluation failed the credit or fraud eligibility checks. The
            loan service is the source of truth for the reason and any next steps.
          </p>
        </StatusHero>

        <InlineAlert tone="info" title="Need the exact reason?">
          <p>Contact the lender for the authoritative reason recorded against this application.</p>
        </InlineAlert>
      </AUCARD>
    </div>
  );
}
