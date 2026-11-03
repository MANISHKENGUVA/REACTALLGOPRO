import React from 'react';

// Generic surface primitive. `as` lets a page keep the semantic element it
// needs (section, article, form) without losing the shared card styling.
export default function Card({ children, className = '', as = 'div', ...rest }) {
  return React.createElement(
    as,
    { className: `gp-card ${className}`.trim(), ...rest },
    children,
  );
}
