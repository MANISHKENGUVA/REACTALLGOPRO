import React from 'react';

// Consistent footer for forms: primary action left, secondary actions right on
// desktop and stacked full-width on small screens. `hint` explains why a button
// is disabled without inventing progress. Pages pass the primary action either
// through `primary` or as children; children are the fallback so a form can
// never render without its submit button.
export default function FormActions({ primary, secondary = null, hint = '', className = '', children }) {
  const primaryAction = primary ?? children;

  return (
    <div className={`gp-form-actions ${className}`.trim()}>
      <div className="gp-form-actions__primary">{primaryAction}</div>
      <div className="gp-form-actions__secondary">
        {hint ? <p className="gp-form-actions__hint">{hint}</p> : null}
        {secondary}
      </div>
    </div>
  );
}
