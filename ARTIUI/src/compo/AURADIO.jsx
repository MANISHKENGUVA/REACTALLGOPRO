import React from "react";

export default function AURADIO({
  id,
  label,
  checked = false,
  disabled = false,
  onChange,
  value,
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
    <label className={["au-radio", disabled && "au-radio--disabled", className].filter(Boolean).join(" ")}>
      <input
        id={id}
        name={name}
        type="radio"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        value={value}
        {...rest}
      />
      <span className="au-radio__circle">{checked ? <span className="au-radio__dot" /> : null}</span>
      {label ? <span className="au-radio__label">{label}</span> : null}
    </label>
  );
}
