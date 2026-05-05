/* eslint-disable react/prop-types */

/**
 * Gradient page hero. Drop-in replacement for inline Paper+Avatar+Typography
 * blocks that every page was building by hand. Pages get a consistent brand-
 * colored header with title, subtitle, optional eyebrow text, action slot
 * (right side), and optional chip row.
 *
 *   icon       React node rendered in a frosted square (e.g. <FiClipboard />)
 *   eyebrow    small uppercase text above the title (e.g. today's date)
 *   title      main heading (string or React node)
 *   subtitle   supporting text under the title
 *   actions    right-aligned slot (buttons, chips)
 *   chips      additional row below subtitle (status pills, counts)
 *   tone       "primary" (default — uses tenant primary color)
 *              | "neutral" (slate, less brand-loud)
 *
 * Usage:
 *   <PageHero
 *     icon={<FiClipboard />}
 *     title="All Orders"
 *     subtitle="Showing 12 of 240"
 *     actions={<Button>New booking</Button>}
 *   />
 */

const TONE_CLASSES = {
  primary: {
    background:
      "bg-[linear-gradient(135deg,var(--color-primary)_0%,color-mix(in_srgb,var(--color-primary),black_25%)_100%)]",
    glow: "bg-[radial-gradient(circle,rgba(255,255,255,0.22),rgba(255,255,255,0)_70%)]",
    glowSoft:
      "bg-[radial-gradient(circle,rgba(255,255,255,0.12),rgba(255,255,255,0)_70%)]",
    text: "text-[var(--color-primary-contrast,white)]",
    eyebrow: "text-[var(--color-primary-contrast,white)]/80",
    subtitle: "text-[var(--color-primary-contrast,white)]/85",
    iconWrap:
      "bg-white/15 border border-white/25 backdrop-blur text-[var(--color-primary-contrast,white)]",
  },
  neutral: {
    background:
      "bg-[linear-gradient(135deg,#1e293b_0%,#0f172a_100%)]",
    glow: "bg-[radial-gradient(circle,rgba(255,255,255,0.16),rgba(255,255,255,0)_70%)]",
    glowSoft:
      "bg-[radial-gradient(circle,rgba(255,255,255,0.08),rgba(255,255,255,0)_70%)]",
    text: "text-white",
    eyebrow: "text-white/70",
    subtitle: "text-white/80",
    iconWrap: "bg-white/15 border border-white/25 backdrop-blur text-white",
  },
};

function PageHero({
  icon,
  eyebrow,
  title,
  subtitle,
  actions,
  chips,
  tone = "primary",
  className = "",
}) {
  const palette = TONE_CLASSES[tone] || TONE_CLASSES.primary;

  return (
    <section
      className={`relative overflow-hidden rounded-2xl p-5 sm:p-7 mb-4 ${palette.background} ${palette.text} shadow-[0_24px_48px_-28px_rgba(15,23,42,0.55)] ${className}`}
    >
      {/* Decorative glows — pure CSS, no JS, no extra DOM cost */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -right-20 -top-20 w-72 h-72 rounded-full ${palette.glow}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute -left-16 -bottom-24 w-56 h-56 rounded-full ${palette.glowSoft}`}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {icon ? (
            <div
              className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${palette.iconWrap}`}
            >
              {icon}
            </div>
          ) : null}
          <div className="min-w-0">
            {eyebrow ? (
              <p
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] mb-0.5 ${palette.eyebrow}`}
              >
                {eyebrow}
              </p>
            ) : null}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight truncate">
              {title}
            </h2>
            {subtitle ? (
              <p
                className={`mt-1 text-sm sm:text-[15px] max-w-xl ${palette.subtitle}`}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {actions}
          </div>
        ) : null}
      </div>

      {chips ? (
        <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2">
          {chips}
        </div>
      ) : null}
    </section>
  );
}

export default PageHero;
