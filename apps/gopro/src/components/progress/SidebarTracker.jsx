import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icons';
import Tracker from './Tracker';

const ACTOR_LABELS = {
  BORROWER: 'Borrower application',
  COBORROWER: 'Co-borrower application',
  LENDER: 'Lender processing',
  MANAGER: 'Credit manager review',
};

const STATUS_TONE = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  neutral: 'neutral',
};

// Desktop sidebar: one summary card, one progress meter and one stage list.
// The same `progress` object feeds the mobile disclosure, so the two never
// disagree about where the application is.
export default function SidebarTracker({ progress, workflowId = '', actor = '' }) {
  const step = progress?.currentLabel || progress?.headline || 'Waiting for the loan service';
  const statusLabel = progress?.statusLabel || 'Checking status';
  const tone = STATUS_TONE[progress?.tone] || 'neutral';
  const eyebrow = ACTOR_LABELS[actor] || progress?.actorLabel || 'Loan application';

  return (
    <div className="gp-sidebar__stack">
      <section className="gp-summary-card" aria-labelledby="gp-summary-step">
        <p className="gp-summary-card__eyebrow">{eyebrow}</p>
        <p className="gp-summary-card__step" id="gp-summary-step">{step}</p>
        <p className="gp-summary-card__meta">
          {workflowId ? (
            <>
              <span>Application</span>
              <span className="gp-summary-card__id" title={workflowId}>{workflowId}</span>
            </>
          ) : (
            <span>Application identity is confirmed by the loan service.</span>
          )}
        </p>
        <p className={`gp-summary-card__status gp-summary-card__status--${tone}`}>
          <span className="gp-summary-card__status-dot" aria-hidden="true" />
          <span>{statusLabel}</span>
        </p>
      </section>

      <section className="gp-progress-panel" aria-labelledby="gp-progress-title">
        <div className="gp-progress-panel__head">
          <p className="gp-progress-panel__title" id="gp-progress-title">Your application</p>
          {progress ? (
            <span className="gp-progress-panel__count">{progress.percent}%</span>
          ) : null}
        </div>
        <Tracker progress={progress} />
        <p className="gp-progress-panel__source">
          {progress?.known
            ? 'Projected from the step the loan service last confirmed.'
            : 'The tracker updates after the loan service confirms a step.'}
        </p>
      </section>

      <section className="gp-help-card" aria-labelledby="gp-help-title">
        <p className="gp-help-card__title" id="gp-help-title">Need a hand?</p>
        <p className="gp-help-card__text">
          Each submitted step is saved by the loan service. If a page will not open,
          return to the application hub to re-check your current step.
        </p>
        <Link className="gp-help-card__link" to="/loan-flow/workflow">
          Open application hub
          <Icon name="arrowRight" size={14} />
        </Link>
      </section>
    </div>
  );
}
