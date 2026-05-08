import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LuArrowRight as ArrowRight,
  LuSparkles as Sparkles,
  LuTrendingUp as TrendingUp,
  LuCircleCheck as CheckCircle2,
} from "react-icons/lu";

const HeroDashboardMock = () => (
  <div className="relative rounded-2xl overflow-hidden border border-[var(--ps-border)] bg-white ps-shadow-elevated">
    {/* Top bar */}
    <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--ps-border)] bg-[var(--ps-primary-tint)]">
      <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
      <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
      <span className="ml-3 text-xs font-medium text-[var(--ps-muted)]">
        trayza.app/dashboard
      </span>
    </div>

    <div className="grid grid-cols-12 gap-3 p-4 sm:p-5">
      {/* Sidebar */}
      <div className="hidden sm:flex col-span-3 flex-col gap-1.5 p-3 rounded-xl bg-[var(--ps-primary-soft)]">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ps-accent-foreground)] mb-2">
          Trayza
        </div>
        {["Dashboard", "Orders", "Menu", "Quotations", "Invoices", "Stock"].map(
          (item, i) => (
            <div
              key={item}
              className={`text-[11px] px-2.5 py-1.5 rounded-md font-medium ${
                i === 0
                  ? "bg-white text-[var(--ps-primary)] shadow-sm"
                  : "text-[var(--ps-muted)]"
              }`}
            >
              {item}
            </div>
          )
        )}
      </div>

      {/* Main content */}
      <div className="col-span-12 sm:col-span-9 flex flex-col gap-3">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Revenue", value: "₹4.8L", delta: "+18%" },
            { label: "Orders", value: "284", delta: "+24%" },
            { label: "Events", value: "32", delta: "+9%" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-[var(--ps-border)] bg-white p-2.5"
            >
              <p className="text-[10px] text-[var(--ps-muted)] font-medium">
                {s.label}
              </p>
              <p className="text-base font-bold text-[var(--ps-foreground)] leading-tight mt-0.5">
                {s.value}
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                {s.delta}
              </p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-lg border border-[var(--ps-border)] bg-white p-3 h-32 flex items-end gap-1.5">
          {[40, 58, 35, 72, 50, 88, 65, 78, 92, 60, 84, 95].map((h, idx) => (
            <div
              key={idx}
              className="flex-1 rounded-t-md ps-bg-gradient-primary opacity-80"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        {/* Recent orders */}
        <div className="rounded-lg border border-[var(--ps-border)] bg-white p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-[var(--ps-foreground)]">
              Recent Orders
            </p>
            <p className="text-[10px] text-[var(--ps-primary)] font-medium">
              View all
            </p>
          </div>
          {[
            { name: "Sharma Wedding", count: "320 plates", status: "Confirmed" },
            { name: "Patel Birthday", count: "85 plates", status: "Pending" },
          ].map((o) => (
            <div
              key={o.name}
              className="flex items-center justify-between py-1.5 border-t border-[var(--ps-border)]/60 first:border-t-0"
            >
              <div>
                <p className="text-[11px] font-medium text-[var(--ps-foreground)]">
                  {o.name}
                </p>
                <p className="text-[10px] text-[var(--ps-muted)]">{o.count}</p>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  o.status === "Confirmed"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 ps-bg-gradient-subtle" />
      <div
        className="ps-blob"
        style={{
          width: 520,
          height: 520,
          top: -120,
          right: -120,
          background: "rgba(132, 92, 189, 0.18)",
        }}
      />
      <div
        className="ps-blob"
        style={{
          width: 380,
          height: 380,
          bottom: -100,
          left: -120,
          background: "rgba(236, 132, 200, 0.18)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[var(--ps-border)] text-[var(--ps-accent-foreground)] text-xs font-semibold mb-6 shadow-sm"
          >
            <Sparkles size={14} />
            <span>Smart Catering Management Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-6 text-[var(--ps-foreground)]"
          >
            Run Your
            <br />
            <span className="ps-text-gradient">Catering Business</span>
            <br />
            Effortlessly
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg text-[var(--ps-muted)] max-w-xl mb-8 leading-relaxed"
          >
            From menus to invoices, orders to stock — Trayza streamlines every
            aspect of your catering operations with one powerful, intuitive
            platform built for modern caterers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3 sm:gap-4"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-lg ps-bg-gradient-primary text-white font-semibold hover:opacity-90 transition-opacity ps-shadow-elevated"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-lg border border-[var(--ps-border)] bg-white text-[var(--ps-foreground)] font-semibold hover:bg-[var(--ps-primary-soft)] transition-colors"
            >
              See Features
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--ps-muted)]"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              GST-ready invoicing
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Multi-branch support
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Personalized onboarding
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <HeroDashboardMock />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="hidden sm:flex absolute -bottom-8 -left-6 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 ps-shadow-elevated border border-[var(--ps-border)] flex-col gap-0.5 z-10"
          >
            <p className="text-[11px] font-medium text-[var(--ps-muted)]">
              Orders this month
            </p>
            <p className="text-2xl font-bold text-[var(--ps-foreground)] tracking-tight">
              2,847
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="flex items-center justify-center bg-emerald-100 text-emerald-700 rounded-full p-1">
                <TrendingUp size={11} />
              </span>
              <span className="text-[11px] font-semibold text-emerald-700">
                +24% this month
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
