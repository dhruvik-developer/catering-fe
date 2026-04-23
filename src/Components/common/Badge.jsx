/* eslint-disable react/prop-types */

const VARIANT_CLASSES = {
  primary:
    "bg-[var(--color-primary)] text-white border-[var(--color-primary-border)]/40",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  danger: "bg-red-50 text-red-600 border-red-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  neutral: "bg-gray-100 text-gray-600 border-gray-200",
};

const SIZE_CLASSES = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-[11px]",
};

const DOT_CLASSES = {
  primary: "bg-[var(--color-primary)]",
  success: "bg-emerald-500",
  danger: "bg-red-500",
  warning: "bg-amber-500",
  neutral: "bg-gray-400",
};

/**
 * Small status/label pill.
 *
 *   variant: "primary" | "success" | "danger" | "warning" | "neutral"
 *   size:    "sm" | "md"
 *   dot:     true to render a colored leading dot
 *   icon:    optional React node (overrides dot)
 */
function Badge({
  variant = "neutral",
  size = "md",
  dot = false,
  icon,
  className = "",
  children,
}) {
  const variantClass = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.neutral;
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wide ${variantClass} ${sizeClass} ${className}`}
    >
      {icon ? (
        icon
      ) : dot ? (
        <span
          className={`w-1.5 h-1.5 rounded-full ${DOT_CLASSES[variant] ?? DOT_CLASSES.neutral}`}
        />
      ) : null}
      {children}
    </span>
  );
}

export default Badge;
