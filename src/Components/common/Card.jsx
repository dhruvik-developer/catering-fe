/* eslint-disable react/prop-types */

const PADDING_CLASSES = {
  none: "",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

/**
 * Surface container with consistent radius, shadow and optional hover.
 *
 *   padding:   "none" | "sm" | "md" | "lg"
 *   hoverable: adds a subtle hover lift
 *   as:        element tag, defaults to "div"
 */
function Card({
  as: Tag = "div",
  padding = "md",
  hoverable = false,
  className = "",
  children,
  ...rest
}) {
  const padClass = PADDING_CLASSES[padding] ?? PADDING_CLASSES.md;
  const hoverClass = hoverable
    ? "transition-all duration-200 hover:shadow-md hover:border-[var(--color-primary-border)]"
    : "";

  return (
    <Tag
      className={`bg-white rounded-xl border border-gray-100 shadow-sm ${padClass} ${hoverClass} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Card;
