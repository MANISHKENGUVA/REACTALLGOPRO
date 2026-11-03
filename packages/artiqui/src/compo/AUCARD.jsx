import React from "react";

export default function AUCARD({
  title,
  description,
  footer,
  children,
  className = "",
  style = {},
  ...rest
}) {
  const classes = ["au-card", className].filter(Boolean).join(" ");

  return (
    <div className={classes} style={style} {...rest}>
      {(title || description) && (
        <div className="au-card__header">
          {title && <h2 className="au-card__title">{title}</h2>}
          {description && <p className="au-card__description">{description}</p>}
        </div>
      )}

      <div className="au-card__body">{children}</div>

      {footer && <div className="au-card__footer">{footer}</div>}
    </div>
  );
}
