import React, { useId } from 'react';
import Field from './Field';
import { describedBy } from './fieldA11y';
import { Icon } from './Icons';

const digits = (value, max = 10) => String(value || '').replace(/\D/g, '').slice(0, max);

// Indian mobile input. It stores only digits and shows the country code as a
// fixed prefix; the validation layer still owns the final rule.
export default function PhoneField({
  id,
  name = 'mobileNumber',
  label = 'Mobile number',
  hint = '',
  error = '',
  required = false,
  value = '',
  onValueChange,
  onChange,
  maxLength = 10,
  className = '',
  ...rest
}) {
  const generated = useId();
  const fieldId = id || name || `gp-phone-${generated}`;
  const hintId = hint ? `${fieldId}-hint` : '';
  const errorId = error ? `${fieldId}-error` : '';

  return (
    <Field id={fieldId} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="gp-input-shell gp-input-shell--phone">
        <span className="gp-input-shell__country" aria-hidden="true">+91</span>
        <input
          id={fieldId}
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          className="gp-input"
          value={value}
          maxLength={maxLength}
          required={required || undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy(fieldId, { hint: hintId, error: errorId })}
          onChange={(event) => {
            const next = digits(event.target.value, maxLength);
            onValueChange?.(next);
            onChange?.({ ...event, target: { ...event.target, value: next } });
          }}
          {...rest}
        />
        <Icon name="phone" size={16} className="gp-input-shell__suffix" />
      </div>
    </Field>
  );
}
