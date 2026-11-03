import React, { useEffect, useRef, useState } from "react";

const FOCUSABLE_SELECTORS = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

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
  const [render, setRender] = useState(isOpen);
  const modalRef = useRef(null);
  const lastActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      lastActiveElement.current = document.activeElement;
      setRender(true);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
      if (lastActiveElement.current instanceof HTMLElement) {
        lastActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && render) {
      const timeout = setTimeout(() => setRender(false), 240);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [isOpen, render]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(FOCUSABLE_SELECTORS);
      if (focusable.length) {
        focusable[0].focus();
      } else {
        modalRef.current.focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (!isOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Tab" && modalRef.current) {
        const focusable = Array.from(modalRef.current.querySelectorAll(FOCUSABLE_SELECTORS));
        if (focusable.length === 0) return;
        const currentIndex = focusable.indexOf(document.activeElement);
        const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
        if (nextIndex >= focusable.length) {
          event.preventDefault();
          focusable[0].focus();
        } else if (nextIndex < 0) {
          event.preventDefault();
          focusable[focusable.length - 1].focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!render) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const classes = [
    "au-modal",
    `au-modal--${size}`,
    isOpen ? "au-modal--open" : "au-modal--closing",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="au-modal-overlay" onClick={handleBackdropClick} role="presentation" {...rest}>
      <div
        ref={modalRef}
        className={classes}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "au-modal-title" : undefined}
        tabIndex={-1}
      >
        {(title || showCloseButton) && (
          <div className="au-modal__header">
            {title && <h2 id="au-modal-title" className="au-modal__title">{title}</h2>}
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

        <div className="au-modal__body">{children}</div>

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
