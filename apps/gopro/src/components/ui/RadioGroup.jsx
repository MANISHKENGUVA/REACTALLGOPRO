import React, { useId } from 'react';
import Field from './Field';

// Native radio group in a fieldset. The legend is the group label, so screen
// readers announce the question with each option.
export default function RadioGroup({
  id,
  name,
  legend,
  hint = '',
  error = '',
  required = false,
  options = [],
  value = '',
  onChange,
  inline = false,
  disabled = false,
  className = '',
}) {
  const generated = useId();
  const groupId = id || name || `gp-radio-${generated}`;

  return (
    <Field
      id={groupId}
      hint={hint}
      error={error}
      className={`gp-field--group ${className}`.trim()}
      as="div"
    >
      <fieldset
        className={`gp-radio-group${inline ? ' gp-radio-group--inline' : ''}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={[hint ? `${groupId}-hint` : '', error ? `${groupId}-error` : ''].filter(Boolean).join(' ') || undefined}
      >
        <legend className="gp-field__label">
          {legend}
          {required ? (
            <>
              <span className="gp-required" aria-hidden="true"> *</span>
              <span className="gp-visually-hidden"> (required)</span>
            </>
          ) : null}
        </legend>
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          return (
            <span className={`gp-choice gp-choice--radio${disabled || option.disabled ? ' gp-choice--disabled' : ''}`} key={option.value}>
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                className="gp-choice__input"
                checked={value === option.value}
                required={required || undefined}
                disabled={disabled || option.disabled}
                onChange={onChange}
              />
              <span className="gp-choice__box" aria-hidden="true" />
              <label className="gp-choice__label" htmlFor={optionId}>
                <span className="gp-choice__title">{option.label}</span>
                {option.description ? <span className="gp-choice__description">{option.description}</span> : null}
              </label>
            </span>
          );
        })}
      </fieldset>
    </Field>
  );
}
