import React, { useState } from "react";

export default function AUMENU({
  items = [],
  className = "",
  ...rest
}) {
  const classes = [
    "au-menu",
    className
  ].filter(Boolean).join(" ");

  const renderMenuItem = (item, index) => {
    if (item.divider) {
      return <div key={index} className="au-menu__divider" />;
    }

    if (item.checkbox) {
      return (
        <label key={item.id || index} className="au-menu__item au-menu__item--checkbox">
          <input
            type="checkbox"
            checked={item.checked || false}
            onChange={item.onChange}
          />
          <span className="au-menu__item-label">{item.label}</span>
        </label>
      );
    }

    if (item.radio) {
      return (
        <label key={item.id || index} className="au-menu__item au-menu__item--radio">
          <input
            type="radio"
            name={item.name}
            value={item.value}
            checked={item.checked || false}
            onChange={item.onChange}
          />
          <span className="au-menu__item-label">{item.label}</span>
        </label>
      );
    }

    if (item.children) {
      return (
        <AUMENUDROPDOWN
          key={item.id || index}
          trigger={item.label}
          items={item.children}
          icon={item.icon}
        />
      );
    }

    return (
      <button
        key={item.id || index}
        className={`au-menu__item ${item.active ? 'au-menu__item--active' : ''}`}
        onClick={item.onClick}
        disabled={item.disabled}
      >
        {item.icon && <span className="au-menu__item-icon">{item.icon}</span>}
        <span className="au-menu__item-label">{item.label}</span>
        {item.badge && <span className="au-menu__item-badge">{item.badge}</span>}
      </button>
    );
  };

  return (
    <div className={classes} {...rest}>
      {items.map(renderMenuItem)}
    </div>
  );
}

export function AUMENUDROPDOWN({
  trigger,
  items = [],
  position = "bottom-left",
  icon,
  className = "",
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  const classes = [
    "au-menu-dropdown",
    `au-menu-dropdown--${position}`,
    isOpen && "au-menu-dropdown--open",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} {...rest}>
      <button
        className="au-menu-dropdown__trigger"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon && <span className="au-menu-dropdown__trigger-icon">{icon}</span>}
        <span className="au-menu-dropdown__trigger-label">{trigger}</span>
        <span className="au-menu-dropdown__trigger-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="au-menu-dropdown__menu">
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="au-menu__divider" />;
            }

            return (
              <button
                key={item.id || index}
                className={`au-menu__item ${item.active ? 'au-menu__item--active' : ''}`}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
              >
                {item.icon && <span className="au-menu__item-icon">{item.icon}</span>}
                <span className="au-menu__item-label">{item.label}</span>
                {item.badge && <span className="au-menu__item-badge">{item.badge}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}