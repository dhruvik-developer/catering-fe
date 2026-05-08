import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  LuUserPlus as UserPlus,
  LuUtensils as Utensils,
  LuClipboardCheck as ClipboardCheck,
} from "react-icons/lu";

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "Add Client & Event",
    description:
      "Capture client details, set event dates and time slots, and specify guest counts for each session.",
  },
  {
    icon: Utensils,
    step: "02",
    title: "Build the Menu",
    description:
      "Pick dishes from your catalog, customize per slot, and finalise pricing with an instant quotation.",
  },
  {
    icon: ClipboardCheck,
    step: "03",
    title: "Deliver & Invoice",
    description:
      "Run the event, mark deliveries complete, and generate a GST-ready invoice with one click.",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="relative py-24 px-6 ps-bg-gradient-subtle">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs sm:text-sm font-semibold text-[var(--ps-primary)] uppercase tracking-[0.16em]">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4 text-[var(--ps-foreground)]">
            Three Simple Steps
          </h2>
          <p className="text-[var(--ps-muted)] max-w-xl mx-auto text-base sm:text-lg">
            Trayza&rsquo;s intuitive workflow takes you from booking to
            delivery in three steps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-transparent via-[var(--ps-primary)]/40 to-transparent" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.15 }}
                className="relative text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 ps-shadow-card"
              >
                <div className="relative mx-auto w-20 h-20 rounded-full ps-bg-gradient-primary flex items-center justify-center mb-6 ps-shadow-elevated">
                  <Icon size={28} className="text-white" />
                  <span className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-white border-2 border-[var(--ps-primary)] text-[var(--ps-primary)] text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--ps-foreground)]">
                  {step.title}
                </h3>
                <p className="text-[var(--ps-muted)] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
