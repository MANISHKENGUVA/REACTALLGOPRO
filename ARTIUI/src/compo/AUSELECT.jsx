import React, { useState, useEffect, useMemo, useRef } from "react";

function normalizeOptions(options) {
  return options.map((option) => {
    if (option.options) {
      return {
        label: option.label,
        options: option.options.map((item) => ({
          label: item.label,
          value: item.value,
          disabled: item.disabled || false
        }))
      };
    }
    return {
      label: option.label,
      value: option.value,
      disabled: option.disabled || false
    };
  });
}

export default function AUSELECT({
  id,
  label,
  value,
  defaultValue,
  onChange,
  placeholder = "Select...",
  error,
  helperText,
  options = [],
  searchable = false,
  multiple = false,
  checkbox = false,
  loading = false,
  asyncText = "Loading...",
  disabled = false,
  className = "",
  name,
  layout = "vertical",
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? (multiple ? [] : "")
  );
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const currentValue = isControlled ? value : internalValue;

  const normalized = useMemo(() => normalizeOptions(options), [options]);

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value);
    }
  }, [value, isControlled]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function fireChange(nextValue) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    if (onChange) {
      onChange({
        target: { value: nextValue, name },
        currentTarget: { value: nextValue, name }
      });
    }
  }

  function toggleOption(optionValue) {
    if (disabled) return;
    if (multiple) {
      const next = Array.isArray(currentValue) ? [...currentValue] : [];
      const index = next.indexOf(optionValue);
      if (index >= 0) {
        next.splice(index, 1);
      } else {
        next.push(optionValue);
      }
      fireChange(next);
    } else {
      fireChange(optionValue);
      setOpen(false);
    }
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return normalized;
    return normalized
      .map((item) => {
        if (item.options) {
          const optionsMatch = item.options.filter((opt) =>
            opt.label.toLowerCase().includes(query)
          );
          return { ...item, options: optionsMatch };
        }
        return item;
      })
      .filter((item) => {
        if (item.options) {
          return item.options.length > 0;
        }
        return item.label.toLowerCase().includes(query);
      });
  }, [normalized, search]);

  const selectedLabels = useMemo(() => {
    if (multiple) {
      if (!Array.isArray(currentValue)) return "";
      const labels = [];
      normalized.forEach((item) => {
        const optionList = item.options ? item.options : [item];
        optionList.forEach((opt) => {
          if (currentValue.includes(opt.value)) {
            labels.push(opt.label);
          }
        });
      });
      return labels.join(", ");
    }
    const flat = normalized.flatMap((item) => (item.options ? item.options : [item]));
    const single = flat.find((opt) => opt.value === currentValue);
    return single ? single.label : "";
  }, [currentValue, normalized, multiple]);

  const wrapperClasses = [
    "au-select",
    error && "au-select--error",
    disabled && "au-select--disabled",
    className,
    layout === "horizontal" && "au-select--horizontal"
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses} ref={wrapperRef}>
      {label ? (
        <label className="au-select__label" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <button
        type="button"
        id={id}
        name={name}
        className="au-select__control"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        {...rest}
      >
        <span className={selectedLabels ? "au-select__value" : "au-select__placeholder"}>
          {selectedLabels || placeholder}
        </span>
        <span className="au-select__arrow">▾</span>
      </button>

      {open ? (
        <div className="au-select__menu">
          {searchable ? (
            <div className="au-select__search">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."
                className="au-select__search-input"
                autoComplete="off"
              />
            </div>
          ) : null}

          {loading ? (
            <div className="au-select__empty">{asyncText}</div>
          ) : filtered.length === 0 ? (
            <div className="au-select__empty">No options</div>
          ) : (
            filtered.map((item, index) =>
              item.options ? (
                <div key={`group-${index}`} className="au-select__group">
                  <div className="au-select__group-label">{item.label}</div>
                  {item.options.map((option) => {
                    const selected = multiple
                      ? Array.isArray(currentValue) && currentValue.includes(option.value)
                      : currentValue === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={`au-select__item ${selected ? "au-select__item--selected" : ""}`}
                        onClick={() => toggleOption(option.value)}
                        disabled={option.disabled || disabled}
                      >
                        {checkbox && multiple ? (
                          <span className="au-select__checkbox">
                            {selected ? "✓" : ""}
                          </span>
                        ) : null}
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <button
                  key={item.value}
                  type="button"
                  className={`au-select__item ${currentValue === item.value ? "au-select__item--selected" : ""}`}
                  onClick={() => toggleOption(item.value)}
                  disabled={item.disabled || disabled}
                >
                  {checkbox && multiple ? (
                    <span className="au-select__checkbox">
                      {Array.isArray(currentValue) && currentValue.includes(item.value) ? "✓" : ""}
                    </span>
                  ) : null}
                  <span>{item.label}</span>
                </button>
              )
            )
          )}
        </div>
      ) : null}

      {helperText && !error ? (
        <div id={id ? `${id}-helper` : undefined} className="au-select__helper">
          {helperText}
        </div>
      ) : null}
      {error ? (
        <div id={id ? `${id}-error` : undefined} className="au-select__error">
          {error}
        </div>
      ) : null}
    </div>
  );
}
