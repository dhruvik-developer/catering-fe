import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { LuArrowRight as ArrowRight } from "react-icons/lu";

const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-24 px-6">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto text-center rounded-[2rem] ps-bg-gradient-hero p-10 sm:p-14 lg:p-16 relative overflow-hidden ps-shadow-elevated"
      >
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10">
          <span className="inline-block text-xs font-semibold text-white/85 uppercase tracking-[0.2em] mb-4">
            Get Started
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Ready to Streamline Your Catering?
          </h2>
          <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Join growing caterers who have simplified their operations with
            Trayza. Get in touch for a personalised walkthrough — no credit card
            required.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-white text-[var(--ps-primary-strong)] font-semibold hover:bg-white/95 transition-colors"
            >
              Contact Us
              <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              See Features
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
