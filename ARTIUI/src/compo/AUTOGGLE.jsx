import React from "react";

export default function AUTOGGLE({
  id,
  label,
  checked = false,
  activeLabel = "On",
  inactiveLabel = "Off",
  disabled = false,
  onChange,
  name,
  className = "",
  ...rest
}) {
  function handleChange(event) {
    if (disabled) return;
    if (onChange) {
      onChange(event);
    }
  }

  return (
    <label
      className={["au-toggle", disabled && "au-toggle--disabled", className]
        .filter(Boolean)
        .join(" ")}
      htmlFor={id}
    >
      <span className="au-toggle__labels">
        {label ? <span className="au-toggle__label">{label}</span> : null}
        <span className="au-toggle__state">{checked ? activeLabel : inactiveLabel}</span>
      </span>
      <span className="au-toggle__switch">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="au-toggle__input"
          {...rest}
        />
        <span className="au-toggle__slider" />
      </span>
    </label>
  );
}
