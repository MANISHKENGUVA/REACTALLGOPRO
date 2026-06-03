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
  showPasswordToggle = false,
  disabled = false,
  className = "",
  name,
  ...rest
}) {
  const safeType = INPUT_TYPES.includes(type) ? type : "text";
  const inputId = id ?? name ?? "au-input";
  const hasLabel = Boolean(label);
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = currentValue?.toString().length > 0;
  const showClear = clearable && !disabled && hasValue;
  const hasError = Boolean(error);
  const wrapperClasses = [
    "au-input",
    hasLabel && "au-input--has-label",
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

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  return (
    <div className={wrapperClasses}>
      <div className="au-input__field">
        {prefixIcon ? (
          <div className="au-input__adornment au-input__adornment--prefix">
            {prefixIcon}
          </div>
        ) : null}

        <input
          id={inputId}
          name={name}
          type={safeType === "password" && showPassword ? "text" : safeType}
          value={currentValue}
          onChange={handleChange}
          placeholder={hasLabel ? "" : placeholder || ""}
          disabled={disabled}
          className="au-input__control"
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {label ? (
          <label
            className={`au-input__floating-label ${isFocused || hasValue ? "au-input__floating-label--active" : ""}`}
            htmlFor={inputId}
          >
            {label}
          </label>
        ) : null}

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

        {showPasswordToggle && safeType === "password" ? (
          <button
            type="button"
            className="au-input__visibility"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        ) : null}

        {suffixIcon ? (
          <div className="au-input__adornment au-input__adornment--suffix">
            {suffixIcon}
          </div>
        ) : null}
      </div>

      {helperText && !hasError ? (
        <div id={inputId ? `${inputId}-helper` : undefined} className="au-input__helper">
          {helperText}
        </div>
      ) : null}

      {hasError ? (
        <div id={inputId ? `${inputId}-error` : undefined} className="au-input__error">
          {error}
        </div>
      ) : null}
    </div>
  );
}
