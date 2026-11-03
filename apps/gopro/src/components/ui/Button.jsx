import React from 'react';
import { AUBUTTON } from 'artiqui/dist/router-engine.es.js';

// Shared action primitive. AUBUTTON owns the interaction/spinner behaviour;
// GOPRO supplies a single set of variants and a minimum touch target through
// the application stylesheet. No page builds its own button classes.
const ALLOWED_VARIANTS = new Set(['primary', 'secondary', 'outline', 'ghost', 'danger', 'link']);

export default function Button({
  variant = 'primary',
  className = '',
  size = 'md',
  children,
  ...rest
}) {
  return (
    <AUBUTTON
      variant={ALLOWED_VARIANTS.has(variant) ? variant : 'primary'}
      className={[`gp-button--${size}`, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </AUBUTTON>
  );
}
