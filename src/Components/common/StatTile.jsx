/* eslint-disable react/prop-types */

/**
 * Stat tile — accent-tinted icon, large number, label, optional supporting
 * line. Optionally clickable. Designed to live in a flex/grid row of 3-4
 * tiles at the top of a page.
 *
 *   icon     React node, rendered in a tinted square
 *   label    short uppercase label
 *   value    main figure (number or string)
 *   sub      supporting line under the value
 *   accent   hex color used for the icon tint and the hover-border (when onClick)
 *   onClick  optional — makes the tile clickable + lift on hover
 */
function StatTile({ icon, label, value, sub, accent = "#6366f1", onClick }) {
  const interactive = typeof onClick === "function";
  const accentSoft = `${accent}1f`;
  const accentRing = `${accent}33`;

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`flex-1 min-w-[220px] flex items-center gap-3 p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_36px_-30px_rgba(15,23,42,0.55)] transition-all duration-200 ${
        interactive
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_22px_40px_-26px_rgba(15,23,42,0.45)]"
          : ""
      }`}
      style={
        interactive
          ? { "--stat-accent": accent, "--stat-accent-ring": accentRing }
          : undefined
      }
    >
      <div
        className="shrink-0 w-12 h-12 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center"
        style={{
          backgroundColor: accentSoft,
          color: accent,
          boxShadow: `inset 0 0 0 1px ${accentRing}`,
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          {value}
        </p>
        {sub ? (
          <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
        ) : null}
      </div>
    </div>
  );
}

export default StatTile;
