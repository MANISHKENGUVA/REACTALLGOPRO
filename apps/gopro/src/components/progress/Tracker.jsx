import React from 'react';
import { StageIcon } from '../ui/Icons';

// Renders the projection returned by buildLoanProgress. It never receives or
// invents a target step, so stages are informational, not navigation. Every
// state is written in words; colour and iconography only reinforce it.
export default function Tracker({ progress, variant = 'sidebar', showHead = true }) {
  const compact = variant === 'compact';

  if (!progress) {
    return (
      <div className={`gp-tracker gp-tracker--unknown${compact ? ' gp-tracker--compact' : ''}`} role="status">
        <p>Waiting for the loan service to confirm your current step.</p>
      </div>
    );
  }

  const meterTone = progress.tone === 'success'
    ? 'success'
    : progress.tone === 'danger'
      ? 'danger'
      : progress.tone === 'warning'
        ? 'warning'
        : '';

  return (
    <nav
      className={`gp-tracker${compact ? ' gp-tracker--compact' : ''}`}
      aria-label={`${progress.actorLabel || 'Application'} journey`}
    >
      {showHead ? (
        <div className="gp-tracker__head">
          <div
            className={`gp-tracker__meter${meterTone ? ` gp-tracker__meter--${meterTone}` : ''}`}
            role="progressbar"
            aria-label="Journey position"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress.percent}
            aria-valuetext={progress.known
              ? `Step ${progress.currentIndex + 1} of ${progress.total}, ${progress.statusLabel}`
              : `Current step not mapped, ${progress.statusLabel}`}
            style={{ '--gp-meter-value': `${progress.percent}%` }}
          >
            <span aria-hidden="true" />
          </div>
          <p className="gp-tracker__meta">
            {progress.known
              ? `${progress.completed} of ${progress.total} stages completed`
              : 'Journey position will appear when the service confirms a step'}
          </p>
        </div>
      ) : null}

      <ol className="gp-tracker__list">
        {progress.stages.map((stage) => (
          <li
            className={`gp-tracker__item gp-tracker__item--${stage.state}`}
            key={stage.id}
            aria-current={stage.active ? 'step' : undefined}
          >
            <span className="gp-tracker__marker" aria-hidden="true">
              <StageIcon stageId={stage.id} state={stage.state} />
            </span>
            <span className="gp-tracker__body">
              <span className="gp-tracker__label">{stage.label}</span>
              <span className="gp-tracker__state">
                {stage.stateLabel}
                <span className="gp-visually-hidden">{`: ${stage.description}`}</span>
              </span>
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
