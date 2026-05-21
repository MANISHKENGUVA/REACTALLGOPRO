import React, { useEffect, useState } from "react";

const VARIANTS = ["success", "error", "warning", "info", "alert"];

export default function AUTOAST({
  message,
  variant = "info",
  duration = 4000,
  onClose,
  position = "top-right",
  showCloseButton = true,
  className = "",
  ...rest
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const safeVariant = VARIANTS.includes(variant) ? variant : "info";
  const classes = [
    "au-toast",
    `au-toast--${safeVariant}`,
    `au-toast--${position}`,
    !isVisible && "au-toast--hidden",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} role="alert" {...rest}>
      <div className="au-toast__content">
        {message}
      </div>
      {showCloseButton && (
        <button
          className="au-toast__close"
          onClick={handleClose}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
}

// Toast Container Component
export function AUTOASTCONTAINER({ toasts, position = "top-right" }) {
  const classes = [
    "au-toast-container",
    `au-toast-container--${position}`
  ].join(" ");

  return (
    <div className={classes}>
      {toasts.map((toast, index) => (
        <AUTOAST
          key={toast.id || index}
          {...toast}
        />
      ))}
    </div>
  );
}