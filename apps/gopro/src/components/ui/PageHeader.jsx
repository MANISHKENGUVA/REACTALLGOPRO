import React from 'react';

export default function PageHeader({
  eyebrow = '',
  title,
  description = '',
  meta = null,
  actions = null,
  compact = false,
  className = '',
}) {
  return (
    <header className={`gp-page-header${compact ? ' gp-page-header--compact' : ''} ${className}`.trim()}>
      <div className="gp-page-header__text">
        {eyebrow ? <p className="gp-page-header__eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="gp-page-header__description">{description}</p> : null}
        {meta ? <div className="gp-page-header__meta">{meta}</div> : null}
      </div>
      {actions ? <div className="gp-page-header__actions">{actions}</div> : null}
    </header>
  );
}
