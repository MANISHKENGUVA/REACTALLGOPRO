import { z } from 'zod';

// Shared field schemas. Pages build their form schema from these so the same
// rule (and the same message) applies to a field wherever it appears. Zod owns
// shape/format; the backend still owns whether the event is accepted.

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_PATTERN = /^\d{10}$/;
export const PAN_PATTERN = /^[A-Z]{5}\d{4}[A-Z]$/i;
export const AADHAAR_PATTERN = /^\d{12}$/;
export const PINCODE_PATTERN = /^\d{6}$/;
export const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
export const GST_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i;

export function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function requiredText(message, { max = 120, min = 1 } = {}) {
  return z.string()
    .trim()
    .min(min, message)
    .max(max, message);
}

export function optionalText({ max = 120, message = 'This value is too long' } = {}) {
  return z.string().trim().max(max, message);
}

export function emailField(message = 'Enter a valid email address') {
  return z.string().trim().min(1, 'Email address is required').regex(EMAIL_PATTERN, message);
}

export function mobileField(message = 'Enter a 10-digit mobile number') {
  return z.string().trim().regex(MOBILE_PATTERN, message);
}

export function panField(message = 'Enter a valid PAN number') {
  return z.string().trim().regex(PAN_PATTERN, message).transform((value) => value.toUpperCase());
}

export function aadhaarField(message = 'Enter a 12-digit Aadhaar number') {
  return z.string().trim().regex(AADHAAR_PATTERN, message);
}

export function optionalAadhaarField() {
  return z.string().trim().refine((value) => !value || AADHAAR_PATTERN.test(value), {
    message: 'Enter a 12-digit Aadhaar number',
  });
}

export function pincodeField(message = 'Enter a 6-digit pincode') {
  return z.string().trim().regex(PINCODE_PATTERN, message);
}

export function ifscField(message = 'Enter a valid IFSC code') {
  return z.string().trim().regex(IFSC_PATTERN, message).transform((value) => value.toUpperCase());
}

export function amountField(message = 'Enter a valid amount') {
  return z.coerce.number().finite(message).positive(message);
}

export function wholeNumberField(message = 'Enter a whole number') {
  return z.coerce.number().int(message).nonnegative(message);
}

export function pastDateField(message = 'Enter a valid date that is not in the future') {
  return z.string().trim().min(1, 'Date is required').refine((value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year
      || date.getUTCMonth() !== month - 1
      || date.getUTCDate() !== day
    ) return false;
    const today = new Date();
    return value <= `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }, { message });
}

export function optionalGstField(message = 'Enter a valid 15-character GSTIN') {
  return z.string().trim().refine((value) => !value || GST_PATTERN.test(value), { message });
}

// Convert a ZodError into { field: 'first message' } for form rendering.
export function zodFieldErrors(error) {
  const flattened = error?.flatten?.();
  const fields = flattened?.fieldErrors || {};
  return Object.fromEntries(
    Object.entries(fields).map(([key, messages]) => [
      key,
      Array.isArray(messages) ? (messages[0] || '') : String(messages || ''),
    ]),
  );
}

export function firstError(errors) {
  if (!errors) return '';
  const values = Object.values(errors);
  for (const value of values) {
    if (Array.isArray(value) && value.length) return value[0];
    if (typeof value === 'string' && value) return value;
  }
  return '';
}

// Remove one field's error without discarding the rest of the form state.
export function clearFieldError(errors, name) {
  if (!errors || !Object.prototype.hasOwnProperty.call(errors, name)) return errors;
  const next = { ...errors };
  delete next[name];
  return next;
}
