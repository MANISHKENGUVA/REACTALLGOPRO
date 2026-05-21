import React, { useState, useEffect } from "react";

const INPUT_TYPES = ["text", "password", "email", "number"];

export default function AUINPUT({
  id,
  label,
  type = "text",
  value,
  defaultValue = "",
  onChange,
  placeholder = "",
  error,
  helperText,
  prefixIcon,
  suffixIcon,
  clearable = false,
  disabled = false,
  className = "",
  name,
  ...rest
}) {
  const safeType = INPUT_TYPES.includes(type) ? type : "text";
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const showClear = clearable && !disabled && currentValue?.toString().length > 0;
  const hasError = Boolean(error);
  const wrapperClasses = [
    "au-input",
    hasError && "au-input--error",
    disabled && "au-input--disabled",
    className
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value);
    }
  }, [value, isControlled]);

  function handleChange(event) {
    const nextValue = event.target.value;
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    if (onChange) {
      onChange(event);
    }
  }

  function handleClear() {
    if (!disabled) {
      if (!isControlled) {
        setInternalValue("");
      }
      if (onChange) {
        const syntheticEvent = {
          target: { value: "", name },
          currentTarget: { value: "", name },
          nativeEvent: null,
          preventDefault: () => {},
          stopPropagation: () => {}
        };
        onChange(syntheticEvent);
      }
    }
  }

  return (
    <div className={wrapperClasses}>
      {label ? (
        <label className="au-input__label" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <div className="au-input__field">
        {prefixIcon ? (
          <div className="au-input__adornment au-input__adornment--prefix">
            {prefixIcon}
          </div>
        ) : null}

        <input
          id={id}
          name={name}
          type={safeType}
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="au-input__control"
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...rest}
        />

        {showClear ? (
          <button
            type="button"
            className="au-input__clear"
            onClick={handleClear}
            aria-label="Clear input"
          >
            ×
          </button>
        ) : null}

        {suffixIcon ? (
          <div className="au-input__adornment au-input__adornment--suffix">
            {suffixIcon}
          </div>
        ) : null}
      </div>

      {helperText && !hasError ? (
        <div id={id ? `${id}-helper` : undefined} className="au-input__helper">
          {helperText}
        </div>
      ) : null}

      {hasError ? (
        <div id={id ? `${id}-error` : undefined} className="au-input__error">
          {error}
        </div>
      ) : null}
    </div>
  );
}
