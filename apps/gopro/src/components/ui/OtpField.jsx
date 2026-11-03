import React, { useId } from 'react';
import Field from './Field';
import { describedBy } from './fieldA11y';

const digits = (value, length) => String(value || '').replace(/\D/g, '').slice(0, length);

// One-time-code input. The code stays in component state only; this primitive
// never persists it, logs it, or decides whether it is correct.
export default function OtpField({
  id,
  name = 'otp',
  label = 'Verification code',
  hint = '',
  error = '',
  required = true,
  length = 6,
  value = '',
  onValueChange,
  onChange,
  disabled = false,
  autoFocus = false,
  className = '',
  ...rest
}) {
  const generated = useId();
  const fieldId = id || name || `gp-otp-${generated}`;
  const hintId = hint ? `${fieldId}-hint` : '';
  const errorId = error ? `${fieldId}-error` : '';

  return (
    <Field id={fieldId} label={label} hint={hint} error={error} required={required} className={className}>
      <input
        id={fieldId}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={length}
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        className="gp-input gp-otp"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(fieldId, { hint: hintId, error: errorId })}
        onChange={(event) => {
          const next = digits(event.target.value, length);
          onValueChange?.(next);
          onChange?.({ ...event, target: { ...event.target, value: next } });
        }}
        {...rest}
      />
    </Field>
  );
}
