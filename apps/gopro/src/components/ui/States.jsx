import React from 'react';
import { Icon } from './Icons';
import Button from './Button';

export function LoadingState({ title = 'Loading', description = '', inline = false }) {
  return (
    <div className={`gp-loading${inline ? ' gp-loading--inline' : ''}`} role="status" aria-live="polite">
      <span className="gp-loading__spinner" aria-hidden="true" />
      <div>
        <p className="gp-loading__title">{title}</p>
        {description ? <p className="gp-loading__text">{description}</p> : null}
      </div>
    </div>
  );
}

export function EmptyState({ title, description = '', action = null, icon = 'file' }) {
  return (
    <div className="gp-empty" role="status">
      <span className="gp-empty__icon" aria-hidden="true"><Icon name={icon} size={22} /></span>
      <p className="gp-empty__title">{title}</p>
      {description ? <p className="gp-empty__text">{description}</p> : null}
      {action ? <div className="gp-empty__action">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = '',
  onRetry = null,
  retryLabel = 'Try again',
  children = null,
}) {
  return (
    <div className="gp-error-state" role="alert">
      <span className="gp-error-state__icon" aria-hidden="true"><Icon name="alert" size={22} /></span>
      <div className="gp-error-state__body">
        <p className="gp-error-state__title">{title}</p>
        {description ? <p className="gp-error-state__text">{description}</p> : null}
        {children}
        {onRetry ? (
          <div className="gp-error-state__actions">
            <Button variant="secondary" onClick={onRetry} leftIcon={<Icon name="refresh" size={15} />}>
              {retryLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
