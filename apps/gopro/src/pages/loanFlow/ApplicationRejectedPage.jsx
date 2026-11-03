import { buildPageMetadata } from '../../workflow/pageMetadata';
import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import PageHeader from '../../components/ui/PageHeader';
import StatusHero from '../../components/ui/StatusHero';

export default function ApplicationRejectedPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useMemo(() => {
    buildPageMetadata({
      defaultStateId: 'BORROWER-STATUS-V1-REJECTED-V1',
      metadata,
      searchParams,
      routePath: '/loan-flow/rejected',
    });
  }, [metadata, searchParams]);

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Application status"
        title="Application rejected"
        description="The loan service returned a rejected status for this application."
      />

      <AUCARD className="loan-flow-card">
        <StatusHero
          tone="danger"
          title="Loan application status: rejected"
          actions={(
            <AUBUTTON variant="primary" onClick={() => navigate('/')}>
              Back to home
            </AUBUTTON>
          )}
        >
          <p>
            The backend returned a rejected status for this application. Contact the lender for the
            authoritative reason and any next steps.
          </p>
        </StatusHero>
      </AUCARD>
    </div>
  );
}
