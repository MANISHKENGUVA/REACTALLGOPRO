import React, { useState, useEffect } from "react";

export default function AURANGE({
  id,
  label,
  value,
  defaultValue = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  range = false,
  tooltip = false,
  helperText,
  error,
  disabled = false,
  className = "",
  name,
  ...rest
}) {
  const isControlled = value !== undefined;
  const defaultRangeValue = {
    min: Array.isArray(defaultValue) ? defaultValue[0] : min,
    max: Array.isArray(defaultValue) ? defaultValue[1] : max
  };
  const [internalValue, setInternalValue] = useState(
    range ? defaultRangeValue : defaultValue
  );
  const currentValue = isControlled ? value : internalValue;
  const wrapperClasses = [
    "au-range",
    error && "au-range--error",
    disabled && "au-range--disabled",
    className
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value);
    }
  }, [value, isControlled]);

  function handleSingleChange(event) {
    const nextValue = Number(event.target.value);
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    if (onChange) {
      onChange({ target: { value: nextValue, name }, currentTarget: { value: nextValue, name } });
    }
  }

  function handleRangeChange(type) {
    return (event) => {
      const nextValue = Number(event.target.value);
      const next = {
        min: type === "min" ? nextValue : currentValue.min,
        max: type === "max" ? nextValue : currentValue.max
      };
      if (!isControlled) {
        setInternalValue(next);
      }
      if (onChange) {
        onChange({ target: { value: next, name }, currentTarget: { value: next, name } });
      }
    };
  }

  const singleValue = range ? null : Number(currentValue ?? defaultValue);
  const rangeValues = range
    ? {
        min: Number(currentValue?.min ?? defaultRangeValue.min),
        max: Number(currentValue?.max ?? defaultRangeValue.max)
      }
    : null;

  return (
    <div className={wrapperClasses}>
      {label ? <label className="au-range__label" htmlFor={id}>{label}</label> : null}

      <div className="au-range__field">
        {range ? (
          <>
            <div className="au-range__slider-row">
              <input
                id={`${id}-min`}
                name={name}
                type="range"
                min={min}
                max={max}
                step={step}
                value={rangeValues.min}
                disabled={disabled}
                onChange={handleRangeChange("min")}
                className="au-range__input"
                {...rest}
              />
              <input
                id={`${id}-max`}
                name={name}
                type="range"
                min={min}
                max={max}
                step={step}
                value={rangeValues.max}
                disabled={disabled}
                onChange={handleRangeChange("max")}
                className="au-range__input"
                {...rest}
              />
            </div>
            {tooltip ? (
              <div className="au-range__tooltip">
                {rangeValues.min} — {rangeValues.max}
              </div>
            ) : null}
          </>
        ) : (
          <>
            <input
              id={id}
              name={name}
              type="range"
              min={min}
              max={max}
              step={step}
              value={singleValue}
              disabled={disabled}
              onChange={handleSingleChange}
              className="au-range__input"
              {...rest}
            />
            {tooltip ? <div className="au-range__tooltip">{singleValue}</div> : null}
          </>
        )}
      </div>

      <div className="au-range__meta">
        {helperText && !error ? <div className="au-range__helper">{helperText}</div> : null}
        {error ? <div className="au-range__error">{error}</div> : null}
      </div>
    </div>
  );
}
