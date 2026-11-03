import React, { useState, useEffect, useId, useRef } from "react";

const REQUIRED_FALLBACK = "This field is required.";

export default function AUTEXTAREA({
  id,
  label,
  value,
  defaultValue = "",
  onChange,
  placeholder = "",
  error,
  helperText,
  maxLength,
  autoResize = true,
  charCount = false,
  disabled = false,
  required = false,
  className = "",
  name,
  ...rest
}) {
  const generatedId = useId();
  const textareaId = id ?? name ?? `au-textarea-${generatedId.replace(/:/g, "")}`;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const currentValue = isControlled ? value : internalValue;
  const textareaRef = useRef(null);
  const inlineError = typeof error === "string" ? error.trim() : "";
  const errorText = inlineError || (error ? REQUIRED_FALLBACK : "");
  const hasError = Boolean(errorText);
  const describedBy = hasError
    ? `${textareaId}-error`
    : helperText
      ? `${textareaId}-helper`
      : undefined;
  const wrapperClasses = [
    "au-textarea",
    hasError && "au-textarea--error",
    disabled && "au-textarea--disabled",
    className
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value);
    }
  }, [value, isControlled]);

  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currentValue, autoResize]);

  function handleChange(event) {
    const nextValue = event.target.value;
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    if (onChange) {
      onChange(event);
    }
  }

  const length = currentValue?.toString().length ?? 0;

  return (
    <div className={wrapperClasses}>
      {label ? (
        <label className="au-textarea__label" htmlFor={textareaId}>
          {label}
          {required ? <span className="au-required" aria-hidden="true"> *</span> : null}
          {required ? <span className="au-visually-hidden"> (required)</span> : null}
        </label>
      ) : null}

      <textarea
        id={textareaId}
        name={name}
        ref={textareaRef}
        className="au-textarea__control"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        required={required || undefined}
        aria-invalid={hasError ? "true" : "false"}
        aria-required={required ? "true" : undefined}
        aria-describedby={describedBy}
        {...rest}
      />

      <div className="au-textarea__meta">
        {helperText && !hasError ? (
          <div id={`${textareaId}-helper`} className="au-textarea__helper">
            {helperText}
          </div>
        ) : null}
        {hasError ? (
          <div id={`${textareaId}-error`} className="au-textarea__error">
            {errorText}
          </div>
        ) : null}
        {charCount && maxLength ? (
          <div className="au-textarea__counter">
            {length}/{maxLength}
          </div>
        ) : null}
      </div>
    </div>
  );
}
