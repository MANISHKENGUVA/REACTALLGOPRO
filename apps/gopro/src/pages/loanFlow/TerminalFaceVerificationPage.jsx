import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { buildPageMetadata } from '../../workflow/pageMetadata';
import PageHeader from '../../components/ui/PageHeader';
import StatusHero from '../../components/ui/StatusHero';

export default function TerminalFaceVerificationPage({ metadata }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useMemo(() => buildPageMetadata({
    defaultStateId: 'BORROWER-KYC-V1-TERMINAL-FACEVERIFICATION-V1',
    metadata,
    searchParams,
    routePath: '/loan-flow/terminal-face-verification',
  }), [metadata, searchParams]);

  return (
    <div className="gp-page">
      <PageHeader
        eyebrow="Borrower · Review"
        title="Application under review"
        description="The application has reached a step that requires manager approval."
      />

      <AUCARD className="loan-flow-card">
        <StatusHero
          tone="warning"
          title="Manager approval required"
          actions={(
            <AUBUTTON variant="primary" onClick={() => navigate('/')}>
              Back to home
            </AUBUTTON>
          )}
        >
          <p>
            Your application is waiting for a manager decision. The loan service will make the
            next step available after that review. Contact the manager if you need an update.
          </p>
        </StatusHero>
      </AUCARD>
    </div>
  );
}
