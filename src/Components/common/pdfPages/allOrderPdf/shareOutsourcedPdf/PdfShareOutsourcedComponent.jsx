/* eslint-disable react/prop-types */

function PdfShareOutsourcedComponent({
  eventAddress,
  formattedDate,
  deliveryTime,
  vendorGroups,
  downloadPDF,
  navigate,
  businessProfile,
}) {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 font-sans text-gray-800 bg-gradient-to-br from-[var(--color-primary-tint)] via-[var(--color-primary-tint)] to-[var(--color-primary-tint)]">
      {/* Action Bar (Top) */}
      <div className="flex justify-between mb-6 w-full max-w-3xl no-print-button">
        <button
          className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl shadow-md hover:bg-gray-50 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary-soft)] transition-all cursor-pointer group font-semibold text-sm"
          onClick={() => navigate("/all-order")}
          title="Back to Orders"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
        className="relative bg-[var(--color-primary-tint)]/30 backdrop-blur-sm shadow-[0_20px_50px_rgba(132,92,189,0.15)] rounded-2xl overflow-hidden w-full max-w-3xl border border-white/50 ring-1 ring-[var(--color-primary-soft)] xl:w-[50%]"
      >
        {/* Watermark */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <img src={businessProfile?.logo || "/logo1.png"} alt="Watermark" className="w-[80%] max-w-[500px] h-auto object-contain" />
        </div>
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-[var(--color-primary-tint)]/5 to-transparent blur-3xl pointer-events-none" />
        {/* Top Bar */}


        <div className="relative z-10 p-10">
          {/* Header */}
          <div 
            className="text-center mb-8 p-10 -m-10 border-b border-gray-100"
            style={{ backgroundColor: 'var(--color-primary-border)' }}
          >
            <h2 
              className="text-3xl font-extrabold tracking-wide uppercase mb-2 drop-shadow-sm"
              style={{ color: businessProfile?.color_code || 'var(--color-primary)' }}
            >
              {businessProfile?.caters_name || "Radha Caterers"}
            </h2>
            <div className="inline-flex items-center justify-center gap-3 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border border-[var(--color-primary-border)]/30 shadow-sm mt-2">
              <span className="text-sm font-bold text-[var(--color-primary)] tracking-widest uppercase">
                Outsourced Items Supply
              </span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)]" />
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Delivery Address</p>
                <p className="text-base font-semibold text-gray-800">{eventAddress || "-"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 mt-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Delivery Date</p>
                  <p className="text-base font-semibold text-gray-800">{formattedDate || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Delivery Time</p>
                  <p className="text-base font-semibold text-[var(--color-primary)] bg-[var(--color-primary-tint)] px-3 py-1 rounded-md inline-block">
                    {deliveryTime || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Grouped by Vendor */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full inline-block" />
              Outsourced Items
            </h3>

            {vendorGroups && vendorGroups.length > 0 ? (
              <div className="space-y-6">
                {vendorGroups.map((vg, vIdx) => (
                  <div key={vIdx} className="bg-white border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden border-gray-100/80">
                    {/* Vendor Header */}
                    <div className="px-6 py-3 bg-[var(--color-primary-tint)] border-b border-[var(--color-primary-border)]/30 flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--color-primary)]">🏢 {vg.vendor_name || "Unassigned"}</span>
                    </div>
                    <ul className="divide-y divide-gray-50">
                      {vg.items.map((item, iIdx) => (
                        <li
                          key={iIdx}
                          className="flex justify-between items-center px-6 py-4 hover:bg-[var(--color-primary)]/[0.02] transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-[var(--color-primary-tint)] flex items-center justify-center text-[var(--color-primary)]/70 font-bold text-xs">
                              {iIdx + 1}
                            </div>
                            <span className="text-base font-medium text-gray-800">{item.item_name}</span>
                          </div>
                          <span className="text-base font-bold text-[var(--color-primary)] bg-[var(--color-primary-tint)]/50 px-4 py-1.5 rounded-lg border border-[var(--color-primary-border)]/30/50">
                            {item.quantity ? `${item.quantity} ${item.unit || ""}`.trim() : "-"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 italic text-sm">
                No items selected.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-gray-400 text-xs border-t border-gray-100 pt-6">
            <p>Generated by {businessProfile?.caters_name || "radha Sweet & Caterers"} System</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdfShareOutsourcedComponent;
