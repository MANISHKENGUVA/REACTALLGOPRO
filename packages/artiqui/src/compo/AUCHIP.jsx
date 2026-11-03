import React from "react";

export default function AUCHIP({
  children,
  variant = "default",
  size = "medium",
  closable = false,
  selectable = false,
  selected = false,
  onClose,
  onClick,
  className = "",
  ...rest
}) {
  const handleClose = (e) => {
    e.stopPropagation();
    onClose?.();
  };

  const handleClick = () => {
    if (selectable) {
      onClick?.();
    }
  };

  const classes = [
    "au-chip",
    `au-chip--${variant}`,
    `au-chip--${size}`,
    selectable && "au-chip--selectable",
    selected && "au-chip--selected",
    className
  ].filter(Boolean).join(" ");

  return (
    <span
      className={classes}
      onClick={handleClick}
      role={selectable ? "button" : undefined}
      tabIndex={selectable ? 0 : undefined}
      {...rest}
    >
      <span className="au-chip__content">{children}</span>
      {closable && (
        <button
          className="au-chip__close"
          onClick={handleClose}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}