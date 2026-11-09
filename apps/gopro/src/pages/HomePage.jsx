import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON } from 'artiqui/dist/router-engine.es.js';
import PageHeader from '../components/ui/PageHeader';
import StatusHero from '../components/ui/StatusHero';

const PREPARATION_ITEMS = [
  { title: 'Identity details', description: 'Personal and address information may be requested.' },
  { title: 'Income information', description: 'Have employment or business details available if asked.' },
  { title: 'Supporting documents', description: 'The application will tell you which documents are needed at each stage.' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="gp-page gp-page-stack gp-home">
      <PageHeader
        eyebrow="GOPRO loan application"
        title="Start your loan application"
        description="A guided application that securely collects the information needed for your request. The loan service determines each next step."
      />

      <section className="gp-home-start" aria-labelledby="gp-home-start-title">
        <div className="gp-home-start__copy">
          <span className="gp-home-start__eyebrow">Ready when you are</span>
          <h2 id="gp-home-start-title">Begin a new application</h2>
          <p>
            Your application is processed one step at a time. Submit each step to save it with the
            loan service; unsaved entries may be lost if you leave the page.
          </p>
        </div>
        <AUBUTTON variant="primary" onClick={() => navigate('/loan-flow/workflow')}>
          Start loan application
        </AUBUTTON>
      </section>

      <section className="gp-home-preparation" aria-labelledby="gp-home-preparation-title">
        <div className="gp-home-preparation__heading">
          <h2 id="gp-home-preparation-title">A little preparation helps</h2>
          <p>The service will guide you and request information only as it is needed.</p>
        </div>
        <ul className="gp-home-preparation__list">
          {PREPARATION_ITEMS.map((item) => (
            <li className="gp-home-preparation__item" key={item.title}>
              <span className="gp-home-preparation__marker" aria-hidden="true" />
              <span>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <aside className="gp-home-privacy" aria-label="Application privacy reminder">
        <StatusHero
          tone="info"
          icon="lock"
          title="Your information stays in the application flow"
          className="gp-home-privacy__hero"
        >
          <p>Submit each step and wait for confirmation before leaving. Unsaved entries are not stored in this browser.</p>
        </StatusHero>
      </aside>

      {import.meta.env.DEV ? (
        <p className="gp-home-dev-link">
          <button
            type="button"
            className="gp-text-link"
            onClick={() => navigate('/display-all-components-with-all-possible-props-and-combinations')}
          >
            Open the component playground (development only) <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="gp-text-link" onClick={() => navigate('/workflow-builder')}>
            Open Workflow Studio (local draft mode) <span aria-hidden="true">→</span>
          </button>
        </p>
      ) : null}
    </div>
  );
}
