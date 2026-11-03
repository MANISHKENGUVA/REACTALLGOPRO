import React from "react";
import AURADIO from "./AURADIO";

export default function AURADIOGROUP({
  options = [],
  value,
  onChange,
  disabled = false,
  label,
  layout = "vertical",
  className = "",
  name,
  ...rest
}) {
  function handleChange(event, optionValue) {
    if (onChange) {
      onChange({
        target: { value: optionValue, name },
        currentTarget: { value: optionValue, name }
      });
    }
  }

  return (
    <div className={["au-radio-group", `au-radio-group--${layout}`, className].filter(Boolean).join(" ")} {...rest}>
      {label ? <div className="au-radio-group__label">{label}</div> : null}
      <div className="au-radio-group__list">
        {options.map((option) => (
          <AURADIO
            key={option.value}
            id={`${name}-${option.value}`}
            name={name}
            label={option.label}
            checked={value === option.value}
            disabled={disabled || option.disabled}
            onChange={(event) => handleChange(event, option.value)}
            value={option.value}
          />
        ))}
      </div>
    </div>
  );
}
