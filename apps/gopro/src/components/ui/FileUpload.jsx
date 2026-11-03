import React, { useId } from 'react';

function formatBytes(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return '';
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

// Accessible file picker. The whole card is a label, the native input stays
// keyboard reachable (visually hidden but not display:none), and selected files
// are listed in text rather than conveyed only by colour.
export default function FileUpload({
  id,
  name,
  label,
  hint = '',
  accept = '.pdf,.jpg,.jpeg,.png,.webp',
  required = false,
  disabled = false,
  error = '',
  file = null,
  files = null,
  multiple = false,
  onChange,
  actionLabel = 'Choose file',
}) {
  const generatedId = useId();
  const inputId = id || `upload-${generatedId.replace(/:/g, '')}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined;
  const selected = Array.isArray(files) ? files : (file ? [file] : []);
  const hasFiles = selected.length > 0;

  return (
    <div className="gp-upload-field">
      <label
        className={`gp-upload${error ? ' gp-upload--error' : ''}${hasFiles ? ' gp-upload--filled' : ''}`}
        htmlFor={inputId}
      >
        <span className="gp-upload__icon" aria-hidden="true">
          {hasFiles ? '✓' : '↑'}
        </span>
        <span className="gp-upload__text">
          <span className="gp-upload__title">
            {label}
            {required ? <span className="gp-required"> (required)</span> : null}
          </span>
          <span className="gp-upload__hint" id={hint ? hintId : undefined}>
            {hint || 'PDF, JPG, PNG or WEBP'}
          </span>
        </span>
        <span className="gp-upload__action" aria-hidden="true">
          {hasFiles ? (multiple ? 'Change files' : 'Replace file') : actionLabel}
        </span>
        <input
          className="gp-upload__input"
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          required={required}
          disabled={disabled}
          onChange={onChange}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
        />
      </label>
      {hasFiles ? (
        <ul className="gp-upload__files">
          {selected.map((item, index) => (
            <li className="gp-upload__file" key={`${item.name}-${index}`}>
              <span aria-hidden="true">✓</span>
              <span className="gp-visually-hidden">Selected file:</span>
              <span>{item.name}</span>
              {formatBytes(item.size) ? (
                <span className="gp-upload__file-meta">({formatBytes(item.size)})</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      {error ? <p className="gp-field-error" id={errorId} role="alert">{error}</p> : null}
    </div>
  );
}
