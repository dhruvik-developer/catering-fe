import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LuStar as Star, LuQuote as Quote } from "react-icons/lu";

const TESTIMONIALS = [
  {
    name: "Rajesh Patel",
    role: "Owner, Royal Caterers",
    initial: "R",
    content:
      "Trayza transformed how we run events. From quotation to invoice, everything is seamless — our team saves three hours a day, easily.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Manager, Spice Route Events",
    initial: "P",
    content:
      "The stock alerts alone are worth it. We never run out of ingredients during peak season anymore, and our wastage has dropped sharply.",
    rating: 5,
  },
  {
    name: "Amit Verma",
    role: "Founder, Grand Feast Catering",
    initial: "A",
    content:
      "GST billing used to be a nightmare. Trayza handles invoices, payment tracking, and expense reports automatically. Brilliant product.",
    rating: 5,
  },
];

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs sm:text-sm font-semibold text-[var(--ps-primary)] uppercase tracking-[0.16em]">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4 text-[var(--ps-foreground)]">
            Loved by <span className="ps-text-gradient">Modern Caterers</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
              className="relative p-7 rounded-2xl bg-white border border-[var(--ps-border)] ps-shadow-card"
            >
              <Quote
                className="absolute top-5 right-5 text-[var(--ps-primary)]/15"
                size={42}
              />
              <div className="flex gap-1 mb-4 relative">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    className="fill-[var(--ps-primary)] text-[var(--ps-primary)]"
                  />
                ))}
              </div>
              <p className="text-[var(--ps-foreground)] mb-6 leading-relaxed relative">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full ps-bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                  {t.initial}
                </span>
                <div>
                  <p className="font-semibold text-[var(--ps-foreground)] text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-[var(--ps-muted)]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
