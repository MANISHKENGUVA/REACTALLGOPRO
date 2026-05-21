import React, { useEffect } from "react";

export default function AUMODAL({
  isOpen,
  onClose,
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
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const classes = [
    "au-modal",
    `au-modal--${size}`,
    className
  ].filter(Boolean).join(" ");

  return (
    <div className="au-modal-overlay" onClick={handleBackdropClick} {...rest}>
      <div className={classes} role="dialog" aria-modal="true">
        {(title || showCloseButton) && (
          <div className="au-modal__header">
            {title && <h2 className="au-modal__title">{title}</h2>}
            {showCloseButton && (
              <button
                className="au-modal__close"
                onClick={onClose}
                aria-label="Close modal"
              >
                ×
              </button>
            )}
          </div>
        )}

        <div className="au-modal__body">
          {children}
        </div>

        {footer || onConfirm ? (
          <div className="au-modal__footer">
            {footer || (
              <>
                <button
                  className="au-button au-button--secondary"
                  onClick={onClose}
                >
                  {cancelText}
                </button>
                <button
                  className="au-button au-button--primary"
                  onClick={onConfirm}
                >
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