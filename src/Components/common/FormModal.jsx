/* eslint-disable react/prop-types */
import { FiX } from "react-icons/fi";

function FormModal({
  isOpen,
  title,
  subtitle,
  onClose,
  children,
  footer,
  widthClass = "max-w-md",
  closeDisabled = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 p-2 sm:p-4 backdrop-blur-sm">
      <div
        className={`flex w-full ${widthClass} max-h-[95vh] sm:max-h-[90vh] flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 shrink-0">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={closeDisabled}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
          {children}
        </div>

        {footer ? (
          <div className="border-t border-gray-100 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 shrink-0">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default FormModal;
