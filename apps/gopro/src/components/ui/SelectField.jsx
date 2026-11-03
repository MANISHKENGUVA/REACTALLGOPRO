import React, { useId } from 'react';
import Field from './Field';
import { describedBy } from './fieldA11y';

// Native select: keyboard behaviour, screen-reader semantics and mobile pickers
// are provided by the browser. Options come from the page; this primitive never
// invents a value or silently preselects the first real option.
export default function SelectField({
  id,
  name = '',
  label,
  hint = '',
  error = '',
  required = false,
  placeholder = 'Select an option',
  options = [],
  className = '',
  onValueChange,
  onChange,
  ...rest
}) {
  const generated = useId();
  const fieldId = id || name || `gp-select-${generated}`;
  const hintId = hint ? `${fieldId}-hint` : '';
  const errorId = error ? `${fieldId}-error` : '';

  return (
    <Field id={fieldId} label={label} hint={hint} error={error} required={required} className={className}>
      <select
        id={fieldId}
        name={name}
        className="gp-input gp-select"
        required={required || undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(fieldId, { hint: hintId, error: errorId })}
        onChange={(event) => {
          onValueChange?.(event.target.value);
          onChange?.(event);
        }}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.filter((option) => option.value !== '').map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
