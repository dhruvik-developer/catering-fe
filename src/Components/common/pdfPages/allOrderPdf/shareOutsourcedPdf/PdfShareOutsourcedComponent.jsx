/* eslint-disable react/prop-types */

function PdfShareOutsourcedComponent({
  eventAddress,
  formattedDate,
  deliveryTime,
  vendorGroups,
  downloadPDF,
  shareOnWhatsApp,
  navigate,
  businessProfile,
}) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 font-sans text-gray-800 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Action Bar (Top) */}
      <div className="flex justify-end gap-3 mb-6 w-full max-w-3xl xl:w-[50%] no-print-button">
        <button
          className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl shadow-md hover:bg-gray-50 hover:text-[#845cbd] hover:border-[#845cbd]/30 focus:ring-4 focus:ring-purple-100 transition-all cursor-pointer group font-semibold text-sm"
          onClick={() => navigate("/all-order")}
          title="Back to Orders"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <button
          className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl shadow-md hover:bg-[#20bd5a] focus:ring-4 focus:ring-green-200 transition-all cursor-pointer group font-semibold text-sm"
          onClick={shareOnWhatsApp}
          title="Share on WhatsApp"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.783-1.472-1.751-1.645-2.049-.173-.298-.018-.458.13-.607.134-.135.298-.348.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.572c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </button>

        <button
          className="flex items-center gap-2 px-6 py-3 bg-[#845cbd] text-white rounded-xl shadow-md hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-all cursor-pointer group font-semibold text-sm"
          onClick={downloadPDF}
          title="Download PDF"
        >
          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </button>
      </div>

      <div
        id="pdf-content"
        className="relative bg-amber-50/30 backdrop-blur-sm shadow-[0_20px_50px_rgba(132,92,189,0.15)] rounded-2xl overflow-hidden w-full max-w-3xl border border-white/50 ring-1 ring-purple-100/50 xl:w-[50%]"
      >
        {/* Watermark */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <img src="/logo1.png" alt="Watermark" className="w-[80%] max-w-[500px] h-auto object-contain" />
        </div>
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#845cbd]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-pink-500/5 to-transparent blur-3xl pointer-events-none" />
        {/* Top Bar */}
        <div className="relative h-2 w-full bg-gradient-to-r from-[#845cbd] via-purple-400 to-[#845cbd] z-10" />

        <div className="relative z-10 p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#845cbd] to-purple-600 tracking-wide uppercase mb-2 drop-shadow-sm">
              {businessProfile?.caters_name || "radha Sweet & Caterers"}
            </h2>
            <div className="inline-flex items-center justify-center gap-3 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border border-purple-100 shadow-sm mt-2">
              <span className="text-sm font-bold text-[#845cbd] tracking-widest uppercase">
                Outsourced Items Supply
              </span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#845cbd]" />
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
                  <p className="text-base font-semibold text-[#845cbd] bg-purple-50 px-3 py-1 rounded-md inline-block">
                    {deliveryTime || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Grouped by Vendor */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#845cbd] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#845cbd] rounded-full inline-block" />
              Outsourced Items
            </h3>

            {vendorGroups && vendorGroups.length > 0 ? (
              <div className="space-y-6">
                {vendorGroups.map((vg, vIdx) => (
                  <div key={vIdx} className="bg-white border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden border-gray-100/80">
                    {/* Vendor Header */}
                    <div className="px-6 py-3 bg-purple-50 border-b border-purple-100 flex items-center gap-2">
                      <span className="text-sm font-bold text-[#845cbd]">🏢 {vg.vendor_name || "Unassigned"}</span>
                    </div>
                    <ul className="divide-y divide-gray-50">
                      {vg.items.map((item, iIdx) => (
                        <li
                          key={iIdx}
                          className="flex justify-between items-center px-6 py-4 hover:bg-[#845cbd]/[0.02] transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-[#845cbd]/70 font-bold text-xs">
                              {iIdx + 1}
                            </div>
                            <span className="text-base font-medium text-gray-800">{item.item_name}</span>
                          </div>
                          <span className="text-base font-bold text-[#845cbd] bg-purple-50/50 px-4 py-1.5 rounded-lg border border-purple-100/50">
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
