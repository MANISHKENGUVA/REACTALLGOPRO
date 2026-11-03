import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import PageHeader from '../components/ui/PageHeader';
import StatusHero from '../components/ui/StatusHero';

const JOURNEY_FEATURES = [
  { title: 'Profile', description: 'Personal details and address' },
  { title: 'Identity & KYC', description: 'Documents, PAN, Aadhaar and face verification' },
  { title: 'Employment & income', description: 'Salary or business details' },
  { title: 'Bank & documents', description: 'Account details, statements and supporting files' },
  { title: 'Verification', description: 'Credit, fraud, risk and eligibility checks' },
  { title: 'Offer & consent', description: 'Consent, amount, pricing and the offer' },
  { title: 'Agreement & approval', description: 'Agreement, e-sign, mandate and final approval' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="gp-page gp-page-stack">
      <PageHeader
        eyebrow="GOPRO loan application"
        title="Start your loan application"
        description="A guided, step-by-step application that keeps your information safe while the loan service verifies each stage."
      />

      <AUCARD className="loan-flow-card">
        <StatusHero
          tone="info"
          icon="arrowRight"
          title="Begin a new application"
          actions={(
            <AUBUTTON variant="primary" onClick={() => navigate('/loan-flow/workflow')}>
              Start Loan Application
            </AUBUTTON>
          )}
        >
          <p>
            Your application is processed one step at a time. The loan service determines which
            information has been saved. Unsaved form entries may be lost when you leave this page.
          </p>
        </StatusHero>
      </AUCARD>

      <div className="gp-page-grid">
        {JOURNEY_FEATURES.map((feature) => (
          <AUCARD key={feature.title} className="loan-flow-card">
            <h3 className="gp-section__title">{feature.title}</h3>
            <p className="gp-section__description">{feature.description}</p>
          </AUCARD>
        ))}
      </div>

      <div className="gp-callout">
        <p>
          <strong>Unsaved form entries are not stored in this browser.</strong> Submit each step
          to the loan service and wait for confirmation before leaving the page.
        </p>
        {import.meta.env.DEV ? (
          <p>
            <button
              type="button"
              className="gp-text-link"
              onClick={() => navigate('/display-all-components-with-all-possible-props-and-combinations')}
            >
              Open the component playground (development only) →
            </button>
          </p>
        ) : null}
      </div>
    </div>
  );
}
