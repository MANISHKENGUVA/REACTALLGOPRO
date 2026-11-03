import React, { useId } from 'react';
import Field from './Field';
import { Icon } from './Icons';

export default function CheckboxField({
  id,
  name = '',
  label,
  hint = '',
  error = '',
  required = false,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  ...rest
}) {
  const generated = useId();
  const fieldId = id || name || `gp-checkbox-${generated}`;

  return (
    <Field id={fieldId} hint={hint} error={error} className={`gp-field--choice ${className}`.trim()}>
      <span className={`gp-choice${error ? ' gp-choice--invalid' : ''}`}>
        <input
          id={fieldId}
          name={name}
          type="checkbox"
          className="gp-choice__input"
          checked={checked}
          required={required || undefined}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={[hint ? `${fieldId}-hint` : '', error ? `${fieldId}-error` : ''].filter(Boolean).join(' ') || undefined}
          onChange={onChange}
          {...rest}
        />
        <label className="gp-choice__label" htmlFor={fieldId}>
          {label}
          {required ? (
            <>
              <span className="gp-required" aria-hidden="true"> *</span>
              <span className="gp-visually-hidden"> (required)</span>
            </>
          ) : null}
        </label>
        <span className="gp-choice__box" aria-hidden="true">
          <Icon name="check" size={13} />
        </span>
      </span>
    </Field>
  );
}
