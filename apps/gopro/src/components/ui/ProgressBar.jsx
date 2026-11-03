import React from 'react';

// Accessible meter. Pass `value` for a known percentage, or omit it for an
// indeterminate processing bar. The value is repeated as text next to it.
export default function ProgressBar({
  value = null,
  label = 'Progress',
  tone = 'primary',
  showValue = true,
  className = '',
}) {
  const bounded = Number.isFinite(Number(value))
    ? Math.min(100, Math.max(0, Math.round(Number(value))))
    : null;

  return (
    <div className={`gp-meter ${value === null ? 'gp-meter--indeterminate' : ''} ${className}`.trim()}>
      <div className="gp-meter__head">
        <span className="gp-meter__label">{label}</span>
        {showValue && bounded !== null ? <span className="gp-meter__value">{bounded}%</span> : null}
      </div>
      <div
        className={`gp-meter__track gp-meter__track--${tone}`}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={bounded ?? undefined}
        aria-valuetext={bounded === null ? 'Processing' : `${bounded}% complete`}
      >
        <span style={bounded === null ? undefined : { width: `${bounded}%` }} />
      </div>
    </div>
  );
}
