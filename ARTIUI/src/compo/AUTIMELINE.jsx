import React from "react";

export default function AUTIMELINE({
  items = [],
  orientation = "vertical",
  className = "",
  ...rest
}) {
  const classes = [
    "au-timeline",
    `au-timeline--${orientation}`,
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} {...rest}>
      {items.map((item, index) => {
        const itemClasses = [
          "au-timeline__item",
          item.status && `au-timeline__item--${item.status}`
        ].filter(Boolean).join(" ");

        return (
          <div key={item.id || index} className={itemClasses}>
            <div className="au-timeline__indicator">
              {item.icon ? (
                <span className="au-timeline__icon">{item.icon}</span>
              ) : (
                <span className="au-timeline__dot" />
              )}
            </div>

            <div className="au-timeline__content">
              <div className="au-timeline__title">{item.title}</div>
              {item.description && (
                <div className="au-timeline__description">{item.description}</div>
              )}
              {item.timestamp && (
                <div className="au-timeline__timestamp">{item.timestamp}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}