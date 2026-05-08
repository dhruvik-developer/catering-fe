import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LuMenu as Menu, LuX as X } from "react-icons/lu";

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const buildHref = (hash) => (isLandingPage ? hash : `/${hash}`);

  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-md bg-white/80 border-b border-[var(--ps-border)] shadow-[0_2px_24px_-12px_rgba(132,92,189,0.18)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="Trayza home"
        >
          <span className="w-9 h-9 rounded-xl ps-bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            T
          </span>
          <span className="text-xl font-bold tracking-tight text-[var(--ps-foreground)]">
            Trayza
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={buildHref(item.href)}
              className="text-sm font-medium text-[var(--ps-muted)] hover:text-[var(--ps-foreground)] transition-colors"
            >
              {item.label}
            </a>
          ))}
          <NavLink
            to="/contact"
            className="px-5 py-2.5 rounded-lg ps-bg-gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            Contact Us
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="lg:hidden p-2 -mr-2 rounded-lg text-[var(--ps-foreground)] hover:bg-[var(--ps-primary-soft)] transition-colors"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white border-b border-[var(--ps-border)]"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={buildHref(item.href)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--ps-muted)] hover:text-[var(--ps-foreground)] hover:bg-[var(--ps-primary-soft)] transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <NavLink
                to="/contact"
                className="mt-2 px-5 py-3 rounded-lg ps-bg-gradient-primary text-white text-sm font-semibold text-center"
              >
                Contact Us
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
