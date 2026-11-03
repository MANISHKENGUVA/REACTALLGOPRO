import React from "react";

const VARIANTS = ["primary", "secondary", "outline", "ghost", "danger", "gradient", "link"];

export default function AUBUTTON({
  children,
  variant = "primary",
  loading = false,
  loadingText = "Loading",
  disabled = false,
  leftIcon,
  rightIcon,
  rounded = false,
  onClick,
  type = "button",
  className = "",
  ...rest
}) {
  const isDisabled = disabled || loading;
  const safeVariant = VARIANTS.includes(variant) ? variant : "primary";
  const classes = [
    "au-button",
    `au-button--${safeVariant}`,
    rounded && "au-button--rounded",
    loading && "au-button--loading",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading ? "true" : undefined}
      {...rest}
    >
      {loading ? (
        <>
          <span className="au-button__spinner" aria-hidden="true" />
          <span className="au-button__label">{loadingText}</span>
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="au-button__icon au-button__icon--left">
              {leftIcon}
            </span>
          )}
          <span className="au-button__label">{children}</span>
          {rightIcon && (
            <span className="au-button__icon au-button__icon--right">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
}
