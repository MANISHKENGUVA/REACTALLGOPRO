import React, { useState, useEffect, useMemo, useRef, useId } from "react";

const REQUIRED_FALLBACK = "Please select an option.";

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

function flattenVisible(groups) {
  const flat = [];
  groups.forEach((item) => {
    if (item.options) {
      item.options.forEach((option) => flat.push(option));
    } else {
      flat.push(item);
    }
  });
  return flat;
}

export default function AUSELECT({
  id,
  label,
  value,
  defaultValue,
  onChange,
  placeholder = "Select...",
  error,
  errormessage,
  helperText,
  options = [],
  searchable = false,
  multiple = false,
  checkbox = false,
  loading = false,
  asyncText = "Loading...",
  disabled = false,
  required = false,
  className = "",
  name,
  layout = "vertical",
  ...rest
}) {
  const isControlled = value !== undefined;
  const generatedId = useId();
  const selectId = id ?? `au-select-${generatedId.replace(/:/g, "")}`;
  const labelId = `${selectId}-label`;
  const listboxId = `${selectId}-listbox`;
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? (multiple ? [] : "")
  );
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const controlRef = useRef(null);
  const searchRef = useRef(null);
  const currentValue = isControlled ? value : internalValue;

  const normalized = useMemo(() => normalizeOptions(options), [options]);

  const visibleGroups = useMemo(() => {
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
        if (item.options) return item.options.length > 0;
        return item.label.toLowerCase().includes(query);
      });
  }, [normalized, search]);

  const flatOptions = useMemo(() => flattenVisible(visibleGroups), [visibleGroups]);

  const inlineError = typeof error === "string" ? error.trim() : "";
  const errorText = (typeof errormessage === "string" && errormessage.trim())
    || inlineError
    || (error ? REQUIRED_FALLBACK : "");
  const hasError = Boolean(error || errorText);

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

  useEffect(() => {
    if (!open) return;
    if (searchable) {
      searchRef.current?.focus();
      return;
    }
    const selectedIndex = flatOptions.findIndex((option) =>
      multiple
        ? Array.isArray(currentValue) && currentValue.includes(option.value)
        : option.value === currentValue
    );
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, searchable, flatOptions, multiple, currentValue]);

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
      controlRef.current?.focus();
    }
  }

  function moveActive(direction) {
    if (!flatOptions.length) return;
    let next = activeIndex;
    for (let step = 0; step < flatOptions.length; step += 1) {
      next = (next + direction + flatOptions.length) % flatOptions.length;
      if (!flatOptions[next].disabled) {
        setActiveIndex(next);
        return;
      }
    }
  }

  function handleKeyDown(event) {
    if (disabled) return;
    const { key } = event;

    if (!open && (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === " ")) {
      event.preventDefault();
      setOpen(true);
      return;
    }

    if (!open) return;

    if (key === "Escape") {
      event.preventDefault();
      setOpen(false);
      controlRef.current?.focus();
      return;
    }
    if (key === "Tab") {
      setOpen(false);
      return;
    }
    if (key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
      return;
    }
    if (key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
      return;
    }
    if (key === "Home") {
      event.preventDefault();
      setActiveIndex(flatOptions.findIndex((option) => !option.disabled));
      return;
    }
    if (key === "End") {
      event.preventDefault();
      for (let index = flatOptions.length - 1; index >= 0; index -= 1) {
        if (!flatOptions[index].disabled) {
          setActiveIndex(index);
          break;
        }
      }
      return;
    }
    if (key === "Enter" || key === " ") {
      const option = flatOptions[activeIndex];
      if (option && !option.disabled) {
        event.preventDefault();
        toggleOption(option.value);
      }
    }
  }

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
    hasError && "au-select--error",
    disabled && "au-select--disabled",
    className,
    layout === "horizontal" && "au-select--horizontal"
  ]
    .filter(Boolean)
    .join(" ");

  let optionIndex = -1;

  return (
    <div className={wrapperClasses} ref={wrapperRef}>
      {label ? (
        <span className="au-select__label" id={labelId}>{label}</span>
      ) : null}

      <button
        type="button"
        ref={controlRef}
        id={selectId}
        name={name}
        className="au-select__control"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={hasError ? "true" : "false"}
        aria-required={required ? "true" : undefined}
        aria-describedby={hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? `${selectId}-option-${activeIndex}` : undefined}
        {...rest}
      >
        <span className={selectedLabels ? "au-select__value" : "au-select__placeholder"}>
          {selectedLabels || placeholder}
        </span>
        <span className="au-select__arrow" aria-hidden="true">▾</span>
      </button>

      {open ? (
        <div className="au-select__menu" id={listboxId} role="listbox" aria-multiselectable={multiple || undefined} aria-labelledby={label ? labelId : undefined}>
          {searchable ? (
            <div className="au-select__search">
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="au-select__search-input"
                autoComplete="off"
                aria-label="Search options"
              />
            </div>
          ) : null}

          {loading ? (
            <div className="au-select__empty" role="status">{asyncText}</div>
          ) : visibleGroups.length === 0 ? (
            <div className="au-select__empty" role="status">No options</div>
          ) : (
            visibleGroups.map((item, groupIndex) => {
              if (item.options) {
                return (
                  <div key={`group-${groupIndex}`} className="au-select__group">
                    <div className="au-select__group-label">{item.label}</div>
                    {item.options.map((option) => {
                      optionIndex += 1;
                      const currentIndex = optionIndex;
                      const selected = multiple
                        ? Array.isArray(currentValue) && currentValue.includes(option.value)
                        : currentValue === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          id={`${selectId}-option-${currentIndex}`}
                          role="option"
                          aria-selected={selected}
                          tabIndex={-1}
                          className={[
                            "au-select__item",
                            selected ? "au-select__item--selected" : "",
                            activeIndex === currentIndex ? "au-select__item--active" : ""
                          ].filter(Boolean).join(" ")}
                          onClick={() => toggleOption(option.value)}
                          onMouseEnter={() => setActiveIndex(currentIndex)}
                          disabled={option.disabled || disabled}
                        >
                          {checkbox && multiple ? (
                            <span className="au-select__checkbox" aria-hidden="true">
                              {selected ? "✓" : ""}
                            </span>
                          ) : null}
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              }
              optionIndex += 1;
              const currentIndex = optionIndex;
              const selected = multiple
                ? Array.isArray(currentValue) && currentValue.includes(item.value)
                : currentValue === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  id={`${selectId}-option-${currentIndex}`}
                  role="option"
                  aria-selected={selected}
                  tabIndex={-1}
                  className={[
                    "au-select__item",
                    selected ? "au-select__item--selected" : "",
                    activeIndex === currentIndex ? "au-select__item--active" : ""
                  ].filter(Boolean).join(" ")}
                  onClick={() => toggleOption(item.value)}
                  onMouseEnter={() => setActiveIndex(currentIndex)}
                  disabled={item.disabled || disabled}
                >
                  {checkbox && multiple ? (
                    <span className="au-select__checkbox" aria-hidden="true">
                      {Array.isArray(currentValue) && currentValue.includes(item.value) ? "✓" : ""}
                    </span>
                  ) : null}
                  <span>{item.label}</span>
                </button>
              );
            })
          )}
        </div>
      ) : null}

      {helperText && !hasError ? (
        <div id={`${selectId}-helper`} className="au-select__helper">
          {helperText}
        </div>
      ) : null}
      {hasError ? (
        <div id={`${selectId}-error`} className="au-select__error">
          {errorText}
        </div>
      ) : null}
    </div>
  );
}
