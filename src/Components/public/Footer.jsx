import { Link } from "react-router-dom";
import {
  LuPhone as Phone,
  LuMail as Mail,
  LuMapPin as MapPin,
  LuLinkedin as Linkedin,
  LuTwitter as Twitter,
  LuInstagram as Instagram,
} from "react-icons/lu";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--ps-border)] bg-white pt-14 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-xl ps-bg-gradient-primary flex items-center justify-center text-white font-bold">
              T
            </span>
            <span className="text-xl font-bold tracking-tight text-[var(--ps-foreground)]">
              Trayza
            </span>
          </Link>
          <p className="text-sm text-[var(--ps-muted)] leading-relaxed max-w-xs">
            Complete catering management — bookings, billing, kitchen, staff,
            and inventory in one beautifully simple platform.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {[
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Instagram, href: "#", label: "Instagram" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-lg border border-[var(--ps-border)] flex items-center justify-center text-[var(--ps-muted)] hover:text-[var(--ps-primary)] hover:border-[var(--ps-primary)]/40 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[var(--ps-foreground)] mb-4">
            Product
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "Features", href: "/#features" },
              { label: "How It Works", href: "/#how-it-works" },
              { label: "Testimonials", href: "/#testimonials" },
              { label: "Pricing", href: "/#pricing" },
            ].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-[var(--ps-muted)] hover:text-[var(--ps-foreground)] transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[var(--ps-foreground)] mb-4">
            Company
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/contact"
                className="text-[var(--ps-muted)] hover:text-[var(--ps-foreground)] transition-colors"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <a
                href="mailto:trayzacms@gmail.com"
                className="text-[var(--ps-muted)] hover:text-[var(--ps-foreground)] transition-colors"
              >
                Sales Enquiry
              </a>
            </li>
            <li>
              <a
                href="mailto:trayzacms@gmail.com"
                className="text-[var(--ps-muted)] hover:text-[var(--ps-foreground)] transition-colors"
              >
                Support
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[var(--ps-foreground)] mb-4">
            Get in Touch
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="tel:9574989298"
                className="flex items-start gap-2 text-[var(--ps-muted)] hover:text-[var(--ps-foreground)] transition-colors"
              >
                <Phone size={16} className="text-[var(--ps-primary)] mt-0.5" />
                +91 95749 89298
              </a>
            </li>
            <li>
              <a
                href="mailto:trayzacms@gmail.com"
                className="flex items-start gap-2 text-[var(--ps-muted)] hover:text-[var(--ps-foreground)] transition-colors"
              >
                <Mail size={16} className="text-[var(--ps-primary)] mt-0.5" />
                trayzacms@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2 text-[var(--ps-muted)]">
              <MapPin size={16} className="text-[var(--ps-primary)] mt-0.5" />
              Evenmore Infotech, India
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[var(--ps-border)] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[var(--ps-muted)]">
        <p>© {year} Trayza. Powered by Evenmore Infotech. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-[var(--ps-foreground)] transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-[var(--ps-foreground)] transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
