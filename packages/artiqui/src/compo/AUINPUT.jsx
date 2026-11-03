import React, { useState, useEffect, useId } from "react";

const INPUT_TYPES = ["text", "password", "email", "number", "tel", "url", "search"];
const REQUIRED_FALLBACK = "This field is required.";

export default function AUINPUT({
  id,
  label,
  type = "text",
  value,
  defaultValue = "",
  onChange,
  placeholder = "",
  error,
  errormessage,
  helperText,
  prefixIcon,
  suffixIcon,
  clearable = false,
  showPasswordToggle = false,
  disabled = false,
  required = false,
  className = "",
  name,
  ...rest
}) {
  const safeType = INPUT_TYPES.includes(type) ? type : "text";
  const generatedId = useId();
  const inputId = id ?? name ?? `au-input-${generatedId.replace(/:/g, "")}`;
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const [showPassword, setShowPassword] = useState(false);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = currentValue?.toString().length > 0;
  const showClear = clearable && !disabled && hasValue;
  const inlineError = typeof error === "string" ? error.trim() : "";
  const errorText = (typeof errormessage === "string" && errormessage.trim())
    || inlineError
    || (error ? REQUIRED_FALLBACK : "");
  const hasError = Boolean(error || errorText);
  const wrapperClasses = [
    "au-input",
    hasError && "au-input--error",
    disabled && "au-input--disabled",
    className
  ]
    .filter(Boolean)
    .join(" ");

  const describedBy = hasError
    ? `${inputId}-error`
    : helperText
      ? `${inputId}-helper`
      : undefined;

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
      {label ? (
        <label className="au-input__label" htmlFor={inputId}>
          {label}
          {required ? (
            <span className="au-required" aria-hidden="true"> *</span>
          ) : null}
          {required ? <span className="au-visually-hidden"> (required)</span> : null}
        </label>
      ) : null}

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
          placeholder={placeholder || ""}
          disabled={disabled}
          required={required}
          className="au-input__control"
          aria-invalid={hasError ? "true" : "false"}
          aria-required={required ? "true" : undefined}
          aria-describedby={describedBy}
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
        <div id={`${inputId}-helper`} className="au-input__helper">
          {helperText}
        </div>
      ) : null}

      {hasError ? (
        <div id={`${inputId}-error`} className="au-input__error">
          {errorText}
        </div>
      ) : null}
    </div>
  );
}
