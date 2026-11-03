import React from 'react';
import { Icon } from './Icons';

const MARKS = {
  success: 'check',
  danger: 'alert',
  warning: 'alert',
  info: 'info',
  neutral: 'minus',
};

// Terminal / outcome panel. The mark is decorative; the heading and body carry
// the meaning. Actions are supplied by the page so no navigation is invented.
// `icon` overrides the tone mark (for example a lock or logout glyph); `meta`
// carries non-outcome context such as a requested application id.
export default function StatusHero({
  tone = 'info',
  title,
  children,
  mark,
  icon,
  meta = null,
  actions = null,
  className = '',
}) {
  const safeTone = Object.prototype.hasOwnProperty.call(MARKS, tone) ? tone : 'info';
  return (
    <section className={`gp-status-hero gp-status-hero--${safeTone}${className ? ` ${className}` : ''}`}>
      <span className="gp-status-hero__mark" aria-hidden="true">
        {mark || <Icon name={icon || MARKS[safeTone]} size={24} />}
      </span>
      <div className="gp-status-hero__body">
        <h2 className="gp-status-hero__title">{title}</h2>
        {children ? <div className="gp-status-hero__text">{children}</div> : null}
        {meta ? <div className="gp-status-hero__meta">{meta}</div> : null}
        {actions ? <div className="gp-status-hero__actions">{actions}</div> : null}
      </div>
    </section>
  );
}
