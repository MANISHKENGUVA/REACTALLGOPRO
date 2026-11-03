import React from 'react';
import { AUCARD, AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import PageHeader from '../../components/ui/PageHeader';
import StatusHero from '../../components/ui/StatusHero';

export default function ApplicationCancelledPage() {
  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Application status"
        title="Application cancelled"
        description="This loan application is no longer active."
      />

      <AUCARD className="loan-flow-card">
        <StatusHero
          tone="warning"
          title="Loan application cancelled"
          actions={(
            <AUBUTTON variant="primary" onClick={() => window.location.assign('/')}>
              Back to home
            </AUBUTTON>
          )}
        >
          <p>This loan application has been cancelled by the applicant or has expired.</p>
        </StatusHero>
      </AUCARD>
    </div>
  );
}
