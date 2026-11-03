import React from "react";

const VARIANTS = ["linear", "circular", "dots", "spinner"];

export default function AUPROGRESS({
  variant = "linear",
  value = 0,
  max = 100,
  size = "medium",
  color = "primary",
  showValue = false,
  className = "",
  style = {},
  ...rest
}) {
  const safeVariant = VARIANTS.includes(variant) ? variant : "linear";
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const progressStyle = {
    ...style,
    "--au-progress-width": `${percentage}%`
  };

  const classes = [
    "au-progress",
    `au-progress--${safeVariant}`,
    `au-progress--${size}`,
    `au-progress--${color}`,
    className
  ].filter(Boolean).join(" ");

  if (safeVariant === "linear") {
    return (
      <div className={classes} style={progressStyle} {...rest}>
        <div className="au-progress__track">
          <div className="au-progress__bar" />
        </div>
        {showValue && (
          <span className="au-progress__value">{Math.round(percentage)}%</span>
        )}
      </div>
    );
  }

  if (safeVariant === "circular") {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={classes} {...rest}>
        <svg className="au-progress__circle" viewBox="0 0 50 50">
          <circle
            className="au-progress__circle-track"
            cx="25"
            cy="25"
            r={radius}
            strokeWidth="4"
            fill="none"
          />
          <circle
            className="au-progress__circle-bar"
            cx="25"
            cy="25"
            r={radius}
            strokeWidth="4"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 25 25)"
          />
        </svg>
        {showValue && (
          <span className="au-progress__value">{Math.round(percentage)}%</span>
        )}
      </div>
    );
  }

  if (safeVariant === "dots") {
    return (
      <div className={classes} {...rest}>
        <div className="au-progress__dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  if (safeVariant === "spinner") {
    return (
      <div className={classes} {...rest}>
        <div className="au-progress__spinner"></div>
      </div>
    );
  }

  return null;
}