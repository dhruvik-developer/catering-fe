// Password policy used across all "create / change password" forms.
// Backend may apply its own checks; treat these as the front-end floor.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;

const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;
const SPACE_REGEX = /\s/;

export const PASSWORD_RULES = [
  {
    key: "length",
    label: `${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} characters`,
    test: (v) => v.length >= PASSWORD_MIN_LENGTH && v.length <= PASSWORD_MAX_LENGTH,
  },
  {
    key: "uppercase",
    label: "At least one uppercase letter (A–Z)",
    test: (v) => UPPERCASE_REGEX.test(v),
  },
  {
    key: "lowercase",
    label: "At least one lowercase letter (a–z)",
    test: (v) => LOWERCASE_REGEX.test(v),
  },
  {
    key: "digit",
    label: "At least one number (0–9)",
    test: (v) => DIGIT_REGEX.test(v),
  },
  {
    key: "special",
    label: "At least one special character (! @ # $ … )",
    test: (v) => SPECIAL_REGEX.test(v),
  },
  {
    key: "noSpace",
    label: "No spaces",
    test: (v) => v.length === 0 || !SPACE_REGEX.test(v),
  },
];

export function getPasswordChecks(value) {
  const v = String(value ?? "");
  return PASSWORD_RULES.map((rule) => ({
    key: rule.key,
    label: rule.label,
    passed: rule.test(v),
  }));
}

export function isStrongPassword(value) {
  const v = String(value ?? "");
  return PASSWORD_RULES.every((rule) => rule.test(v));
}

export function getPasswordValidationError(value, { required = false } = {}) {
  const v = String(value ?? "");
  if (!v) {
    return required ? "Password is required" : "";
  }
  if (v.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  if (v.length > PASSWORD_MAX_LENGTH) {
    return `Password must be at most ${PASSWORD_MAX_LENGTH} characters`;
  }
  if (SPACE_REGEX.test(v)) {
    return "Password cannot contain spaces";
  }
  if (!UPPERCASE_REGEX.test(v)) {
    return "Password must include at least one uppercase letter";
  }
  if (!LOWERCASE_REGEX.test(v)) {
    return "Password must include at least one lowercase letter";
  }
  if (!DIGIT_REGEX.test(v)) {
    return "Password must include at least one number";
  }
  if (!SPECIAL_REGEX.test(v)) {
    return "Password must include at least one special character";
  }
  return "";
}
