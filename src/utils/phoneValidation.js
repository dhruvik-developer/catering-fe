// Indian mobile numbers are 10 digits and must start with 6, 7, 8, or 9.
// Sequences like "0123456789" or "1234567890" are obvious typos / dummy data.
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export function sanitizePhoneInput(value) {
  return String(value ?? "").replace(/\D/g, "").slice(0, 10);
}

export function isValidIndianMobile(value) {
  const cleaned = sanitizePhoneInput(value);
  return INDIAN_MOBILE_REGEX.test(cleaned);
}

export function getPhoneValidationError(value, { required = false } = {}) {
  const cleaned = sanitizePhoneInput(value);
  if (!cleaned) {
    return required ? "Phone number is required" : "";
  }
  if (cleaned.length !== 10) {
    return "Phone number must be exactly 10 digits";
  }
  if (!/^[6-9]/.test(cleaned)) {
    return "Phone number must start with 6, 7, 8, or 9";
  }
  return "";
}
