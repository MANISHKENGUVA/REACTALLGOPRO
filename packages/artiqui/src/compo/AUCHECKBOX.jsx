import React, { useEffect, useRef } from "react";

export default function AUCHECKBOX({
  id,
  label,
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  value,
  name,
  className = "",
  ...rest
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  function handleChange(event) {
    if (disabled) return;
    if (onChange) {
      onChange(event);
    }
  }

  return (
    <label className={["au-checkbox", disabled && "au-checkbox--disabled", className].filter(Boolean).join(" ")}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        value={value}
        {...rest}
      />
      <span className="au-checkbox__box">
        {checked ? <span className="au-checkbox__check">✓</span> : indeterminate ? <span className="au-checkbox__indeterminate">—</span> : null}
      </span>
      {label ? <span className="au-checkbox__label">{label}</span> : null}
    </label>
  );
}
