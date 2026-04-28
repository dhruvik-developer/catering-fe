/* eslint-disable react/prop-types */

function PdfShareFullIngredientComponent({
  eventAddress,
  eventDate,
  eventTime,
  estimatedPersons,
  ingredients,
  navigate,
  downloadPDF,
  businessProfile,
}) {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 font-sans text-gray-800 bg-gradient-to-br from-[var(--color-primary-tint)] via-[var(--color-primary-tint)] to-[var(--color-primary-tint)]">
      {/* Action Bar (Top) */}
      <div className="flex justify-between items-center gap-3 mb-6 w-full max-w-4xl no-print-button">
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
        className="relative bg-[var(--color-primary-tint)]/30 backdrop-blur-sm shadow-[0_20px_50px_rgba(132,92,189,0.15)] rounded-2xl overflow-hidden w-full max-w-4xl border border-white/50 ring-1 ring-[var(--color-primary-soft)] xl:w-[60%]"
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
            <div className="inline-block bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border border-[var(--color-primary-border)]/30 shadow-sm mt-2">
              <span className="text-sm font-bold text-[var(--color-primary)] tracking-widest uppercase">
                Share Full Order Item
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)]"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                  Address
                </p>
                <p className="text-base font-semibold text-gray-800 bg-gray-50 p-3 border border-gray-100 rounded-lg">
                  {eventAddress || "Not Provided"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                  Estimated Persons
                </p>
                <p className="text-xl font-extrabold text-[var(--color-primary)]">
                  {estimatedPersons || "0"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                  Date & Time
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {eventDate || "-"}{" "}
                  <span className="text-gray-500 font-normal">
                    ({eventTime || "-"})
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Ingredients List */}
          <div className="space-y-6">
            {ingredients.map((category, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden border-gray-100/80 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-[0_8px_30px_rgba(132,92,189,0.08)]"
              >
                <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[var(--color-primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      ></path>
                    </svg>
                    {category.category}
                  </h3>
                  <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 text-xs font-bold px-2.5 py-1 rounded-full">
                    {category.items.length} Items
                  </span>
                </div>

                <ul className="divide-y divide-gray-50">
                  {category.items.map((item, i) => (
                    <li
                      key={i}
                      className={`p-5 hover:bg-gray-50/50 transition-colors ${!item.party_name ? "bg-red-50/30" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${!item.party_name ? "bg-red-500" : "bg-[var(--color-primary-tint)]"}`}
                          ></div>
                          <span
                            className={`text-base font-medium ${!item.party_name ? "text-red-700" : "text-gray-800"}`}
                          >
                            {item.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
                          Total: {item.quantity}
                        </span>
                      </div>

                      {item.party_name ? (
                        <div className="ml-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 bg-gray-50/80 p-3 rounded-lg border border-gray-100/80 mt-2">
                          <p className="flex items-center gap-1.5">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              ></path>
                            </svg>
                            Vendor:{" "}
                            <strong className="text-gray-800 font-semibold">
                              {item.party_name}
                            </strong>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            Delivery:{" "}
                            <strong className="text-[var(--color-primary)]">
                              {item.date} ({item.time})
                            </strong>
                          </p>
                        </div>
                      ) : (
                        <div className="ml-5 text-sm text-red-500/80 font-medium italic mt-1">
                          * Vendor Info Pending
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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

export default PdfShareFullIngredientComponent;
