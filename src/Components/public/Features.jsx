import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  LuChefHat as ChefHat,
  LuCalendarDays as CalendarDays,
  LuFileText as FileText,
  LuPackage as Package,
  LuReceipt as Receipt,
  LuIndianRupee as IndianRupee,
  LuChartBar as BarChart3,
  LuUsers as Users,
  LuClipboardList as ClipboardList,
  LuChartPie as PieChart,
} from "react-icons/lu";

const FEATURES = [
  {
    icon: ChefHat,
    title: "Menu Management",
    description:
      "Build a rich dish catalog with categories, ingredients, pricing, and beautifully formatted menu cards.",
  },
  {
    icon: CalendarDays,
    title: "Event Scheduling",
    description:
      "Plan multi-day events with date-wise time slots, guest counts, and conflict-free scheduling.",
  },
  {
    icon: FileText,
    title: "Quotation Builder",
    description:
      "Generate polished, itemized quotations with custom branding and one-click PDF export.",
  },
  {
    icon: Package,
    title: "Order Management",
    description:
      "Move every order through a clean 3-step workflow — client, menu, summary — with full status tracking.",
  },
  {
    icon: Receipt,
    title: "GST Billing",
    description:
      "Generate GST-compliant invoices automatically with CGST/SGST/IGST and clean payment ledgers.",
  },
  {
    icon: IndianRupee,
    title: "Expense Tracking",
    description:
      "Categorize every business expense and see your true profitability per event at a glance.",
  },
  {
    icon: BarChart3,
    title: "Inventory Management",
    description:
      "Track ingredient stock in real time with low-stock alerts so peak season never catches you out.",
  },
  {
    icon: Users,
    title: "Client Database",
    description:
      "Build a directory of clients with order history, preferences, and outstanding payments at a glance.",
  },
  {
    icon: ClipboardList,
    title: "Staff Management",
    description:
      "Assign waiters and kitchen staff to events, track attendance, and run fixed/variable payment cycles.",
  },
  {
    icon: PieChart,
    title: "Reports & Analytics",
    description:
      "Live dashboards for revenue, expenses, top dishes, and event performance — exportable any time.",
  },
];

const FeatureCard = ({ feature, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 5) * 0.07 }}
      className="group relative p-6 rounded-2xl bg-white border border-[var(--ps-border)] ps-shadow-card hover:ps-shadow-elevated hover:border-[var(--ps-primary)]/30 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-[var(--ps-primary-soft)] flex items-center justify-center mb-4 group-hover:ps-bg-gradient-primary transition-all duration-300">
        <Icon
          size={22}
          className="text-[var(--ps-primary)] group-hover:text-white transition-colors"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-[var(--ps-foreground)]">
        {feature.title}
      </h3>
      <p className="text-sm text-[var(--ps-muted)] leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
};

const Features = () => {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-50px" });

  return (
    <section id="features" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 16 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs sm:text-sm font-semibold text-[var(--ps-primary)] uppercase tracking-[0.16em]">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4 text-[var(--ps-foreground)]">
            Everything You Need to{" "}
            <span className="ps-text-gradient">Run Your Catering</span>
          </h2>
          <p className="text-[var(--ps-muted)] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            One platform to manage dishes, orders, invoices, stock, staff, and
            expenses — so you can focus on creating amazing food experiences.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
