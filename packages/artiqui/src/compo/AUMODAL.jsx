import React, { useEffect, useId, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function AUMODAL({
  isOpen,
  onClose = () => {},
  title,
  children,
  footer,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  showCloseButton = true,
  size = "medium",
  className = "",
  ...rest
}) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusInitial = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll(FOCUSABLE);
      (focusable[0] || dialog).focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = [...dialog.querySelectorAll(FOCUSABLE)];
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusInitial);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const classes = ["au-modal", `au-modal--${size}`, className].filter(Boolean).join(" ");

  return (
    <div className="au-modal-overlay" onClick={handleBackdropClick} {...rest}>
      <div
        ref={dialogRef}
        className={classes}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "Dialog"}
        tabIndex={-1}
      >
        {(title || showCloseButton) && (
          <div className="au-modal__header">
            {title && <h2 id={titleId} className="au-modal__title">{title}</h2>}
            {showCloseButton && (
              <button
                type="button"
                className="au-modal__close"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
        )}

        <div className="au-modal__body">{children}</div>

        {footer || onConfirm ? (
          <div className="au-modal__footer">
            {footer || (
              <>
                <button type="button" className="au-button au-button--secondary" onClick={onClose}>
                  {cancelText}
                </button>
                <button type="button" className="au-button au-button--primary" onClick={onConfirm}>
                  {confirmText}
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
