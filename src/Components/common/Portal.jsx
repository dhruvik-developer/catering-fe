/* eslint-disable react/prop-types */
import { createPortal } from "react-dom";

// Renders children directly under document.body so `position: fixed` always
// resolves against the viewport — not whatever scrolled / transformed
// ancestor happens to wrap the caller. Use this for modal-style overlays
// that must cover the screen regardless of where they're invoked.
function Portal({ children }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

export default Portal;
