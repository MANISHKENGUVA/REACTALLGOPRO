import React, { useId } from 'react';
import Field from './Field';
import { describedBy } from './fieldA11y';

export default function TextArea({
  id,
  name = '',
  label,
  hint = '',
  error = '',
  required = false,
  rows = 4,
  className = '',
  onValueChange,
  onChange,
  ...rest
}) {
  const generated = useId();
  const fieldId = id || name || `gp-textarea-${generated}`;
  const hintId = hint ? `${fieldId}-hint` : '';
  const errorId = error ? `${fieldId}-error` : '';

  return (
    <Field id={fieldId} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        id={fieldId}
        name={name}
        rows={rows}
        className="gp-input gp-textarea"
        required={required || undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(fieldId, { hint: Boolean(hintId), error: Boolean(errorId) })}
        onChange={(event) => {
          onValueChange?.(event.target.value);
          onChange?.(event);
        }}
        {...rest}
      />
    </Field>
  );
}
