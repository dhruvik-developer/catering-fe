import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./landing.css";

const FONT_LINK_ID = "ps-marketing-fonts";

const ensureFontsLoaded = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById(FONT_LINK_ID)) return;

  const preconnectGoog = document.createElement("link");
  preconnectGoog.rel = "preconnect";
  preconnectGoog.href = "https://fonts.googleapis.com";
  document.head.appendChild(preconnectGoog);

  const preconnectGstatic = document.createElement("link");
  preconnectGstatic.rel = "preconnect";
  preconnectGstatic.href = "https://fonts.gstatic.com";
  preconnectGstatic.crossOrigin = "anonymous";
  document.head.appendChild(preconnectGstatic);

  const link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700;800&display=swap";
  document.head.appendChild(link);
};

const PublicLayout = () => {
  useEffect(() => {
    ensureFontsLoaded();
    document.body.classList.add("is-public-host");
    const previousTitle = document.title;
    document.title = "Trayza — Catering Business Management Platform";
    return () => {
      document.body.classList.remove("is-public-host");
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="public-site min-h-screen">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
