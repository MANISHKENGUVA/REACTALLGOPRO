import React from 'react';
import { Icon } from './Icons';

const ICONS = {
  info: 'info',
  success: 'check',
  warning: 'alert',
  error: 'alert',
};

// One alert primitive for page-level and form-level messages. Errors are live
// alerts; progress/success messages use status so they do not interrupt.
export default function InlineAlert({
  tone = 'info',
  title = '',
  children = null,
  className = '',
  live,
}) {
  const safeTone = Object.prototype.hasOwnProperty.call(ICONS, tone) ? tone : 'info';
  const role = live ?? (safeTone === 'error' ? 'alert' : 'status');

  return (
    <div className={`gp-alert gp-alert--${safeTone}${className ? ` ${className}` : ''}`} role={role}>
      <span className="gp-alert__icon" aria-hidden="true">
        <Icon name={ICONS[safeTone]} size={16} />
      </span>
      <div className="gp-alert__content">
        {title ? <p className="gp-alert__title">{title}</p> : null}
        {children ? <div className="gp-alert__body">{children}</div> : null}
      </div>
    </div>
  );
}
