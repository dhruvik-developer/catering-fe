/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";
import { Rules } from "../../rules";
import BaseImage from "../../BaseImage";

function PdfEditDishComponenet({
  itemData,
  generateUniqueKey,
  handleUpdateBooking,
  downloadPDF,
  shareOnWhatsApp,
  businessProfile,
}) {
  const navigate = useNavigate();

  // Since Edit Dish creates a dummy payload mimicking the API backend format, we can render it natively.
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
    <div className="flex flex-col justify-center items-center min-h-screen p-4 font-sans text-gray-800 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Action Bar (Top) */}
      <div className="flex justify-end gap-3 w-full mb-6 max-w-4xl xl:w-[60%] no-print-button">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 py-3 px-6 bg-white text-gray-700 shadow-md border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-[#845cbd] hover:border-[#845cbd]/30 focus:ring-4 focus:ring-purple-100 transition-all cursor-pointer font-bold text-sm tracking-wide group"
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
          Cancel
        </button>

        <button
          onClick={shareOnWhatsApp}
          className="flex items-center gap-2 py-3 px-6 bg-[#25D366] text-white rounded-xl shadow-md hover:bg-[#20bd5a] focus:ring-4 focus:ring-green-200 transition-all cursor-pointer font-bold text-sm tracking-wide uppercase group"
          title="Share on WhatsApp"
        >
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.783-1.472-1.751-1.645-2.049-.173-.298-.018-.458.13-.607.134-.135.298-.348.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.572c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </button>

        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 py-3 px-6 bg-[#845cbd] text-white rounded-xl shadow-md hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-all cursor-pointer font-bold text-sm tracking-wide uppercase group"
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
          Print Preview
        </button>
        <button
          onClick={handleUpdateBooking}
          className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-md hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 transition-all cursor-pointer font-bold text-sm tracking-wide uppercase group"
        >
          Confirm & Update Booking
        </button>
      </div>

      <div
        id="pdf-content"
        className={`relative bg-amber-50/30 backdrop-blur-sm shadow-[0_20px_50px_rgba(132,92,189,0.15)] rounded-2xl overflow-hidden w-full max-w-4xl border border-white/50 ring-1 ring-purple-100/50 ${itemData?.rule === false ? "xl:w-[60%]" : ""}`}
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
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#845cbd]/10 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-pink-500/5 to-transparent blur-3xl pointer-events-none"></div>
        {/* Top Accent Bar */}
        <div className="relative h-2 w-full bg-gradient-to-r from-[#845cbd] via-purple-400 to-[#845cbd] z-10"></div>
        <div className="relative z-10">
          {/* Header Section */}
          <div className="px-10 pt-10 pb-6 flex flex-row items-center justify-between border-b 0 border-gray-100/80">
            {/* Company Info */}
            <div className="flex flex-col items-start w-2/3">
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#845cbd] to-purple-600 tracking-wide uppercase mb-1 drop-shadow-sm">
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
              <div className="flex items-center gap-2 mt-2 bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg mb-2 border border-purple-100 shadow-sm w-max">
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
                <p className="text-xs text-[#845cbd] font-bold tracking-widest uppercase mb-1">
                  Order Ref
                </p>
                <p className="text-sm font-bold text-gray-700 bg-purple-50/80 border border-purple-100 px-3 py-1.5 rounded-lg shadow-inner">
                  {uniqueKey}
                </p>
              </div>
            </div>
          </div>

          <div className="px-10 py-2 bg-orange-50/50 text-center border-b border-orange-100/50">
            <h2 className="text-xl font-bold text-orange-600 tracking-[0.2em] uppercase">
              Pending Edits Overview
            </h2>
          </div>

          {/* Order Details Section (Grid Layout) */}
          <div className="px-10 py-8">
            <h3 className="text-sm font-bold text-[#845cbd] uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#845cbd] rounded-full inline-block"></span>
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
                <span className="font-extrabold text-[#845cbd] text-xl">
                  {totalPersons}
                </span>
              </div>
              <div className="flex flex-col bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">
                  Advance Amount
                </span>
                <span className="font-extrabold text-green-600 text-xl">
                  ₹ {itemData?.advance_amount || 0}
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
            <h3 className="text-sm font-bold text-[#845cbd] uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#845cbd] rounded-full inline-block"></span>
              Event Schedule & Menu Selection
            </h3>

            {itemData?.sessions && itemData.sessions.length > 0 ? (
              <div className="space-y-6">
                {itemData.sessions.map((session, sIdx) => (
                  <div
                    key={sIdx}
                    className="bg-white border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden border-purple-100 transition-all page-break-inside-avoid"
                  >
                    {/* Session Header */}
                    <div className="bg-gradient-to-r from-purple-50 to-white px-5 py-3 border-b border-purple-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold text-gray-800 tracking-wide">
                          {session.event_date}
                        </span>
                        <span className="text-xs bg-[#845cbd] text-white font-extrabold px-3 py-1 rounded-md tracking-wide">
                          {session.event_time}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                        <span>{session.estimated_persons || 0} Persons</span>
                        <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-md">
                          ₹{session.per_dish_amount}/plate
                        </span>
                      </div>
                    </div>

                    {/* Event Address for Session */}
                    {session.event_address && session.event_address.trim() && (
                      <div className="px-5 py-2.5 bg-gray-50/80 border-b border-purple-50 flex items-start gap-2 text-sm">
                        <span className="font-bold text-[#845cbd] uppercase tracking-wider text-xs shrink-0 mt-0.5">
                          Location:
                        </span>
                        <span className="font-medium text-gray-700 leading-tight capitalize">
                          {session.event_address.trim()}
                        </span>
                      </div>
                    )}

                    {/* Dishes List */}
                    <div className="p-5">
                      {session.selected_items &&
                      Object.keys(session.selected_items).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                          {Object.keys(session.selected_items).map(
                            (category, index) => (
                              <div
                                key={index}
                                className="bg-gray-50/50 border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden border-gray-100/80 transition-all"
                              >
                                <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-5 py-2 border-b border-gray-100 flex justify-between items-center">
                                  <p className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">
                                    {category}
                                  </p>
                                  <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {session.selected_items[category].length}
                                  </span>
                                </div>
                                <ul className="divide-y divide-gray-100">
                                  {session.selected_items[category].map(
                                    (dishItem, dIdx) => {
                                      const dishName =
                                        typeof dishItem === "string"
                                          ? dishItem
                                          : dishItem?.name ||
                                            dishItem?.dishName ||
                                            "-";
                                      return (
                                        <li
                                          key={dIdx}
                                          className="flex items-center px-4 py-2 hover:bg-gray-100/50 transition-colors group"
                                        >
                                          <span className="text-[#845cbd]/50 font-bold text-[10px] w-5 group-hover:text-[#845cbd] transition-colors">
                                            {(dIdx + 1)
                                              .toString()
                                              .padStart(2, "0")}
                                          </span>
                                          <span className="text-xs font-medium text-gray-700 capitalize group-hover:text-[#845cbd] transition-colors">
                                            {dishName}
                                          </span>
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-400 italic text-xs">
                          No specific dishes selected.
                        </div>
                      )}
                    </div>

                    {/* Extra Services specific to this session */}
                    {session.extra_service &&
                      session.extra_service.length > 0 &&
                      session.extra_service.some(
                        (s) => s.extra || s.service_name
                      ) && (
                        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                            Extra Services
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {session.extra_service.map((service, exIdx) => {
                              const serviceName =
                                service.service_name ||
                                (typeof service.extra === "string"
                                  ? service.extra
                                  : null);
                              if (!serviceName) return null;
                              return (
                                <span
                                  key={exIdx}
                                  className="text-xs font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm"
                                >
                                  <span>{serviceName}</span>
                                  <span className="text-[#845cbd] font-bold border-l border-gray-200 pl-2">
                                    ₹{service.amount}
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    {/* Waiter Service specific to this session */}
                    {session.waiter_service &&
                      ((session.waiter_service.entries &&
                        session.waiter_service.entries.length > 0) ||
                        session.waiter_service.type) && (
                        <div className="px-5 py-4 bg-indigo-50/40 border-t border-indigo-100">
                          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block mb-2">
                            Waiter Service
                          </span>
                          <div className="space-y-2">
                            {(session.waiter_service.entries &&
                            session.waiter_service.entries.length > 0
                              ? session.waiter_service.entries
                              : [session.waiter_service]
                            ).map((ws, wsIdx) => (
                              <div
                                key={wsIdx}
                                className="flex flex-wrap gap-2 items-center"
                              >
                                <span className="text-xs font-semibold text-white bg-[#845cbd] px-3 py-1.5 rounded-lg shadow-sm">
                                  {ws.type}
                                </span>
                                <span className="text-xs font-medium text-gray-700 bg-white border border-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                                  <span className="text-gray-500">Count:</span>
                                  <span className="font-bold text-gray-800">{ws.count}</span>
                                </span>
                                <span className="text-xs font-medium text-gray-700 bg-white border border-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                                  <span className="text-gray-500">Rate:</span>
                                  <span className="font-bold text-[#845cbd]">₹{Number(ws.rate || 0).toFixed(2)}/head</span>
                                </span>
                                <span className="text-xs font-medium text-gray-700 bg-white border border-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                                  <span className="text-gray-500">Total:</span>
                                  <span className="font-bold text-green-600">₹{Number(ws.amount || 0).toFixed(2)}</span>
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
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-5 rounded-xl shadow-[0_2px_10px_rgba(251,191,36,0.05)]">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-amber-500"
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
                  <p className="text-sm font-bold text-amber-800 uppercase tracking-wide">
                    Order Notes
                  </p>
                </div>
                <p className="text-sm text-amber-900/80 leading-relaxed whitespace-pre-wrap ml-7">
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
          <div className="px-10 py-5 bg-gradient-to-r from-[#845cbd] to-purple-700 text-white text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-white/90 uppercase">
              {businessProfile?.caters_name || "radha Sweet & Caterers"}
            </p>
          </div>
        </div>{" "}
        {/* End relative z-10 */}
      </div>
    </div>
  );
}

export default PdfEditDishComponenet;
