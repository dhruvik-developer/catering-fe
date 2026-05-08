import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  LuMail as Mail,
  LuPhone as Phone,
  LuMapPin as MapPin,
  LuSend as Send,
  LuCircleCheck as CheckCircle2,
} from "react-icons/lu";

import Navbar from "../../Components/public/Navbar";
import Footer from "../../Components/public/Footer";
import { submitContactLead } from "../../api/publicLeads";

const INITIAL_FORM = {
  full_name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{6,20}$/;

const validate = (form) => {
  const errors = {};
  if (!form.full_name.trim() || form.full_name.trim().length < 2) {
    errors.full_name = "Please enter your full name.";
  }
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = "Please enter a valid email.";
  }
  if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!form.message.trim() || form.message.trim().length < 5) {
    errors.message = "Please tell us a bit more.";
  }
  return errors;
};

const fieldClass = (hasError) =>
  `w-full px-4 py-3 rounded-lg border bg-white text-[var(--ps-foreground)] text-sm focus:outline-none transition placeholder:text-[var(--ps-muted)]/70 ${
    hasError
      ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
      : "border-[var(--ps-border)] focus:border-[var(--ps-primary)] focus:ring-2 focus:ring-[var(--ps-primary)]/20"
  }`;

const ContactPage = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSending(true);
    try {
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        message: form.message.trim(),
        source: "website",
      };
      const data = await submitContactLead(payload);
      if (data?.status) {
        toast.success("Thanks! We'll be in touch shortly.");
        setForm(INITIAL_FORM);
        setDone(true);
      } else {
        toast.error(data?.message || "Could not send your message. Please try again.");
      }
    } catch (err) {
      const apiErrors = err?.response?.data?.data;
      if (apiErrors && typeof apiErrors === "object") {
        const fieldMessages = Object.fromEntries(
          Object.entries(apiErrors).map(([k, v]) => [
            k,
            Array.isArray(v) ? v[0] : String(v),
          ])
        );
        setErrors(fieldMessages);
      }
      toast.error(
        err?.response?.data?.message ||
          "Could not connect to the server. Please try again later."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="ps-bg-gradient-subtle">
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
          <div
            className="ps-blob"
            style={{
              width: 420,
              height: 420,
              top: -160,
              right: -120,
              background: "rgba(132, 92, 189, 0.18)",
            }}
          />
          <div className="relative max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <span className="text-xs sm:text-sm font-semibold text-[var(--ps-primary)] uppercase tracking-[0.16em]">
                Get in Touch
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 mb-4 text-[var(--ps-foreground)]">
                Contact <span className="ps-text-gradient">Us</span>
              </h1>
              <p className="text-[var(--ps-muted)] max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
                Have questions about Trayza? We&rsquo;d love to hear from you.
                Send us a message and our team will respond within one business
                day.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-2 space-y-6"
              >
                <div className="p-6 rounded-2xl bg-white border border-[var(--ps-border)] ps-shadow-card">
                  <h3 className="text-lg font-semibold mb-5 text-[var(--ps-foreground)]">
                    Contact Information
                  </h3>
                  <div className="space-y-5">
                    {[
                      {
                        Icon: Mail,
                        label: "Email",
                        value: "trayzacms@gmail.com",
                        href: "mailto:trayzacms@gmail.com",
                      },
                      {
                        Icon: Phone,
                        label: "Phone",
                        value: "+91 95749 89298",
                        href: "tel:9574989298",
                      },
                      {
                        Icon: MapPin,
                        label: "Address",
                        value: "Evenmore Infotech, India",
                      },
                    ].map(({ Icon, label, value, href }) => (
                      <div key={label} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[var(--ps-primary-soft)] flex items-center justify-center shrink-0">
                          <Icon size={18} className="text-[var(--ps-primary)]" />
                        </div>
                        <div>
                          <p className="text-xs text-[var(--ps-muted)]">
                            {label}
                          </p>
                          {href ? (
                            <a
                              href={href}
                              className="font-medium text-[var(--ps-foreground)] hover:text-[var(--ps-primary)] transition-colors"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className="font-medium text-[var(--ps-foreground)]">
                              {value}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl ps-bg-gradient-primary text-white">
                  <h4 className="text-base font-semibold mb-1.5">
                    Need a personalized walkthrough?
                  </h4>
                  <p className="text-sm text-white/85 leading-relaxed">
                    Our team can demo Trayza tailored to your catering business
                    in 20 minutes — no commitment required.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="lg:col-span-3"
              >
                {done ? (
                  <div className="p-10 rounded-2xl bg-white border border-[var(--ps-border)] ps-shadow-card text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle2 size={28} className="text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--ps-foreground)] mb-2">
                      Message received
                    </h3>
                    <p className="text-[var(--ps-muted)] max-w-md mx-auto mb-6">
                      Thanks for reaching out. A member of our team will get
                      back to you within one business day.
                    </p>
                    <button
                      type="button"
                      onClick={() => setDone(false)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--ps-border)] text-[var(--ps-foreground)] font-medium hover:bg-[var(--ps-primary-soft)] transition-colors text-sm"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={onSubmit}
                    noValidate
                    className="p-6 sm:p-8 rounded-2xl bg-white border border-[var(--ps-border)] ps-shadow-card space-y-5"
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-[var(--ps-foreground)] mb-1.5">
                          Full Name *
                        </label>
                        <input
                          name="full_name"
                          value={form.full_name}
                          onChange={onChange}
                          maxLength={120}
                          placeholder="Your name"
                          className={fieldClass(!!errors.full_name)}
                          required
                        />
                        {errors.full_name && (
                          <p className="mt-1.5 text-xs text-rose-600">
                            {errors.full_name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--ps-foreground)] mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={onChange}
                          maxLength={255}
                          placeholder="you@company.com"
                          className={fieldClass(!!errors.email)}
                          required
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-xs text-rose-600">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-[var(--ps-foreground)] mb-1.5">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={onChange}
                          maxLength={20}
                          placeholder="+91 98765 43210"
                          className={fieldClass(!!errors.phone)}
                        />
                        {errors.phone && (
                          <p className="mt-1.5 text-xs text-rose-600">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--ps-foreground)] mb-1.5">
                          Company
                        </label>
                        <input
                          name="company"
                          value={form.company}
                          onChange={onChange}
                          maxLength={120}
                          placeholder="Your company name"
                          className={fieldClass(!!errors.company)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--ps-foreground)] mb-1.5">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={onChange}
                        maxLength={2000}
                        rows={5}
                        placeholder="Tell us about your catering business and how we can help…"
                        className={`${fieldClass(!!errors.message)} resize-none`}
                        required
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-xs text-rose-600">
                          {errors.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                      <p className="text-xs text-[var(--ps-muted)]">
                        We respect your privacy and never share your details.
                      </p>
                      <button
                        type="submit"
                        disabled={sending}
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-lg ps-bg-gradient-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {sending ? (
                          <>
                            <span className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
