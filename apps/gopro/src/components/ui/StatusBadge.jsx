import React from 'react';

const TONES = new Set(['neutral', 'success', 'warning', 'danger', 'info']);

// Status is always stated in text; the dot and colour are supplementary.
export default function StatusBadge({ tone = 'neutral', children, className = '' }) {
  const safeTone = TONES.has(tone) ? tone : 'neutral';
  return (
    <span className={`gp-badge gp-badge--${safeTone}${className ? ` ${className}` : ''}`}>
      <span className="gp-badge__dot" aria-hidden="true" />
      {children}
    </span>
  );
}
