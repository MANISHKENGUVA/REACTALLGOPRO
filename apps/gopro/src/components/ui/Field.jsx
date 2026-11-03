import React from 'react';
import { Icon } from './Icons';

// Field is the label/description/error frame shared by every control. Controls
// that need a custom layout (radio groups, uploads) render inside it; native
// controls use the same class names directly so spacing stays identical.
export default function Field({
  id,
  label = '',
  hint = '',
  error = '',
  required = false,
  className = '',
  children,
  as: Tag = 'label',
}) {
  const invalid = Boolean(error);
  const classes = ['gp-field', invalid ? 'gp-field--invalid' : '', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label ? (
        <Tag className="gp-field__label" htmlFor={Tag === 'label' ? id : undefined}>
          {label}
          {required ? (
            <>
              <span className="gp-required" aria-hidden="true"> *</span>
              <span className="gp-visually-hidden"> (required)</span>
            </>
          ) : null}
        </Tag>
      ) : null}
      {hint ? <p className="gp-field__hint" id={`${id}-hint`}>{hint}</p> : null}
      {children}
      {error ? (
        <p className="gp-field__error" id={`${id}-error`}>
          <Icon name="alert" size={14} />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
