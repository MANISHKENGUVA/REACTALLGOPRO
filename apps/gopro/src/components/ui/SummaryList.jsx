import React from 'react';

// Read-only definition list. Values are rendered as text, never HTML.
export default function SummaryList({ items = [], label = '', compact = false, className = '' }) {
  if (!items.length) return null;
  return (
    <dl className={`gp-summary${compact ? ' gp-summary--tight' : ''} ${className}`.trim()} aria-label={label || undefined}>
      {items.map((item) => (
        <div className="gp-summary__row" key={item.label}>
          <dt>{item.label}</dt>
          <dd className={item.muted ? 'gp-summary__value--muted' : undefined}>
            {item.value ?? 'Not provided'}
          </dd>
        </div>
      ))}
    </dl>
  );
}
