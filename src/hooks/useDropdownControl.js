import { useState, useRef, useEffect, useCallback } from "react";

/**
 * useDropdownControl
 *
 * A reusable hook that encapsulates full control logic for
 * suggestion dropdowns / comboboxes in this project.
 *
 * Features:
 *  - Controlled `isOpen` state
 *  - Click-outside detection via `containerRef`
 *  - Escape key closes the dropdown
 *  - Automatic cleanup of event listeners on unmount / close
 *
 * Usage:
 *   const { isOpen, open, close, toggle, containerRef } = useDropdownControl();
 *
 *   <div ref={containerRef} className="relative">
 *     <input onFocus={open} onChange={() => open()} autoComplete="off" />
 *     {isOpen && <ul>...</ul>}
 *   </div>
 */
function useDropdownControl() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return { isOpen, open, close, toggle, containerRef };
}

export default useDropdownControl;
