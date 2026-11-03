import React from 'react';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import PageHeader from '../../components/ui/PageHeader';
import StatusHero from '../../components/ui/StatusHero';
import SummaryList from '../../components/ui/SummaryList';
import InlineAlert from '../../components/ui/InlineAlert';

export default function ApplicationApprovedPage() {
  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Application status"
        title="Loan approved"
        description="The lender approved this application. The sanction details below come from the backend."
      />

      <AUCARD className="loan-flow-card">
        <StatusHero
          tone="success"
          title="Your loan application was approved"
          actions={(
            <AUBUTTON variant="primary" onClick={() => window.location.assign('/')}>
              Return to dashboard
            </AUBUTTON>
          )}
        >
          <p>The approval is recorded by the loan service. Review the sanction parameters and disbursement status below.</p>
        </StatusHero>

        <SummaryList
          items={[
            { id: 'sanctioned', label: 'Sanctioned amount', value: 'Backend-provided' },
            { id: 'rate', label: 'Interest rate', value: 'Backend-provided' },
            { id: 'tenure', label: 'Tenure', value: 'Backend-provided' },
            { id: 'disbursement', label: 'Disbursement status', value: 'Supplied by the backend' },
          ]}
        />

        <InlineAlert tone="info" title="Why the values are placeholders">
          <p>
            The current application contract does not expose the sanctioned values to this page,
            so they are not estimated or invented here. Contact the lender for the authoritative
            sanction letter.
          </p>
        </InlineAlert>
      </AUCARD>
    </div>
  );
}
