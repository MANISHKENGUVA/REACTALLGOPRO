import React from 'react';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import PageHeader from '../../components/ui/PageHeader';
import StatusHero from '../../components/ui/StatusHero';

const NotYourTurnPage = () => (
  <div className="gp-page">
    <PageHeader
      eyebrow="Workflow access"
      title="Not your turn yet"
      description="The workflow has not reached a step for this actor."
    />

    <AUCARD className="loan-flow-card">
      <StatusHero
        tone="warning"
        title="Workflow has not reached the lender stage yet"
        actions={(
          <AUBUTTON variant="primary" onClick={() => window.location.reload()}>
            Refresh status
          </AUBUTTON>
        )}
      >
        <p>Please wait for the previous actor to complete their step, then refresh this page.</p>
      </StatusHero>
    </AUCARD>
  </div>
);

export default NotYourTurnPage;
