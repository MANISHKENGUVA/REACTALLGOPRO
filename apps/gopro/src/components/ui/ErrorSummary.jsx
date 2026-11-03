import React from 'react';

// Error summary for long forms. It appears after a failed submit, names every
// invalid field, and links to the control so keyboard users can jump straight
// to it. `items` is an array of { name, label, message }.
export default function ErrorSummary({ items = [], heading = 'Check the highlighted fields', id = 'gp-error-summary' }) {
  if (!items.length) return null;

  return (
    <div className="gp-error-summary" role="alert" aria-labelledby={`${id}-title`} tabIndex={-1} id={id}>
      <p className="gp-error-summary__title" id={`${id}-title`}>
        {heading}
      </p>
      <ul className="gp-error-summary__list">
        {items.map((item) => (
          <li key={item.name}>
            <a href={`#${item.name}`}>
              <span className="gp-error-summary__label">{item.label || item.name}</span>
              <span className="gp-error-summary__message">{item.message}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
