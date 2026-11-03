import { z } from 'zod';

// Small, composable field rules. Pages build their own schema from these so no
// single mega-schema has to know about every step. Messages are written for the
// person filling the form; server errors are never generated here.
const text = (value) => (typeof value === 'string' ? value.trim() : '');

export const requiredText = (label, { max = 120, min = 1 } = {}) => z
  .string()
  .trim()
  .min(min, `${label} is required`)
  .max(max, `${label} must be ${max} characters or fewer`);

export const optionalText = (label, { max = 120 } = {}) => z
  .string()
  .trim()
  .max(max, `${label} must be ${max} characters or fewer`)
  .optional()
  .or(z.literal(''));

export const requiredEmail = (label = 'Email') => z
  .string()
  .trim()
  .min(1, `${label} is required`)
  .max(254, `${label} is too long`)
  .email(`Enter a valid ${label.toLowerCase()}`);

export const optionalEmail = (label = 'Email') => z
  .string()
  .trim()
  .max(254, `${label} is too long`)
  .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value), `Enter a valid ${label.toLowerCase()}`)
  .optional()
  .or(z.literal(''));

export const mobileNumber = (label = 'Mobile number') => z
  .string()
  .trim()
  .min(1, `${label} is required`)
  .regex(/^[6-9]\d{9}$/, `Enter a valid 10-digit ${label.toLowerCase()}`);

export const panNumber = (label = 'PAN') => z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .refine((value) => /^[A-Z]{5}\d{4}[A-Z]$/.test(value), `Enter a valid ${label} (for example ABCDE1234F)`);

export const aadhaarNumber = (label = 'Aadhaar number') => z
  .string()
  .trim()
  .refine((value) => !value || /^\d{12}$/.test(value), `Enter a valid 12-digit ${label.toLowerCase()}`)
  .optional()
  .or(z.literal(''));

export const pincode = (label = 'PIN code') => z
  .string()
  .trim()
  .regex(/^\d{6}$/, `Enter a valid 6-digit ${label.toLowerCase()}`);

export const requiredSelect = (label) => z
  .string()
  .trim()
  .min(1, `Select ${label.toLowerCase()}`);

export const positiveNumber = (label, { max = 1000000000 } = {}) => z
  .string()
  .trim()
  .min(1, `${label} is required`)
  .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, `Enter a valid ${label.toLowerCase()}`)
  .refine((value) => Number(value) <= max, `${label} is too large`);

export const nonNegativeNumber = (label) => z
  .string()
  .trim()
  .min(1, `${label} is required`)
  .refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, `Enter a valid ${label.toLowerCase()}`);

export const isoDate = (label = 'Date') => z
  .string()
  .trim()
  .min(1, `${label} is required`)
  .regex(/^\d{4}-\d{2}-\d{2}$/, `Enter a valid ${label.toLowerCase()}`)
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, `Enter a valid ${label.toLowerCase()}`);

const isFutureDate = (value) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  return parsed.getTime() > todayUtc.getTime();
};

export const pastDate = (label = 'Date') => isoDate(label)
  .refine((value) => !isFutureDate(value), `${label} cannot be in the future`);

export const adultDateOfBirth = (label = 'Date of birth') => pastDate(label)
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    const today = new Date();
    const ageLimit = new Date(Date.UTC(today.getUTCFullYear() - 18, today.getUTCMonth(), today.getUTCDate()));
    return parsed.getTime() <= ageLimit.getTime();
  }, 'You must be at least 18 years old');

export const acceptedCheckbox = (message) => z
  .boolean()
  .refine((value) => value === true, message);

export { text };
