import React, { useEffect, useRef } from 'react';
import Button from './Button';

// Native <dialog> so focus trapping, Escape handling and the top layer are
// browser-managed. The page owns the decision; this component only asks.
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="gp-dialog"
      aria-labelledby="gp-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel?.();
      }}
      onClose={() => {
        if (open && !busy) onCancel?.();
      }}
    >
      <div className="gp-dialog__panel">
        <h2 className="gp-dialog__title" id="gp-dialog-title">{title}</h2>
        <div className="gp-dialog__body">{children}</div>
        <div className="gp-dialog__actions">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>{cancelLabel}</Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={busy}
            loadingText="Please wait…"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
