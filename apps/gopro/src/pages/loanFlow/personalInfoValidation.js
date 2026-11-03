const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^\d{10}$/;
const PAN_PATTERN = /^[A-Z]{5}\d{4}[A-Z]$/i;
const AADHAAR_PATTERN = /^\d{12}$/;
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const PERSONAL_INFO_GENDER_OPTIONS = Object.freeze([
  { label: 'Select Gender', value: '' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]);

export const PERSONAL_INFO_GENDERS = Object.freeze(
  PERSONAL_INFO_GENDER_OPTIONS
    .map((option) => option.value)
    .filter(Boolean),
);

const MARITAL_STATUSES = Object.freeze(['single', 'married', 'divorced', 'widowed']);
const EMPLOYMENT_TYPES = Object.freeze(['salaried', 'business', 'others']);

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function lower(value) {
  return text(value).toLowerCase();
}

function isPastOrPresentIsoDate(value) {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) {
    return false;
  }

  const today = new Date();
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );

  return date.getTime() <= todayUtc;
}

export function validatePersonalInfo(formData = {}) {
  const errors = {};
  const data = {
    ...formData,
    fullName: text(formData.fullName),
    fathersName: text(formData.fathersName),
    mothersName: text(formData.mothersName),
    dateOfBirth: text(formData.dateOfBirth),
    gender: lower(formData.gender),
    maritalStatus: lower(formData.maritalStatus),
    email: text(formData.email),
    mobileNumber: text(formData.mobileNumber),
    panNumber: text(formData.panNumber).toUpperCase(),
    aadhaarNumber: text(formData.aadhaarNumber),
    employmentType: lower(formData.employmentType),
    monthlyIncome: text(formData.monthlyIncome),
    loanPurpose: text(formData.loanPurpose),
  };

  if (!data.fullName) {
    errors.fullName = 'Full name is required';
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else if (!isPastOrPresentIsoDate(data.dateOfBirth)) {
    errors.dateOfBirth = 'Enter a valid date of birth that is not in the future';
  }

  if (!data.gender) {
    errors.gender = 'Select a gender';
  } else if (!PERSONAL_INFO_GENDERS.includes(data.gender)) {
    errors.gender = 'Select Male, Female, or Other';
  }

  if (data.maritalStatus && !MARITAL_STATUSES.includes(data.maritalStatus)) {
    errors.maritalStatus = 'Select a valid marital status';
  }

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_PATTERN.test(data.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!MOBILE_PATTERN.test(data.mobileNumber)) {
    errors.mobileNumber = 'Enter a 10-digit mobile number';
  }

  if (!PAN_PATTERN.test(data.panNumber)) {
    errors.panNumber = 'Enter a valid PAN number';
  }

  if (data.aadhaarNumber && !AADHAAR_PATTERN.test(data.aadhaarNumber)) {
    errors.aadhaarNumber = 'Enter a 12-digit Aadhaar number';
  }

  if (!data.employmentType) {
    errors.employmentType = 'Employment type is required';
  } else if (!EMPLOYMENT_TYPES.includes(data.employmentType)) {
    errors.employmentType = 'Select a valid employment type';
  }

  if (data.monthlyIncome) {
    const monthlyIncome = Number(data.monthlyIncome);
    if (!Number.isFinite(monthlyIncome) || monthlyIncome <= 0) {
      errors.monthlyIncome = 'Enter a valid monthly income';
    }
  }

  return { errors, data };
}
