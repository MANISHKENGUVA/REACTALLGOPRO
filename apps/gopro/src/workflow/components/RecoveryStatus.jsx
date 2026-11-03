import React from 'react';
import { factorLabel, nextFactor } from '../recoveryGates';

// RecoveryStatus: what the backend is asking for, in which order, and how far
// the user has got. The order comes from the backend plan — never from here.
export default function RecoveryStatus({ factors = [], completed = [], workflowId = '', busyLabel = '' }) {
  const active = nextFactor(factors, completed);
  if (!factors.length) return null;

  const total = factors.length;
  const done = factors.filter((factor) => completed.includes(factor.id)).length;
  const currentIndex = active ? factors.findIndex((factor) => factor.id === active.id) : total;

  return (
    <div className="au-gate-progress">
      <p className="au-gate-progress__step" role="status" aria-live="polite">
        {busyLabel || (active
          ? `Step ${currentIndex + 1} of ${total}: ${factorLabel(active.kind)}`
          : `All ${total} verification steps completed`)}
      </p>
      <ol className="au-gate-progress__list" aria-label="Required verification steps">
        {factors.map((factor, index) => {
          const isDone = completed.includes(factor.id);
          const isCurrent = !isDone && active?.id === factor.id;
          const state = isDone ? 'completed' : isCurrent ? 'current' : 'pending';
          return (
            <li
              key={factor.id}
              className={`au-gate-progress__item au-gate-progress__item--${state}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className="au-gate-progress__marker" aria-hidden="true">{isDone ? '✓' : index + 1}</span>
              <span className="au-gate-progress__label">{factorLabel(factor.kind)}</span>
              <span className="au-visually-hidden">
                {isDone ? ' — completed' : isCurrent ? ' — current step' : ' — pending'}
              </span>
            </li>
          );
        })}
      </ol>
      {done > 0 ? <p className="au-gate-progress__note">{`${done} of ${total} verifications confirmed by the service.`}</p> : null}
      {workflowId ? (
        <p className="au-gate-progress__note">{`Your application ${workflowId} stays the same.`}</p>
      ) : null}
    </div>
  );
}
