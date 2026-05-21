import React, { useState, useEffect } from "react";

const MODE_TYPE = {
  date: "date",
  datetime: "datetime-local",
  time: "time"
};

export default function AUDATEPICKER({
  id,
  label,
  mode = "date",
  value,
  startValue,
  endValue,
  defaultValue = "",
  defaultStartValue = "",
  defaultEndValue = "",
  onChange,
  placeholder = "",
  error,
  helperText,
  disabled = false,
  className = "",
  name,
  ...rest
}) {
  const isRange = mode === "range";
  const isControlled = value !== undefined || startValue !== undefined || endValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalStart, setInternalStart] = useState(defaultStartValue);
  const [internalEnd, setInternalEnd] = useState(defaultEndValue);

  const currentValue = isRange
    ? {
        start: startValue ?? internalStart,
        end: endValue ?? internalEnd
      }
    : value ?? internalValue;

  useEffect(() => {
    if (isControlled && !isRange && value !== undefined) {
      setInternalValue(value);
    }
    if (isControlled && isRange) {
      if (startValue !== undefined) setInternalStart(startValue);
      if (endValue !== undefined) setInternalEnd(endValue);
    }
  }, [isControlled, mode, value, startValue, endValue]);

  function handleSingleChange(event) {
    const nextValue = event.target.value;
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    if (onChange) {
      onChange({ target: { value: nextValue, name }, currentTarget: { value: nextValue, name } });
    }
  }

  function handleRangeChange(type) {
    return (event) => {
      const next = { ...currentValue, [type]: event.target.value };
      if (!isControlled) {
        if (type === "start") setInternalStart(next.start);
        if (type === "end") setInternalEnd(next.end);
      }
      if (onChange) {
        onChange({ target: { value: next, name }, currentTarget: { value: next, name } });
      }
    };
  }

  const wrapperClasses = [
    "au-datepicker",
    error && "au-datepicker--error",
    disabled && "au-datepicker--disabled",
    className
  ]
    .filter(Boolean)
    .join(" ");

  const inputType = MODE_TYPE[mode] || "date";

  return (
    <div className={wrapperClasses}>
      {label ? <label className="au-datepicker__label" htmlFor={id}>{label}</label> : null}

      {isRange ? (
        <div className="au-datepicker__range">
          <input
            id={`${id}-start`}
            name={name}
            type="date"
            value={currentValue.start}
            onChange={handleRangeChange("start")}
            disabled={disabled}
            className="au-datepicker__control"
            {...rest}
          />
          <span className="au-datepicker__range-separator">to</span>
          <input
            id={`${id}-end`}
            name={name}
            type="date"
            value={currentValue.end}
            onChange={handleRangeChange("end")}
            disabled={disabled}
            className="au-datepicker__control"
            {...rest}
          />
        </div>
      ) : (
        <input
          id={id}
          name={name}
          type={inputType}
          value={currentValue}
          onChange={handleSingleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="au-datepicker__control"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...rest}
        />
      )}

      <div className="au-datepicker__meta">
        {helperText && !error ? <div id={id ? `${id}-helper` : undefined} className="au-datepicker__helper">{helperText}</div> : null}
        {error ? <div id={id ? `${id}-error` : undefined} className="au-datepicker__error">{error}</div> : null}
      </div>
    </div>
  );
}
