/* eslint-disable react/prop-types */

function PdfShareIngredientComponent({
  eventAddress,
  formattedDate,
  deliveryTime,
  selectedItems,
  downloadPDF,
  shareOnWhatsApp,
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

        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl shadow-md opacity-80 cursor-default font-semibold text-sm"
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

          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl shadow-md opacity-80 cursor-default font-semibold text-sm"
            title="Sharing Disabled"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.672 1.433 5.66 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Share on WhatsApp
          </button>
        </div>
      </div>

      <div
        id="pdf-content"
        className="relative bg-[var(--color-primary-tint)]/30 backdrop-blur-sm shadow-[0_20px_50px_rgba(132,92,189,0.15)] rounded-2xl overflow-hidden w-full max-w-3xl border border-white/50 ring-1 ring-[var(--color-primary-soft)] xl:w-[50%]"
      >
        {/* Watermark Logo Container */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <img
            src={businessProfile?.logo || "/logo1.png"}
            alt="Watermark"
            className="w-[80%] max-w-[500px] h-auto object-contain"
          />
        </div>
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-[var(--color-primary-tint)]/5 to-transparent blur-3xl pointer-events-none"></div>
        {/* Top Accent Bar */}

        <div className="relative z-10 p-10">
          {/* Header Section */}
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
              {[...new Set(selectedItems.map((item) => item.category))].map(
                (category, i) => (
                  <span
                    key={i}
                    className="text-sm font-bold text-[var(--color-primary)] tracking-widest uppercase"
                  >
                    {category}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)]"></div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                  Delivery Address
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {eventAddress || "-"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 mt-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                    Delivery Date
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {formattedDate || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                    Delivery Time
                  </p>
                  <p className="text-base font-semibold text-[var(--color-primary)] bg-[var(--color-primary-tint)] px-3 py-1 rounded-md inline-block">
                    {deliveryTime || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients List */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full inline-block"></span>
              Ingredients List
            </h3>

            {selectedItems?.length > 0 ? (
              <div className="bg-white border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden border-gray-100/80">
                <ul className="divide-y divide-gray-50">
                  {selectedItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center px-6 py-4 hover:bg-[var(--color-primary)]/[0.02] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[var(--color-primary-tint)] flex items-center justify-center text-[var(--color-primary)]/70 font-bold text-xs">
                          {index + 1}
                        </div>
                        <span className="text-base font-medium text-gray-800">
                          {item.itemName}
                        </span>
                      </div>
                      <span className="text-base font-bold text-[var(--color-primary)] bg-[var(--color-primary-tint)]/50 px-4 py-1.5 rounded-lg border border-[var(--color-primary-border)]/30/50">
                        {item.totalQuantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 italic text-sm">
                No items found.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-gray-400 text-xs border-t border-gray-100 pt-6">
            <p>
              Generated by{" "}
              {businessProfile?.caters_name || "radha Sweet & Caterers"} System
            </p>
          </div>
        </div>{" "}
        {/* End relative z-10 */}
      </div>{" "}
      {/* End pdf-content */}
    </div>
  );
}

export default PdfShareIngredientComponent;
