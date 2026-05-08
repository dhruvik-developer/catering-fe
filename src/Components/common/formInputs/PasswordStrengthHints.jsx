/* eslint-disable react/prop-types */
import { FiCheck, FiX } from "react-icons/fi";
import { getPasswordChecks } from "../../../utils/passwordValidation";

// Compact list of password rules with a check / cross next to each.
// Pass `value` (current password). Set `alwaysShow` to render even when empty.
function PasswordStrengthHints({ value = "", alwaysShow = false, className = "" }) {
  const v = String(value ?? "");
  if (!v && !alwaysShow) return null;

  const checks = getPasswordChecks(v);
  return (
    <ul
      className={`mt-2 space-y-1 text-[11px] ${className}`}
      aria-label="Password requirements"
    >
      {checks.map(({ key, label, passed }) => (
        <li
          key={key}
          className={`flex items-center gap-1.5 ${passed ? "text-green-600" : "text-gray-500"}`}
        >
          {passed ? (
            <FiCheck className="shrink-0" size={13} />
          ) : (
            <FiX className="shrink-0" size={13} />
          )}
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}

export default PasswordStrengthHints;
