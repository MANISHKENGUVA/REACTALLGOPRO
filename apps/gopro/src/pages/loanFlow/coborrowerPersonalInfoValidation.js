const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^\d{10}$/;
const PAN_PATTERN = /^[A-Z]{5}\d{4}[A-Z]$/i;

export const COBORROWER_RELATIONSHIP_OPTIONS = Object.freeze([
  { label: 'Spouse', value: 'spouse' },
  { label: 'Parent', value: 'parent' },
  { label: 'Sibling', value: 'sibling' },
  { label: 'Business Partner', value: 'partner' },
]);

const RELATIONSHIPS = Object.freeze(
  COBORROWER_RELATIONSHIP_OPTIONS.map((option) => option.value),
);

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function lower(value) {
  return text(value).toLowerCase();
}

export function validateCoborrowerPersonalInfo(formData = {}) {
  const errors = {};
  const data = {
    ...formData,
    fullName: text(formData.fullName),
    relationship: lower(formData.relationship),
    email: text(formData.email),
    mobileNumber: text(formData.mobileNumber),
    panNumber: text(formData.panNumber).toUpperCase(),
  };

  if (!data.fullName) {
    errors.fullName = 'Full name is required';
  }

  if (!data.relationship) {
    errors.relationship = 'Select a relationship';
  } else if (!RELATIONSHIPS.includes(data.relationship)) {
    errors.relationship = 'Select a valid relationship';
  }

  if (data.email && !EMAIL_PATTERN.test(data.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!MOBILE_PATTERN.test(data.mobileNumber)) {
    errors.mobileNumber = 'Enter a 10-digit mobile number';
  }

  if (!PAN_PATTERN.test(data.panNumber)) {
    errors.panNumber = 'Enter a valid PAN number';
  }

  return { errors, data };
}
