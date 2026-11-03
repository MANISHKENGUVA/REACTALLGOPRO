import React, { useId } from 'react';
import Field from './Field';
import { describedBy } from './fieldA11y';
import { Icon } from './Icons';

const today = () => new Date().toISOString().slice(0, 10);

// Native date input: the browser owns the picker, keyboard support and locale,
// which is more reliable than a custom calendar. `disableFuture` is only a
// convenience; the validation layer and the backend remain authoritative.
export default function DateField({
  id,
  name = '',
  label,
  hint = '',
  error = '',
  required = false,
  disableFuture = false,
  min,
  max,
  className = '',
  onValueChange,
  onChange,
  ...rest
}) {
  const generated = useId();
  const fieldId = id || name || `gp-date-${generated}`;
  const hintId = hint ? `${fieldId}-hint` : '';
  const errorId = error ? `${fieldId}-error` : '';

  return (
    <Field id={fieldId} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="gp-input-shell gp-input-shell--date">
        <span className="gp-input-shell__icon" aria-hidden="true">
          <Icon name="calendar" size={16} />
        </span>
        <input
          id={fieldId}
          name={name}
          type="date"
          className="gp-input"
          required={required || undefined}
          min={min}
          max={max || (disableFuture ? today() : undefined)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy(fieldId, { hint: hintId, error: errorId })}
          onChange={(event) => {
            onValueChange?.(event.target.value);
            onChange?.(event);
          }}
          {...rest}
        />
      </div>
    </Field>
  );
}
