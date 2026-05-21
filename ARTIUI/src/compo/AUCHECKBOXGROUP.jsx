import React from "react";
import AUCHECKBOX from "./AUCHECKBOX";

export default function AUCHECKBOXGROUP({
  options = [],
  value = [],
  onChange,
  disabled = false,
  label,
  layout = "vertical",
  className = "",
  name,
  ...rest
}) {
  function handleChange(event, optionValue) {
    const next = Array.isArray(value) ? [...value] : [];
    const index = next.indexOf(optionValue);
    if (index >= 0) {
      next.splice(index, 1);
    } else {
      next.push(optionValue);
    }
    if (onChange) {
      onChange({
        target: { value: next, name },
        currentTarget: { value: next, name }
      });
    }
  }

  return (
    <div className={["au-checkbox-group", `au-checkbox-group--${layout}`, className].filter(Boolean).join(" ")} {...rest}>
      {label ? <div className="au-checkbox-group__label">{label}</div> : null}
      <div className="au-checkbox-group__list">
        {options.map((option) => (
          <AUCHECKBOX
            key={option.value}
            id={`${name}-${option.value}`}
            name={name}
            label={option.label}
            checked={Array.isArray(value) && value.includes(option.value)}
            disabled={disabled || option.disabled}
            onChange={(event) => handleChange(event, option.value)}
            value={option.value}
          />
        ))}
      </div>
    </div>
  );
}
