/* eslint-disable react/prop-types */

function getRoleLabel(roleObj = {}) {
  const safeRole =
    roleObj && typeof roleObj === "object" ? roleObj : {};

  return (
    safeRole.name ||
    safeRole.role ||
    safeRole.title ||
    safeRole.label ||
    "Unnamed Role"
  );
}

function RoleDropdown({
  value,
  onChange,
  rolesList = [],
  error,
  addNewValue = "__ADD_NEW__",
  disabled = false,
}) {
  const hasRoles = rolesList.length > 0;

  return (
    <div className="space-y-2">
      <div className="relative">
        <select
          name="role"
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          className={`appearance-none w-full px-4 py-3 rounded-xl border ${
            error ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"
          } focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <option value="" disabled>
            {hasRoles ? "-- Select a Role --" : "No roles found"}
          </option>

          {rolesList
            .filter((roleObj) => roleObj && typeof roleObj === "object")
            .map((roleObj, index) => (
            <option key={roleObj.id || roleObj.name || index} value={roleObj.id || ""}>
              {getRoleLabel(roleObj)}
            </option>
          ))}

          <option value={addNewValue}>+ Add New Role</option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {!hasRoles ? (
        <p className="pl-1 text-xs font-medium text-[var(--color-primary)]">
          No roles found. Choose &quot;+ Add New Role&quot; to create one instantly.
        </p>
      ) : (
        <p className="pl-1 text-xs font-medium text-gray-500">
          Need another role? Choose &quot;+ Add New Role&quot; from the dropdown.
        </p>
      )}

      {error ? (
        <p className="pl-1 text-xs font-medium text-red-500">{error}</p>
      ) : null}
    </div>
  );
}

export default RoleDropdown;
