/* eslint-disable react/prop-types */
import { forwardRef } from "react";

const VARIANT_CLASSES = {
  primary:
    "bg-[var(--color-primary)] text-white hover:brightness-95 focus-visible:ring-[var(--color-primary)]/30 shadow-sm",
  secondary:
    "bg-white text-[var(--color-primary)] border border-[var(--color-primary)]/70 hover:bg-[var(--color-primary-soft)] focus-visible:ring-[var(--color-primary)]/20",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus-visible:ring-gray-300",
  soft:
    "bg-[var(--color-primary-soft)] text-[var(--color-primary)] hover:bg-[var(--color-primary-tint)] focus-visible:ring-[var(--color-primary)]/20",
  danger:
    "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400/40 shadow-sm",
  "danger-ghost":
    "bg-transparent text-red-500 hover:bg-red-50 hover:text-red-600 focus-visible:ring-red-400/30",
};

const SIZE_CLASSES = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-1.5",
  lg: "px-5 py-3 text-sm gap-2",
};

/**
 * Consistent button primitive.
 *
 *   variant:   "primary" | "secondary" | "ghost" | "soft" | "danger" | "danger-ghost"
 *   size:      "sm" | "md" | "lg"
 *   leftIcon / rightIcon: React nodes
 *   loading:   show spinner and disable
 *   fullWidth: stretch to container width
 */
const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    leftIcon,
    rightIcon,
    loading = false,
    fullWidth = false,
    disabled = false,
    type = "button",
    className = "",
    children,
    ...rest
  },
  ref
) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass =
    disabled || loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 ${variantClass} ${sizeClass} ${widthClass} ${disabledClass} ${className}`}
      {...rest}
    >
      {loading ? (
        <span
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : (
        leftIcon
      )}
      {children ? <span>{children}</span> : null}
      {!loading && rightIcon ? rightIcon : null}
    </button>
  );
});

export default Button;
