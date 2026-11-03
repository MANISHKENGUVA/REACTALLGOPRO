import React from 'react';
import { AUBUTTON } from 'artiqui/dist/router-engine.es.js';

// Shared gate states. Every gate renders exactly one of these so the loading,
// failure, retry and cancellation wording stays consistent — and so a failure
// always keeps the user on the gate instead of navigating somewhere.

export function GateLoading({ title = 'Verifying…', description = '' }) {
  return (
    <div className="au-gate-state" role="status" aria-live="polite">
      <span className="au-gate-state__spinner" aria-hidden="true" />
      <p className="au-gate-state__title">{title}</p>
      {description ? <p className="au-gate-state__text">{description}</p> : null}
    </div>
  );
}

export function GateNotice({ tone = 'info', title, children }) {
  const role = tone === 'error' ? 'alert' : 'status';
  return (
    <div className={`au-gate-state au-gate-state--${tone}`} role={role} aria-live={tone === 'error' ? 'assertive' : 'polite'}>
      {title ? <p className="au-gate-state__title">{title}</p> : null}
      {children ? <div className="au-gate-state__text">{children}</div> : null}
    </div>
  );
}

export function GateActions({ onCancel, cancelLabel = 'Cancel', children, disabled = false }) {
  return (
    <div className="au-gate-actions">
      {children}
      {onCancel ? (
        <AUBUTTON variant="ghost" onClick={onCancel} disabled={disabled}>{cancelLabel}</AUBUTTON>
      ) : null}
    </div>
  );
}

export function GateError({ message, onRetry, retryLabel = 'Try again', onCancel, cancelLabel = 'Cancel', busy = false }) {
  return (
    <div className="au-gate-state au-gate-state--error" role="alert">
      <p className="au-gate-state__title">That did not work</p>
      <p className="au-gate-state__text">{message}</p>
      <GateActions onCancel={onCancel} cancelLabel={cancelLabel} disabled={busy}>
        {onRetry ? (
          <AUBUTTON variant="primary" onClick={onRetry} disabled={busy}>
            {busy ? 'Retrying…' : retryLabel}
          </AUBUTTON>
        ) : null}
      </GateActions>
    </div>
  );
}

export function GateUnavailable({ title, message, onRetry, retryLabel = 'Check again', onCancel, cancelLabel = 'Cancel', busy = false, children }) {
  return (
    <div className="au-gate-state au-gate-state--warning" role="status">
      <p className="au-gate-state__title">{title}</p>
      <p className="au-gate-state__text">{message}</p>
      {children}
      <GateActions onCancel={onCancel} cancelLabel={cancelLabel} disabled={busy}>
        {onRetry ? (
          <AUBUTTON variant="outline" onClick={onRetry} disabled={busy}>
            {busy ? 'Checking…' : retryLabel}
          </AUBUTTON>
        ) : null}
      </GateActions>
    </div>
  );
}
