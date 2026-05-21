import React, { useState, useEffect, useRef } from "react";

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
  className = "",
  name,
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const currentValue = isControlled ? value : internalValue;
  const textareaRef = useRef(null);
  const wrapperClasses = [
    "au-textarea",
    error && "au-textarea--error",
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
        <label className="au-textarea__label" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <textarea
        id={id}
        name={name}
        ref={textareaRef}
        className="au-textarea__control"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={
          error ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        {...rest}
      />

      <div className="au-textarea__meta">
        {helperText && !error ? (
          <div id={id ? `${id}-helper` : undefined} className="au-textarea__helper">
            {helperText}
          </div>
        ) : null}
        {error ? (
          <div id={id ? `${id}-error` : undefined} className="au-textarea__error">
            {error}
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
