import React from 'react';

// A labelled group inside a form. Headings are h2 so they follow the page h1
// without skipping a level; pages that embed a section under another section
// can pass `level={3}`.
export default function FormSection({
  title,
  description = '',
  actions = null,
  level = 2,
  className = '',
  children,
}) {
  const Heading = `h${level}`;
  return (
    <section className={`gp-section${className ? ` ${className}` : ''}`}>
      {title || description || actions ? (
        <div className="gp-section__header">
          <div>
            {title ? <Heading className="gp-section__title">{title}</Heading> : null}
            {description ? <p className="gp-section__description">{description}</p> : null}
          </div>
          {actions ? <div className="gp-section__actions">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
