import React from 'react';
import { Icon } from '../ui/Icons';
import Tracker from './Tracker';

// Mobile progress summary. It is a disclosure, not a second tracker: the body
// renders the same projection object as the desktop sidebar.
export default function MobileProgress({ progress, workflowId = '' }) {
  const step = progress?.currentLabel || progress?.headline || 'Waiting for the loan service';
  const statusLabel = progress?.statusLabel || 'Checking status';

  return (
    <details className="gp-mobile-progress">
      <summary>
        <span className="gp-mobile-progress__text">
          <span className="gp-mobile-progress__eyebrow">
            {progress?.actorLabel ? `${progress.actorLabel} progress` : 'Application progress'}
          </span>
          <span className="gp-mobile-progress__step">{step}</span>
          <span className="gp-mobile-progress__status">
            {statusLabel}
            {workflowId ? <span className="gp-mobile-progress__id">{workflowId}</span> : null}
          </span>
        </span>
        <span className="gp-mobile-progress__aside" aria-hidden="true">
          {progress ? <span className="gp-mobile-progress__percent">{progress.percent}%</span> : null}
          <Icon name="chevronDown" size={18} className="gp-mobile-progress__chevron" />
        </span>
      </summary>
      <div className="gp-mobile-progress__body">
        <Tracker progress={progress} variant="compact" />
      </div>
    </details>
  );
}
