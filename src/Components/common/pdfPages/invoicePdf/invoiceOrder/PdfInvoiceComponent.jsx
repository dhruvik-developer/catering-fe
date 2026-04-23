/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import Loader from "../../../Loader";
import { Rules } from "../../../rules";
import BaseImage from "../../../BaseImage";

function PdfInvoiceComponent({
  pdfInvoice,
  loading,
  generateUniqueKey,
  downloadPDF,
  businessProfile,
}) {
  const navigate = useNavigate();
  const itemData = pdfInvoice;

  const uniqueKey = itemData?.id
    ? `TRZ-B${itemData.id.toString().padStart(4, "0")}`
    : "TRZ-UNSAVED";

  // Aggregate estimated persons safely from all sessions
  const totalPersons =
    itemData?.sessions?.reduce(
      (acc, s) => acc + (parseInt(s.estimated_persons) || 0),
      0
    ) || 0;

  // Pick first valid address as primary, or fallback
  const primaryAddress =
    itemData?.sessions?.find((s) => s.event_address?.trim())?.event_address ||
    "Not Provided";

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 font-sans text-gray-800 bg-gradient-to-br from-[var(--color-primary-tint)] via-[var(--color-primary-tint)] to-[var(--color-primary-tint)]">
      {loading ? (
        <Loader message="Loading PDF View..." />
      ) : (
        <>
          {/* Action Bar (Top) */}
          <div className="flex justify-end gap-3 mb-6 w-full max-w-4xl no-print-button">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl shadow-md hover:bg-gray-50 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary-soft)] transition-all cursor-pointer group font-semibold text-sm"
              onClick={() => navigate(-1)}
              title="Back"
            >
              <svg
                className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Back
            </button>

            <button
              className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl shadow-md hover:bg-[var(--color-primary-text)] focus:ring-4 focus:ring-[var(--color-primary-soft)] transition-all cursor-pointer group font-semibold text-sm"
              onClick={downloadPDF}
              title="Download PDF"
            >
              <svg
                className="w-4 h-4 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
              Download PDF
            </button>
          </div>

          <div
            id="pdf-content"
            className={`relative bg-[var(--color-primary-tint)]/30 backdrop-blur-sm shadow-[0_20px_50px_rgba(132,92,189,0.15)] rounded-2xl overflow-hidden w-full max-w-4xl border border-white/50 ring-1 ring-[var(--color-primary-soft)] ${itemData?.rule === false ? "xl:w-[60%]" : ""}`}
          >
            {/* Watermark Logo Container */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <BaseImage
                src="/logo1.png"
                alt="Watermark"
                className="w-[80%] max-w-[600px] h-auto object-contain"
              />
            </div>
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-[var(--color-primary-tint)]0/5 to-transparent blur-3xl pointer-events-none"></div>
            {/* Top Accent Bar */}
            <div className="relative h-2 w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-soft)] to-[var(--color-primary)] z-10"></div>
            <div className="relative z-10">
              {/* Header Section */}
              <div className="px-10 pt-10 pb-6 flex flex-row items-center justify-between border-b 0 border-gray-100/80">
                {/* Company Info */}
                <div className="flex flex-col items-start w-2/3">
                  <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] tracking-wide uppercase mb-1 drop-shadow-sm">
                    {businessProfile?.caters_name || "radha Sweet & Caterers"}
                  </h2>
                  <p className="text-sm text-gray-600 font-medium whitespace-nowrap">
                    {businessProfile?.godown_address ||
                      "C1 1201 Pragati IT Park, Near AR Mall, Mota Varaccha, Surat"}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    Contact:{" "}
                    <span className="font-semibold text-gray-800">
                      {businessProfile?.phone_number || "99988 67024"}
                    </span>
                    {businessProfile?.whatsapp_number ? (
                      <>
                        {" "}
                        / WhatsApp:{" "}
                        <span className="font-semibold text-gray-800">
                          {businessProfile.whatsapp_number}
                        </span>
                      </>
                    ) : (
                      ""
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-2 bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg mb-2 border border-[var(--color-primary-border)]/30 shadow-sm w-max">
                    <BaseImage
                      src="/fssai.png"
                      alt="FSSAI Logo"
                      className="w-12 h-auto object-contain"
                    />
                    <p className="text-xs font-semibold text-gray-700">
                      {businessProfile?.fssai_number || "207*********80"}
                    </p>
                  </div>
                </div>

                {/* Logo & Ref */}
                <div className="flex flex-col items-end w-1/3">
                  <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-50 mb-3">
                    <BaseImage
                      src="/logo1.png"
                      alt="radha Logo"
                      className="w-28 h-auto object-contain drop-shadow-sm"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--color-primary)] font-bold tracking-widest uppercase mb-1">
                      Invoice Number
                    </p>
                    <p className="text-sm font-bold text-gray-700 bg-[var(--color-primary-tint)]/80 border border-[var(--color-primary-border)]/30 px-3 py-1.5 rounded-lg shadow-inner">
                      {uniqueKey}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-10 py-2 bg-[var(--color-primary)]/5 text-center border-b border-gray-200">
                <h2 className="text-xl font-bold text-[var(--color-primary)] tracking-[0.2em] uppercase">
                  Order Invoice
                </h2>
              </div>

              {/* Order Details Section (Grid Layout) */}
              <div className="px-10 py-8">
                <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full inline-block"></span>
                  Customer & Event Details
                </h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-5 text-sm">
                  <div className="flex flex-col bg-white p-3 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <span className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">
                      Customer Name
                    </span>
                    <span className="font-bold text-gray-900 capitalize text-base">
                      {itemData?.name || "-"}
                    </span>
                  </div>
                  <div className="flex flex-col bg-white p-3 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <span className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">
                      Mobile Number
                    </span>
                    <span className="font-bold text-gray-900 text-base">
                      {itemData?.mobile_no || "-"}
                    </span>
                  </div>

                  {/* Event address moved to session level */}

                  <div className="flex flex-col bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">
                      Estimated Persons
                    </span>
                    <span className="font-extrabold text-[var(--color-primary)] text-xl">
                      {totalPersons}
                    </span>
                  </div>
                  <div className="flex flex-col bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">
                      Advance Amount
                    </span>
                    <span className="font-extrabold text-[var(--color-primary)] text-xl">
                      ₹ {Number(itemData?.advance_amount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col col-span-2 mt-2">
                    <span className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">
                      Reference
                    </span>
                    <span className="font-medium text-gray-600 capitalize bg-gray-50 w-max px-3 py-1 rounded-md border border-gray-100">
                      {itemData?.reference || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-dashed border-gray-200 mx-10"></div>

              {/* Schedule, Menu, and Extra Services mapped per Session */}
              <div className="px-10 py-8">
                <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full inline-block"></span>
                  Event Schedule & Menu Selection
                </h3>

                {itemData?.sessions && itemData.sessions.length > 0 ? (
                  <div className="space-y-6">
                    {itemData.sessions.map((session, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-white border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden border-[var(--color-primary-border)]/30 transition-all page-break-inside-avoid"
                      >
                        {/* Session Header */}
                        <div className="bg-gradient-to-r from-[var(--color-primary-tint)] to-white px-5 py-3 border-b border-[var(--color-primary-border)]/30 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-extrabold text-gray-800 tracking-wide">
                              {session.event_date}
                            </span>
                            <span className="text-xs bg-[var(--color-primary)] text-white font-extrabold px-3 py-1 rounded-md tracking-wide">
                              {session.event_time}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                            <span>
                              {session.estimated_persons || 0} Persons
                            </span>
                            <span className="bg-[var(--color-primary-tint)] text-[var(--color-primary-text)] px-2.5 py-1 rounded-md">
                              ₹{Number(session.per_dish_amount || 0).toFixed(2)}
                              /plate
                            </span>
                          </div>
                        </div>

                        {/* Event Address for Session */}
                        {session.event_address &&
                          session.event_address.trim() && (
                            <div className="px-5 py-2.5 bg-gray-50/80 border-b border-[var(--color-primary-tint)] flex items-start gap-2 text-sm">
                              <span className="font-bold text-[var(--color-primary)] uppercase tracking-wider text-xs shrink-0 mt-0.5">
                                Location:
                              </span>
                              <span className="font-medium text-gray-700 leading-tight capitalize">
                                {session.event_address.trim()}
                              </span>
                            </div>
                          )}

                        {/* Dishes List */}
                        {session.selected_items &&
                        Object.keys(session.selected_items).length > 0 ? (
                          <div className="p-5 flex flex-col gap-5">
                            {Object.entries(session.selected_items).map(
                              ([categoryName, items], catIdx) => {
                                if (!items || items.length === 0) return null;
                                return (
                                  <div key={catIdx}>
                                    <h4 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3 border-b border-gray-100 pb-1">
                                      {categoryName}
                                    </h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                                      {items.map((dishObj, dIdx) => {
                                        const dishName =
                                          typeof dishObj === "string"
                                            ? dishObj
                                            : dishObj?.name ||
                                              dishObj?.dishName ||
                                              "-";
                                        if (!dishName) return null;
                                        return (
                                          <li
                                            key={dIdx}
                                            className="flex items-center group"
                                          >
                                            <span className="text-[var(--color-primary)]/50 font-bold text-xs w-6 group-hover:text-[var(--color-primary)] transition-colors">
                                              {(dIdx + 1)
                                                .toString()
                                                .padStart(2, "0")}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700 capitalize group-hover:text-[var(--color-primary)] transition-colors">
                                              {dishName}
                                            </span>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-gray-400 italic text-xs">
                            No specific dishes selected.
                          </div>
                        )}

                        {/* Extra Services specific to this session */}
                        {session.extra_service &&
                          session.extra_service.length > 0 &&
                          session.extra_service.some((s) => s.service_name) && (
                            <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                                Extra Services
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {session.extra_service.map((service, exIdx) =>
                                  service.service_name ? (
                                    <span
                                      key={exIdx}
                                      className="text-xs font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm"
                                    >
                                      <span>{service.service_name}</span>
                                      <span className="text-[var(--color-primary)] font-bold border-l border-gray-200 pl-2">
                                        ₹
                                        {Number(service.amount || 0).toFixed(2)}
                                      </span>
                                    </span>
                                  ) : null
                                )}
                              </div>
                            </div>
                          )}

                        {/* Waiter Service specific to this session */}
                        {session.waiter_service &&
                          session.waiter_service.type && (
                            <div className="px-5 py-4 bg-[var(--color-primary-tint)]/40 border-t border-[var(--color-primary-border)]/30">
                              <span className="text-xs font-bold text-[var(--color-primary-tint)]0 uppercase tracking-wider block mb-2">
                                Waiter Service
                              </span>
                              <div className="space-y-2">
                                {(session.waiter_service.entries &&
                                session.waiter_service.entries.length > 0
                                  ? session.waiter_service.entries
                                  : [session.waiter_service]
                                ).map((ws, wsIdx) => (
                                  <div key={wsIdx} className="flex flex-wrap gap-2 items-center">
                                    <span className="text-xs font-semibold text-white bg-[var(--color-primary)] px-3 py-1.5 rounded-lg shadow-sm">
                                      {ws.type}
                                    </span>
                                    <span className="text-xs font-medium text-gray-700 bg-white border border-[var(--color-primary-border)]/30 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                                      <span className="text-gray-500">Count:</span>
                                      <span className="font-bold text-gray-800">{ws.count}</span>
                                    </span>
                                    <span className="text-xs font-medium text-gray-700 bg-white border border-[var(--color-primary-border)]/30 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                                      <span className="text-gray-500">Rate:</span>
                                      <span className="font-bold text-[var(--color-primary)]">₹{Number(ws.rate || 0).toFixed(2)}/head</span>
                                    </span>
                                    <span className="text-xs font-medium text-gray-700 bg-white border border-[var(--color-primary-border)]/30 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                                      <span className="text-gray-500">Total:</span>
                                      <span className="font-bold text-[var(--color-primary)]">₹{Number(ws.amount || 0).toFixed(2)}</span>
                                    </span>
                                    {ws.notes ? (
                                      <span className="text-xs text-gray-500 italic w-full">{ws.notes}</span>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 italic text-sm">
                    No sessions or menu items configured.
                  </div>
                )}
              </div>

              {/* Description Section */}
              {itemData?.description && itemData.description !== "N" && (
                <div className="px-10 py-6 bg-white border-t border-gray-100 page-break-inside-avoid">
                  <div className="bg-gradient-to-r from-[var(--color-primary-tint)] to-[var(--color-primary-tint)] border border-[var(--color-primary-border)]/30 p-5 rounded-xl shadow-[0_2px_10px_rgba(251,191,36,0.05)]">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-[var(--color-primary-tint)]0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <p className="text-sm font-bold text-[var(--color-primary-text)] uppercase tracking-wide">
                        Order Notes
                      </p>
                    </div>
                    <p className="text-sm text-[var(--color-primary-text)] leading-relaxed whitespace-pre-wrap ml-7">
                      {itemData.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Rules Section */}
              {itemData?.rule === true && (
                <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/80 page-break-inside-avoid">
                  <Rules />
                </div>
              )}

              {/* Footer / Branding */}
              <div className="px-10 py-5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-text)] text-white text-center">
                <p className="text-xs font-bold tracking-[0.2em] text-white/90 uppercase">
                  Thank you for choosing{" "}
                  {businessProfile?.caters_name || "radha Sweet & Caterers"}
                </p>
                <p className="text-[10px] text-white/60 mt-1 opacity-75">
                  Generated with precision and care
                </p>
              </div>
            </div>{" "}
            {/* End relative z-10 */}
          </div>
        </>
      )}
    </div>
  );
}

export default PdfInvoiceComponent;
