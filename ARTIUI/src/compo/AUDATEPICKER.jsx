import React, { useEffect, useMemo, useRef, useState } from "react";

// ==========================================
// Constants & Helper Functions
// ==========================================
const MODE_TYPE = {
  date: "date",
  datetime: "datetime-local",
  time: "time"
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function toDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function getStartOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(date.getDate() + amount);
  return next;
}

function isSameDay(a, b) {
  return Boolean(a && b && toDateKey(a) === toDateKey(b));
}

function isBetween(date, start, end) {
  if (!date || !start || !end) return false;
  const time = date.getTime();
  return time > start.getTime() && time < end.getTime();
}

function getCalendarDays(viewDate) {
  const start = getStartOfMonth(viewDate);
  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - start.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

function getInitialViewDate(isRange, currentValue) {
  const selected = isRange ? currentValue.start || currentValue.end : currentValue;
  return getStartOfMonth(parseDateKey(selected) || new Date());
}

function formatDisplay(value) {
  const date = parseDateKey(value);
  if (!date) return "";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function createChangeEvent(value, name) {
  return {
    target: { value, name },
    currentTarget: { value, name }
  };
}

function getRangeLabel(currentValue) {
  if (currentValue.start && currentValue.end) {
    return `${formatDisplay(currentValue.start)} - ${formatDisplay(currentValue.end)}`;
  }
  if (currentValue.start) return `${formatDisplay(currentValue.start)} - Select end date`;
  return "Select start and end dates";
}

// ==========================================
// AUDATEPICKER Component
// ==========================================
export default function AUDATEPICKER({
  id,
  label,
  mode = "date",
  range = false,
  value,
  startValue,
  endValue,
  defaultValue = "",
  defaultStartValue = "",
  defaultEndValue = "",
  onChange,
  placeholder = "Select date",
  startPlaceholder = "Start date",
  endPlaceholder = "End date",
  error,
  helperText,
  disabled = false,
  className = "",
  name,
  min,
  max,
  disableFuture = false,
  disableFutureDates = false,
  disablePast = false,
  disablePastDates = false,
  ...rest
}) {
  const isRange = range || mode === "range";
  const usesCalendar = isRange || mode === "date";
  const isControlled = value !== undefined || startValue !== undefined || endValue !== undefined;
  
  const wrapperRef = useRef(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalStart, setInternalStart] = useState(defaultStartValue);
  const [internalEnd, setInternalEnd] = useState(defaultEndValue);
  const [open, setOpen] = useState(false);
  const [activeRangeSide, setActiveRangeSide] = useState("start");

  const currentValue = isRange
    ? {
        start: startValue ?? internalStart,
        end: endValue ?? internalEnd
      }
    : value ?? internalValue;

  const [viewDate, setViewDate] = useState(() => getInitialViewDate(isRange, currentValue));

  // Sync controlled props
  useEffect(() => {
    if (isControlled && !isRange && value !== undefined) {
      setInternalValue(value);
    }
    if (isControlled && isRange) {
      if (startValue !== undefined) setInternalStart(startValue);
      if (endValue !== undefined) setInternalEnd(endValue);
    }
  }, [isControlled, isRange, value, startValue, endValue]);

  // Click outside listener
  useEffect(() => {
    function handleDocumentClick(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  // Compute effective min & max limits
  const shouldDisableFuture = disableFuture || disableFutureDates;
  const shouldDisablePast = disablePast || disablePastDates;

  const effectiveMax = useMemo(() => {
    if (shouldDisableFuture) {
      const todayKey = toDateKey(new Date());
      if (!max) return todayKey;
      return max < todayKey ? max : todayKey;
    }
    return max;
  }, [shouldDisableFuture, max]);

  const effectiveMin = useMemo(() => {
    if (shouldDisablePast) {
      const todayKey = toDateKey(new Date());
      if (!min) return todayKey;
      return min > todayKey ? min : todayKey;
    }
    return min;
  }, [shouldDisablePast, min]);

  const minDate = useMemo(() => parseDateKey(effectiveMin), [effectiveMin]);
  const maxDate = useMemo(() => parseDateKey(effectiveMax), [effectiveMax]);
  
  const calendarDays = useMemo(() => getCalendarDays(viewDate), [viewDate]);

  const selectedDate = isRange ? null : parseDateKey(currentValue);
  const selectedStart = isRange ? parseDateKey(currentValue.start) : null;
  const selectedEnd = isRange ? parseDateKey(currentValue.end) : null;

  const minYearProp = rest.minYear;
  const maxYearProp = rest.maxYear;

  const yearsList = useMemo(() => {
    const currentYr = new Date().getFullYear();
    const startYr = minDate ? minDate.getFullYear() : (minYearProp || 1920);
    const endYr = maxDate ? maxDate.getFullYear() : (maxYearProp || currentYr + 10);
    
    const list = [];
    for (let y = endYr; y >= startYr; y--) {
      list.push(y);
    }
    return list;
  }, [minDate, maxDate, minYearProp, maxYearProp]);

  function isDateDisabled(date) {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }

  function handleSingleNativeChange(event) {
    const nextValue = event.target.value;
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(createChangeEvent(nextValue, name));
  }

  function updateRange(next) {
    if (!isControlled) {
      setInternalStart(next.start);
      setInternalEnd(next.end);
    }
    onChange?.(createChangeEvent(next, name));
  }

  function handleDaySelect(date) {
    if (disabled || isDateDisabled(date)) return;

    const nextValue = toDateKey(date);

    if (!isRange) {
      if (!isControlled) setInternalValue(nextValue);
      onChange?.(createChangeEvent(nextValue, name));
      setOpen(false);
      return;
    }

    const next = { ...currentValue };
    if (activeRangeSide === "start" || !next.start || (next.start && next.end)) {
      next.start = nextValue;
      next.end = "";
      setActiveRangeSide("end");
      updateRange(next);
      return;
    }

    const startDate = parseDateKey(next.start);
    if (startDate && date < startDate) {
      next.end = next.start;
      next.start = nextValue;
    } else {
      next.end = nextValue;
    }
    setActiveRangeSide("start");
    updateRange(next);
    setOpen(false);
  }

  function handleSinglePreset(daysFromToday) {
    const nextDate = addDays(new Date(), daysFromToday);
    if (isDateDisabled(nextDate)) return;
    const nextValue = toDateKey(nextDate);
    if (!isControlled) setInternalValue(nextValue);
    setViewDate(getStartOfMonth(nextDate));
    onChange?.(createChangeEvent(nextValue, name));
    setOpen(false);
  }

  function handleRangePreset(startOffset, endOffset) {
    const startDate = addDays(new Date(), startOffset);
    const endDate = addDays(new Date(), endOffset);
    if (isDateDisabled(startDate) || isDateDisabled(endDate)) return;
    const next = {
      start: toDateKey(startDate),
      end: toDateKey(endDate)
    };
    setViewDate(getStartOfMonth(startDate));
    setActiveRangeSide("start");
    updateRange(next);
    setOpen(false);
  }

  const wrapperClasses = [
    "au-datepicker",
    open && "au-datepicker--open",
    error && "au-datepicker--error",
    disabled && "au-datepicker--disabled",
    className
  ].filter(Boolean).join(" ");

  const describedBy = id ? (error ? `${id}-error` : helperText ? `${id}-helper` : undefined) : undefined;
  const inputType = MODE_TYPE[mode] || "date";
  const displayText = isRange
    ? [formatDisplay(currentValue.start), formatDisplay(currentValue.end)].filter(Boolean).join(" - ")
    : formatDisplay(currentValue);
  const panelTitle = isRange ? getRangeLabel(currentValue) : formatDisplay(currentValue) || "Choose a date";

  return (
    <div className={wrapperClasses} ref={wrapperRef}>
      {label && (
        <label className="au-datepicker__label" htmlFor={id}>
          {label}
        </label>
      )}

      {usesCalendar ? (
        <>
          <button
            type="button"
            id={id}
            className="au-datepicker__trigger"
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={describedBy}
            aria-expanded={open}
            onClick={() => {
              setViewDate(getInitialViewDate(isRange, currentValue));
              setOpen((prev) => !prev);
            }}
            {...rest}
          >
            <span className={displayText ? "au-datepicker__value" : "au-datepicker__placeholder"}>
              {displayText || (isRange ? `${startPlaceholder} - ${endPlaceholder}` : placeholder)}
            </span>
            <span className="au-datepicker__icon" aria-hidden="true">
              📅
            </span>
          </button>

          {isRange ? (
            <>
              <input type="hidden" name={name ? `${name}Start` : undefined} value={currentValue.start} readOnly />
              <input type="hidden" name={name ? `${name}End` : undefined} value={currentValue.end} readOnly />
            </>
          ) : (
            <input type="hidden" name={name} value={currentValue} readOnly />
          )}

          {open && (
            <div className="au-datepicker__panel" role="dialog" aria-label={label || "Choose date"}>
              <div className="au-datepicker__panel-hero">
                <span>{isRange ? "Date Range" : "Calendar Date"}</span>
                <strong>{panelTitle}</strong>
              </div>

              {isRange && (
                <div className="au-datepicker__range-preview">
                  <button
                    type="button"
                    className={activeRangeSide === "start" ? "is-active" : ""}
                    onClick={() => setActiveRangeSide("start")}
                  >
                    <span>Start</span>
                    <strong>{formatDisplay(currentValue.start) || startPlaceholder}</strong>
                  </button>
                  <button
                    type="button"
                    className={activeRangeSide === "end" ? "is-active" : ""}
                    onClick={() => setActiveRangeSide("end")}
                  >
                    <span>End</span>
                    <strong>{formatDisplay(currentValue.end) || endPlaceholder}</strong>
                  </button>
                </div>
              )}

              <div className="au-datepicker__panel-header" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '10px'
              }}>
                <button
                  type="button"
                  className="au-datepicker__nav-button"
                  onClick={() => setViewDate((date) => addMonths(date, -1))}
                  aria-label="Previous month"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <div className="au-datepicker__month-title" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    className="au-datepicker__month-select"
                    value={viewDate.getMonth()}
                    onChange={(e) => {
                      const newMonth = Number(e.target.value);
                      setViewDate(new Date(viewDate.getFullYear(), newMonth, 1));
                    }}
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      backgroundColor: '#f8fafc',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 8px center',
                      padding: '6px 26px 6px 12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1e293b',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      outline: 'none',
                    }}
                  >
                    {MONTHS.map((monthName, idx) => (
                      <option key={monthName} value={idx}>
                        {monthName}
                      </option>
                    ))}
                  </select>

                  <select
                    className="au-datepicker__year-select"
                    value={viewDate.getFullYear()}
                    onChange={(e) => {
                      const newYear = Number(e.target.value);
                      setViewDate(new Date(newYear, viewDate.getMonth(), 1));
                    }}
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      backgroundColor: '#f8fafc',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 8px center',
                      padding: '6px 26px 6px 12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1e293b',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      outline: 'none',
                    }}
                  >
                    {yearsList.map((yearNum) => (
                      <option key={yearNum} value={yearNum}>
                        {yearNum}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="au-datepicker__nav-button"
                  onClick={() => setViewDate((date) => addMonths(date, 1))}
                  aria-label="Next month"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              <div className="au-datepicker__weekdays" aria-hidden="true">
                {WEEKDAYS.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="au-datepicker__days">
                {calendarDays.map((date) => {
                  const dateKey = toDateKey(date);
                  const outsideMonth = date.getMonth() !== viewDate.getMonth();
                  const dateDisabled = isDateDisabled(date);
                  const isSelected = isRange
                    ? isSameDay(date, selectedStart) || isSameDay(date, selectedEnd)
                    : isSameDay(date, selectedDate);
                  const inRange = isRange && isBetween(date, selectedStart, selectedEnd);

                  return (
                    <button
                      type="button"
                      key={dateKey}
                      className={[
                        "au-datepicker__day",
                        outsideMonth && "is-muted",
                        isSelected && "is-selected",
                        inRange && "is-in-range",
                        isSameDay(date, new Date()) && "is-today"
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      disabled={dateDisabled}
                      onClick={() => handleDaySelect(date)}
                      aria-pressed={isSelected}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <div className="au-datepicker__presets" aria-label="Quick selections">
                {isRange ? (
                  <>
                    <button type="button" onClick={() => handleRangePreset(0, 6)}>This week</button>
                    <button type="button" onClick={() => handleRangePreset(7, 13)}>Next week</button>
                    <button type="button" onClick={() => handleRangePreset(0, 29)}>30 days</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => handleSinglePreset(0)}>Today</button>
                    {!shouldDisableFuture && (
                      <>
                        <button type="button" onClick={() => handleSinglePreset(1)}>Tomorrow</button>
                        <button type="button" onClick={() => handleSinglePreset(7)}>Next week</button>
                      </>
                    )}
                    {shouldDisableFuture && (
                      <>
                        <button type="button" onClick={() => handleSinglePreset(-1)}>Yesterday</button>
                        <button type="button" onClick={() => handleSinglePreset(-7)}>Last week</button>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="au-datepicker__actions">
                <button type="button" onClick={() => setViewDate(getStartOfMonth(new Date()))}>
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isRange) {
                      updateRange({ start: "", end: "" });
                      setActiveRangeSide("start");
                    } else {
                      if (!isControlled) setInternalValue("");
                      onChange?.(createChangeEvent("", name));
                    }
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="au-datepicker__native-wrap">
          <input
            id={id}
            name={name}
            type={inputType}
            value={currentValue}
            onChange={handleSingleNativeChange}
            placeholder={placeholder}
            disabled={disabled}
            min={effectiveMin}
            max={effectiveMax}
            className="au-datepicker__control"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={describedBy}
            {...rest}
          />
          <span className="au-datepicker__icon" aria-hidden="true">
            📅
          </span>
        </div>
      )}

      <div className="au-datepicker__meta">
        {helperText && !error && (
          <div id={id ? `${id}-helper` : undefined} className="au-datepicker__helper">
            {helperText}
          </div>
        )}
        {error && (
          <div id={id ? `${id}-error` : undefined} className="au-datepicker__error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
