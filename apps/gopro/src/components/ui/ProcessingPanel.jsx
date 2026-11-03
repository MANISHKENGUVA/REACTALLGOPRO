import React from 'react';

// Honest waiting state. There is no fabricated percentage: the browser does not
// know how far a server-side check has progressed, so the bar is indeterminate
// and the copy says who owns the result.
export default function ProcessingPanel({
  title = 'Processing',
  description = 'The loan service is working on this step.',
  steps = [],
  tone = 'info',
}) {
  return (
    <div className={`gp-processing gp-processing--${tone}`} role="status" aria-live="polite" aria-atomic="true">
      <div
        className="gp-processing__bar"
        role="progressbar"
        aria-label={title}
        aria-valuetext="In progress"
      />
      <div>
        <p className="gp-processing__title">{title}</p>
        {description ? <p className="gp-processing__text">{description}</p> : null}
      </div>
      {steps.length ? (
        <ul className="gp-processing__steps">
          {steps.map((step) => (
            <li className="gp-processing__step" key={typeof step === 'string' ? step : step.id}>
              {typeof step === 'string' ? step : step.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
