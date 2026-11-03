import React, { useId } from 'react';
import Field from './Field';
import { describedBy } from './fieldA11y';
import { Icon } from './Icons';

export default function TextField({
  id,
  name = '',
  label,
  hint = '',
  error = '',
  required = false,
  type = 'text',
  prefixIcon = '',
  suffix = null,
  className = '',
  onValueChange,
  onChange,
  ...rest
}) {
  const generated = useId();
  const fieldId = id || name || `gp-text-${generated}`;
  const hintId = hint ? `${fieldId}-hint` : '';
  const errorId = error ? `${fieldId}-error` : '';

  return (
    <Field id={fieldId} label={label} hint={hint} error={error} required={required} className={className}>
      <div className={`gp-input-shell${prefixIcon ? ' gp-input-shell--prefix' : ''}`}>
        {prefixIcon ? (
          <span className="gp-input-shell__icon" aria-hidden="true">
            <Icon name={prefixIcon} size={16} />
          </span>
        ) : null}
        <input
          id={fieldId}
          name={name}
          type={type}
          className="gp-input"
          required={required || undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy(fieldId, { hint: hintId, error: errorId })}
          onChange={(event) => {
            onValueChange?.(event.target.value);
            onChange?.(event);
          }}
          {...rest}
        />
        {suffix ? <span className="gp-input-shell__suffix">{suffix}</span> : null}
      </div>
    </Field>
  );
}
