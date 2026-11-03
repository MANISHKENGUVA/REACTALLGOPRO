import { useCallback, useMemo, useRef, useState } from 'react';
import { focusFirstInvalid } from './focusFirstInvalid';
import { serverFieldErrors } from './serverFieldErrors';
import { safeParseForm } from './zodFieldErrors';
import { useSubmitGuard } from './useSubmitGuard';

const SUMMARY_THRESHOLD = 3;

// Form state for a single step. Validation is run against the provided Zod
// schema at submit time (and on blur once that field has been touched), so a
// person is never shown an error before they have had a chance to fill it in.
export function useFormValidation({ initialValues, schema, labels = {}, fieldOrder = [] }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const { submitting, run } = useSubmitGuard();

  const setField = useCallback((name, value) => {
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => {
      if (!previous[name] && !previous.form) return previous;
      const next = { ...previous };
      delete next[name];
      delete next.form;
      return next;
    });
  }, []);

  const handleChange = useCallback((event) => {
    const { name, type, value, checked } = event.target;
    setField(name, type === 'checkbox' ? checked : value);
  }, [setField]);

  const handleBlur = useCallback((event) => {
    const name = event?.target?.name;
    if (!name) return;
    setTouched((previous) => ({ ...previous, [name]: true }));
    setErrors((previous) => {
      if (previous[name] || !schema) return previous;
      const parsed = safeParseForm(schema, values);
      return parsed.errors[name] ? { ...previous, [name]: parsed.errors[name] } : previous;
    });
  }, [schema, values]);

  const validate = useCallback((nextValues = values) => {
    if (!schema) return { ok: true, data: nextValues, errors: {} };
    return safeParseForm(schema, nextValues);
  }, [schema, values]);

  const errorFor = useCallback((name) => {
    if (!errors[name]) return '';
    if (!touched[name] && !submitted) return '';
    return errors[name];
  }, [errors, submitted, touched]);

  const summaryItems = useMemo(() => {
    const names = fieldOrder.length
      ? fieldOrder.filter((name) => errors[name])
      : Object.keys(errors).filter((name) => name !== 'form');
    const extra = Object.keys(errors).filter((name) => name !== 'form' && !names.includes(name));
    return [...names, ...extra].map((name) => ({
      name,
      label: labels[name] || name,
      message: errors[name],
    }));
  }, [errors, fieldOrder, labels]);

  const focusInvalid = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return focusFirstInvalid(formRef.current);
  }, []);

  const submit = useCallback(async (onValid) => {
    setSubmitted(true);
    const result = validate();
    if (!result.ok) {
      setErrors(result.errors);
      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => focusInvalid());
      }
      return { ok: false, data: null };
    }
    setErrors((previous) => {
      if (!previous.form) return previous;
      const next = { ...previous };
      delete next.form;
      return next;
    });
    const guarded = await run(() => onValid(result.data));
    return { ok: true, data: result.data, result: guarded.value, skipped: guarded.skipped };
  }, [focusInvalid, run, validate]);

  const applyServerError = useCallback((error, allowedFields = null) => {
    const fields = serverFieldErrors(error, { allowedFields });
    setErrors((previous) => ({ ...previous, ...fields }));
    return fields;
  }, []);

  const setFormError = useCallback((message) => {
    setErrors((previous) => ({ ...previous, form: message }));
  }, []);

  const reset = useCallback((nextValues = initialValues) => {
    setValues(nextValues);
    setErrors({});
    setTouched({});
    setSubmitted(false);
  }, [initialValues]);

  return {
    values,
    setValues,
    errors,
    touched,
    submitted,
    submitting,
    formRef,
    formError: errors.form || '',
    showSummary: Boolean(submitted) && summaryItems.length >= SUMMARY_THRESHOLD,
    summaryItems,
    errorFor,
    setField,
    handleChange,
    handleBlur,
    validate,
    submit,
    applyServerError,
    setFormError,
    reset,
  };
}
