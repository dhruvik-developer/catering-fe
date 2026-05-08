import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../../Components/public/Navbar";
import Hero from "../../Components/public/Hero";
import Features from "../../Components/public/Features";
import HowItWorks from "../../Components/public/HowItWorks";
import Testimonials from "../../Components/public/Testimonials";
import CTA from "../../Components/public/CTA";
import Footer from "../../Components/public/Footer";

const LandingPage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const target = document.getElementById(id);
    if (target) {
      // Defer to next frame so the section is laid out before scrolling.
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [hash]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
