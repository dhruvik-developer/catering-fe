/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import Loader from "../../../Loader";
import BaseImage from "../../../BaseImage";

function PdfBillComponent({
  pdfInvoice,
  loading,
  downloadPDF,
  businessProfile,
}) {
  const navigate = useNavigate();

  //Add coma(,) in numbers
  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Ensure sessions is an array
  const sessions =
    pdfInvoice?.sessions?.length > 0 ? pdfInvoice.sessions : [pdfInvoice];

  // Calculation across all sessions
  const total_dish_price = sessions
    .reduce((acc, curr) => {
      return (
        acc +
        Number(curr?.per_dish_amount || 0) *
          Number(curr?.estimated_persons || 0)
      );
    }, 0)
    .toFixed(2);

  const total_extra_charges = sessions
    .reduce((acc, curr) => {
      return acc + Number(curr?.extra_service_amount || 0);
    }, 0)
    .toFixed(2);

  const total_waiter_charges = sessions
    .reduce((acc, curr) => {
      return acc + Number(curr?.waiter_service_amount || 0);
    }, 0)
    .toFixed(2);
  const hasWaiterService = Number(total_waiter_charges) > 0;

  const totalAmount = (
    Number(total_dish_price) +
    Number(total_extra_charges) +
    Number(total_waiter_charges)
  ).toFixed(2);
  
  const advancePaid = Number(pdfInvoice?.advance_amount || 0);
  const calculatedPendingAmount = pdfInvoice?.payment_status === "PAID"
    ? 0
    : Number(totalAmount) - advancePaid - Number(pdfInvoice?.settlement_amount || 0);
    
  const total_remain_amount = calculatedPendingAmount.toFixed(2);

  // Extra service display logic
  const toExtraServiceArray = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
      } catch {
        return [];
      }
    }
    if (raw && typeof raw === "object") return [raw];
    return [];
  };

  const allExtraServices = sessions.flatMap((session, idx) =>
    toExtraServiceArray(session?.extra_service)
      .filter(
        (service) =>
          service &&
          typeof service === "object" &&
          Object.keys(service).length > 0 &&
          service.service_name
      )
      .map((service) => ({
        ...service,
        session_time: session.event_time || `Session ${idx + 1}`,
        session_date: session.event_date,
      }))
  );
  const hasExtraService = allExtraServices.length > 0;

  // Helper for unique dates
  const uniqueDates = Array.from(
    new Set(sessions.map((s) => s?.event_date).filter(Boolean))
  );
  const displayDate =
    uniqueDates.length > 0 ? uniqueDates.join(", ") : pdfInvoice?.event_date;

  return (
    <div className="flex flex-col items-center min-h-screen p-4 font-sans text-gray-800 bg-gradient-to-br from-[var(--color-primary-tint)] via-[var(--color-primary-tint)] to-[var(--color-primary-tint)]">
      {loading ? (
        <Loader message="Loading PDF View..." />
      ) : (
        <>
          {/* Action Bar (Top) */}
          <div className="flex justify-between mb-6 w-full max-w-4xl no-print-button">
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
              className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl shadow-md opacity-80 cursor-default font-semibold text-sm"
              title="Download Disabled"
            >
              <svg
                className="w-4 h-4"
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
            className={`relative bg-[var(--color-primary-tint)]/30 backdrop-blur-sm shadow-[0_20px_50px_rgba(132,92,189,0.15)] rounded-2xl overflow-hidden w-full max-w-4xl border border-white/50 ring-1 ring-[var(--color-primary-soft)] ${hasExtraService ? "xl:w-[60%]" : "xl:w-[50%]"}`}
          >
            {/* Watermark Logo Container */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <BaseImage
                src={businessProfile?.logo || "/logo1.png"}
                alt="Watermark"
                className="w-[80%] max-w-[500px] h-auto object-contain"
              />
            </div>
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-[var(--color-primary-tint)]/5 to-transparent blur-3xl pointer-events-none"></div>
            {/* Top Accent Bar */}
    
            <div className="relative z-10">
              {/* Header Section */}
              <div 
                className="px-10 pt-10 pb-6 flex flex-row items-start justify-between border-b border-white/10"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {/* Company Info */}
                <div className="flex flex-col items-start w-2/3">
                  <h2 
                    className="text-3xl font-extrabold tracking-wide uppercase mb-1 drop-shadow-sm"
                    style={{ color: 'white' }}
                  >
                    {businessProfile?.caters_name || "Radha Caterers"}
                  </h2>
                  <p className="text-sm text-white/90 font-medium leading-snug">
                    {businessProfile?.godown_address ||
                      "Radha Caterers, second floor, Krishna Row House, Parvati Nagar, Nana Varachha, Surat, Gujarat 395006."}
                  </p>
                  <p className="text-sm text-white/90 font-medium">
                    Contact:{" "}
                    <span className="font-semibold text-white">
                      {businessProfile?.phone_number || "9913244456"}
                    </span>
                    {businessProfile?.whatsapp_number ? (
                      <>
                        {" "}
                        / WhatsApp:{" "}
                        <span className="font-semibold text-white">
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

                {/* Logo Section */}
                <div className="flex flex-col items-end w-1/3">
                  {/* Space for absolute logo */}
                </div>

                {/* Absolute Logo */}
                <div className="absolute top-0 right-0 p-4">
                  <BaseImage
                    src={businessProfile?.logo || "/logo1.png"}
                    alt="radha Logo"
                    className="w-28 h-28 object-contain drop-shadow-sm"
                  />
                </div>
              </div>

              <div className="px-10 py-2 bg-[var(--color-primary)]/5 text-center border-b border-gray-200">
                <h2 className="text-xl font-bold text-[var(--color-primary)] tracking-[0.2em] uppercase">
                  Invoice / Bill
                </h2>
              </div>

              {/* Order Details Section */}
              <div className="px-10 py-6">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full inline-block"></span>
                      Billed To
                    </h3>
                    <div className="text-gray-800">
                      <p className="font-bold text-lg capitalize">
                        {pdfInvoice?.name || "-"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-[var(--color-primary)]/70"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          ></path>
                        </svg>
                        {pdfInvoice?.mobile_no || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                      Invoice Date
                    </p>
                    <p className="text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-center">
                      {displayDate || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* PDF Preview Page Breaker */}
              <div className="page-break w-full h-px bg-transparent"></div>

              {/* Calculation Section (Modern Table) */}
              <div className="px-10 py-4 calculation-section">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-5 p-4 text-left">
                      Session & Per Dish Price
                    </div>
                    <div className="col-span-3 p-4 text-center">Dish Count</div>
                    <div className="col-span-4 p-4 text-right">
                      Total Dish Amount (₹)
                    </div>
                  </div>

                  {/* Main Dish Rows */}
                  {sessions.map((session, index) => {
                    const sessionDishTotal = (
                      Number(session?.per_dish_amount || 0) *
                      Number(session?.estimated_persons || 0)
                    ).toFixed(2);
                    return (
                      <div
                        key={index}
                        className="flex flex-col border-b border-gray-100 last:border-0"
                      >
                        <div className="grid grid-cols-12 text-sm font-medium text-gray-800 items-center">
                          <div className="col-span-5 p-4 text-left flex flex-col gap-1">
                            <span className="text-xs text-[var(--color-primary)] font-bold uppercase tracking-wide">
                              {session.event_time
                                ? session.event_time
                                : `Session ${index + 1}`}
                            </span>
                            <span>
                              ₹ {formatAmount(session?.per_dish_amount || 0)}{" "}
                              <span className="text-xs text-gray-400 font-normal">
                                /plate
                              </span>
                            </span>
                          </div>
                          <div className="col-span-3 p-4 text-center text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-700 font-bold mx-1">
                              x
                            </span>
                            {session?.estimated_persons || 0}
                          </div>
                          <div className="col-span-4 p-4 text-right font-bold text-[var(--color-primary)]">
                            ₹ {formatAmount(sessionDishTotal)}
                          </div>
                        </div>

                        {/* Selected Items Dropdown/List */}
                        {session.selected_items &&
                          Object.keys(session.selected_items).length > 0 && (
                            <div className="px-4 pb-4 pt-0">
                              <div className="bg-white rounded-lg p-3 border border-[var(--color-primary-tint)] shadow-sm">
                                {Object.entries(session.selected_items).map(
                                  ([cat, items]) => {
                                    const count = Array.isArray(items)
                                      ? items.length
                                      : 0;
                                    if (count === 0) return null;
                                    return (
                                      <div
                                        key={cat}
                                        className="mb-1.5 last:mb-0"
                                      >
                                        <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
                                          {cat}:
                                        </span>
                                        <span className="text-xs text-gray-600 ml-2 font-medium">
                                          {items
                                            .map((item) =>
                                              typeof item === "string"
                                                ? item
                                                : item.name
                                            )
                                            .join(", ")}
                                        </span>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}

                  {hasExtraService && (
                    <>
                      {/* Extra Services Header */}
                      <div className="bg-[var(--color-primary-tint)]/50 border-b border-[var(--color-primary-border)]/30 p-3 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider text-center">
                        Extra Charges (Extra Services)
                      </div>

                      {/* Extra Services Rows */}
                      <div className="divide-y divide-gray-50">
                        {allExtraServices.map((service, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 text-sm text-gray-600 items-start hover:bg-gray-50/50 transition-colors py-2"
                          >
                            <div className="col-span-8 p-3 pl-6 flex items-start gap-3">
                              <svg
                                className="w-4 h-4 text-[var(--color-primary-light)] mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                ></path>
                              </svg>
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-800">
                                  {service?.service_name}
                                </span>
                                <span className="text-xs text-gray-400 mt-0.5">
                                  {service?.session_time}{" "}
                                  {service?.session_date
                                    ? `(${service.session_date})`
                                    : ""}
                                </span>
                              </div>
                            </div>
                            <div className="col-span-4 p-3 pr-6 text-right font-medium text-gray-700">
                              ₹ {formatAmount(service?.amount)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Extra Services Subtotal */}
                      <div className="grid grid-cols-12 border-t border-[var(--color-primary-border)]/30/50 bg-gray-50/80 text-sm text-gray-700 items-center">
                        <div className="col-span-8 p-3 pl-6 font-semibold">
                          Total Extra Charges
                        </div>
                        <div className="col-span-4 p-3 pr-6 text-right font-bold">
                          ₹ {formatAmount(total_extra_charges)}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Waiter Service Section */}
                  {hasWaiterService && (
                    <>
                      {/* Waiter Service Header */}
                      <div className="bg-[var(--color-primary-tint)]/60 border-b border-[var(--color-primary-border)]/30 p-3 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider text-center">
                        Waiter Service
                      </div>

                      {/* Waiter Service Rows per session */}
                      <div className="divide-y divide-gray-50">
                        {sessions.map((session, index) => {
                          const waiterEntries =
                            session?.waiter_service?.entries &&
                            session.waiter_service.entries.length > 0
                              ? session.waiter_service.entries
                              : session?.waiter_service?.type
                              ? [session.waiter_service]
                              : [];
                          if (waiterEntries.length === 0) return null;
                          return (
                            <div key={index} className="space-y-1">
                              {waiterEntries.map((ws, wsIndex) => (
                                <div
                                  key={`${index}-${wsIndex}`}
                                  className="grid grid-cols-12 text-sm text-gray-600 items-start hover:bg-gray-50/50 transition-colors py-2"
                                >
                                  <div className="col-span-8 p-3 pl-6 flex items-start gap-3">
                                    <svg
                                      className="w-4 h-4 text-[var(--color-primary-light)] mt-0.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                      ></path>
                                    </svg>
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-gray-800">
                                        {ws.type}
                                      </span>
                                      <span className="text-xs text-gray-400 mt-0.5">
                                        {session.event_time}{" "}
                                        {session.event_date ? `(${session.event_date})` : ""}{" · "}
                                        {ws.count} waiters @ ₹{formatAmount(ws.rate)}/head
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-span-4 p-3 pr-6 text-right font-medium text-gray-700">
                                    ₹ {formatAmount(ws.amount)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>

                      {/* Waiter Service Subtotal */}
                      <div className="grid grid-cols-12 border-t border-[var(--color-primary-border)]/30/50 bg-[var(--color-primary-tint)]/40 text-sm text-gray-700 items-center">
                        <div className="col-span-8 p-3 pl-6 font-semibold">
                          Total Waiter Charges
                        </div>
                        <div className="col-span-4 p-3 pr-6 text-right font-bold text-[var(--color-primary)]">
                          ₹ {formatAmount(total_waiter_charges)}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Gross Total Row */}
                <div className="grid grid-cols-12 border-t-2 border-gray-200 bg-gray-50 text-sm font-bold text-gray-800 items-center rounded-xl overflow-hidden shadow-sm mt-4">
                  <div className="col-span-8 p-4 pl-6">
                    Total Amount (Gross Total)
                  </div>
                  <div className="col-span-4 p-4 pr-6 text-right text-[var(--color-primary)] text-lg">
                    ₹ {formatAmount(totalAmount)}
                  </div>
                </div>
              </div>

              {/* Transactions Section */}
              {pdfInvoice?.transactions &&
                pdfInvoice.transactions.length > 0 && (
                  <div className="px-10 pb-6">
                    <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full inline-block"></span>
                      Payment History
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="p-3 pl-5 text-left">Date</div>
                        <div className="p-3 text-left">Type & Mode</div>
                        <div className="p-3 text-left">Note</div>
                        <div className="p-3 pr-5 text-right">Amount (₹)</div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {pdfInvoice.transactions.map((txn, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-4 text-sm text-gray-700 items-center"
                          >
                            <div className="p-3 pl-5 font-semibold text-gray-800">
                              {txn.transaction_date}
                            </div>
                            <div className="p-3 flex flex-col gap-0.5">
                              <span className="text-xs font-bold text-[var(--color-primary)]">
                                {txn.transaction_type}
                              </span>
                              <span className="text-xs text-gray-500">
                                {txn.payment_mode}
                              </span>
                            </div>
                            <div
                              className="p-3 text-xs text-gray-500 italic truncate"
                              title={txn.note}
                            >
                              {txn.note || "-"}
                            </div>
                            <div className="p-3 pr-5 text-right font-bold text-[var(--color-primary)]">
                              ₹ {formatAmount(txn.amount)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {/* Final Calculation Summary Box */}
              <div className="px-10 pb-10 flex justify-end">
                <div className="w-full sm:w-80 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-5 space-y-3 text-sm">
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="font-medium">Total Dish Amount:</span>
                      <span className="font-bold">
                        ₹ {formatAmount(total_dish_price)}
                      </span>
                    </div>

                    {hasExtraService && (
                      <div className="flex justify-between items-center text-gray-600 pt-2 border-t border-gray-100">
                        <span className="font-medium">Extra Charges:</span>
                        <span className="font-bold text-gray-800">
                          + ₹ {formatAmount(total_extra_charges)}
                        </span>
                      </div>
                    )}

                    {hasWaiterService && (
                      <div className="flex justify-between items-center text-[var(--color-primary)] pt-2 border-t border-gray-100">
                        <span className="font-medium">Waiter Charges:</span>
                        <span className="font-bold">
                          + ₹ {formatAmount(total_waiter_charges)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-gray-800 pt-2 border-t border-gray-100">
                      <span className="font-bold">Total Amount:</span>
                      <span className="font-bold text-[var(--color-primary)]">
                        ₹ {formatAmount(totalAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[var(--color-primary)] pt-3 border-t-2 border-dashed border-gray-200">
                      <span className="font-medium">Advance Paid:</span>
                      <span className="font-bold">
                        - ₹ {formatAmount(pdfInvoice?.advance_amount)}
                      </span>
                    </div>

                    {Number(pdfInvoice?.settlement_amount) > 0 && (
                      <div className="flex justify-between items-center text-[var(--color-primary)] pt-2">
                        <span className="font-medium">Settlement Amount:</span>
                        <span className="font-bold">
                          - ₹ {formatAmount(pdfInvoice?.settlement_amount)}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Net Payable / Balance */}
                  <div className="bg-[var(--color-primary)] p-4 text-white flex justify-between items-center rounded-b-xl">
                    <span className="font-bold text-sm tracking-wider uppercase">
                      Pending Amount
                    </span>
                    <span className="font-extrabold text-xl">
                      ₹ {formatAmount(total_remain_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer / Branding */}
              <div className="px-10 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 text-center">
                <p className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
                  Thank you for your business
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {businessProfile?.caters_name || "radha Sweet & Caterers"}
                </p>
              </div>
            </div>{" "}
            {/* End relative z-10 */}
          </div>{" "}
          {/* End pdf-content */}
        </>
      )}
    </div>
  );
}

export default PdfBillComponent;
