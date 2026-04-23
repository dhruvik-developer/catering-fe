/* eslint-disable react/prop-types */

/**
 * Consistent page header for list/detail views.
 *
 *   icon      React node rendered in a soft-tinted square (e.g. <FiUsers />)
 *   title     main heading
 *   subtitle  supporting text (e.g. "12 vendors registered")
 *   actions   right-aligned slot for buttons
 *   filters   optional row rendered below, full-width, wraps on small screens
 */
function PageHeader({
  icon,
  title,
  subtitle,
  actions,
  filters,
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {icon ? (
            <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary-text)] shrink-0">
              {icon}
            </div>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
              {title}
            </h2>
            {subtitle ? (
              <p className="text-sm text-gray-400 truncate">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {filters ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">{filters}</div>
      ) : null}
    </div>
  );
}

export default PageHeader;
