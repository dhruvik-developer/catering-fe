/* eslint-disable react/prop-types */
import { FiInbox } from "react-icons/fi";

/**
 * Consistent empty-state panel for lists, grids, and tables.
 *
 * Props:
 *   icon       optional React node, defaults to FiInbox
 *   title      main headline
 *   message    supporting text
 *   action     optional React node (e.g. a button)
 *   tone       "primary" (default) or "muted"
 *   className  passthrough for layout overrides
 */
function EmptyState({
  icon,
  title = "Nothing here yet",
  message,
  action,
  tone = "primary",
  className = "",
}) {
  const palette =
    tone === "muted"
      ? {
          wrap: "bg-gray-50 border-gray-200",
          iconWrap: "bg-white text-gray-400 border-gray-200",
          title: "text-gray-700",
          message: "text-gray-500",
        }
      : {
          wrap: "bg-[var(--color-primary-tint)] border-[var(--color-primary-border)]/30",
          iconWrap:
            "bg-white text-[var(--color-primary)] border-[var(--color-primary-border)]/40",
          title: "text-[var(--color-primary-text)]",
          message: "text-[var(--color-primary-text)]/60",
        };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-10 px-6 rounded-2xl border ${palette.wrap} ${className}`}
    >
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-full border shadow-sm ${palette.iconWrap}`}
      >
        {icon ?? <FiInbox size={26} />}
      </div>
      <p className={`text-lg sm:text-xl font-bold text-center ${palette.title}`}>
        {title}
      </p>
      {message ? (
        <p
          className={`text-sm font-medium text-center max-w-sm ${palette.message}`}
        >
          {message}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
