/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiX,
  FiPhone,
  FiClock,
  FiUsers,
  FiEye,
  FiList,
} from "react-icons/fi";
import Loader from "../../Components/common/Loader";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE = 2;

// Parse date string in dd-mm-yyyy OR yyyy-mm-dd format
function parseDate(str) {
  if (!str) return null;
  // dd-mm-yyyy or dd/mm/yyyy
  const ddmmyyyy = str.match(/^(\d{1,2})[\-\/](\d{1,2})[\-\/](\d{4})$/);
  if (ddmmyyyy) {
    return new Date(
      Number(ddmmyyyy[3]),
      Number(ddmmyyyy[2]) - 1,
      Number(ddmmyyyy[1])
    );
  }
  // yyyy-mm-dd
  const yyyymmdd = str.match(/^(\d{4})[\-\/](\d{1,2})[\-\/](\d{1,2})/);
  if (yyyymmdd) {
    return new Date(
      Number(yyyymmdd[1]),
      Number(yyyymmdd[2]) - 1,
      Number(yyyymmdd[3])
    );
  }
  // Fallback
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

// Convert a Date object to "YYYY-MM-DD" key
function toDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function CalendarComponent({ orders, loading, navigate }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(null);

  // Build a map: "YYYY-MM-DD" -> [{ order, sessions: [...] }]
  // Each order can appear on multiple dates (one entry per unique date from its sessions).
  // The `sessions` array holds only the sessions that fall on that specific date.
  const ordersByDate = {};

  orders.forEach((order) => {
    if (order.sessions && order.sessions.length > 0) {
      // Group sessions by their event_date
      const sessionsByDate = {};
      order.sessions.forEach((session) => {
        const d = parseDate(session.event_date);
        if (d && !isNaN(d.getTime())) {
          const key = toDateKey(d);
          if (!sessionsByDate[key]) sessionsByDate[key] = [];
          sessionsByDate[key].push(session);
        }
      });

      // For each unique date, add an entry
      Object.entries(sessionsByDate).forEach(([dateKey, dateSessions]) => {
        if (!ordersByDate[dateKey]) ordersByDate[dateKey] = [];
        ordersByDate[dateKey].push({
          order,
          sessions: dateSessions,
        });
      });
    } else {
      // Fallback: order without sessions — use order.event_date
      const d = parseDate(order.event_date);
      if (d && !isNaN(d.getTime())) {
        const key = toDateKey(d);
        if (!ordersByDate[key]) ordersByDate[key] = [];
        ordersByDate[key].push({
          order,
          sessions: [],
        });
      }
    }
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const goToToday = () =>
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));

  const formatDateKey = (day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isToday = (day) =>
    today.getDate() === day &&
    today.getMonth() === month &&
    today.getFullYear() === year;

  // Calculate rows needed for this specific month (no wasted empty rows)
  const TOTAL_ROWS = Math.ceil((firstDayOfMonth + daysInMonth) / 7);
  const TOTAL_CELLS = TOTAL_ROWS * 7;

  // Sidebar data
  const sidebarEntries = selectedDate ? ordersByDate[selectedDate] || [] : [];
  const sidebarDateObj = selectedDate
    ? new Date(selectedDate + "T00:00:00")
    : null;
  const sidebarDateFormatted = sidebarDateObj
    ? sidebarDateObj.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Count total unique orders for sidebar header
  const sidebarOrderCount = sidebarEntries.length;

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <Loader message="Loading Calendar..." />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 105px)", overflow: "hidden" }}
    >
      {/* Month Navigation Header */}
      <div className="bg-white rounded-xl shadow-lg px-6 py-4 mb-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
            <FiCalendar className="text-[var(--color-primary-text)]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {MONTH_NAMES[month]} {year}
            </h2>
            <p className="text-sm text-gray-400">
              {orders.length} total order{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={month}
            onChange={(e) =>
              setCurrentMonth(new Date(year, parseInt(e.target.value), 1))
            }
            className="text-sm font-semibold text-gray-700 bg-[var(--color-primary-soft)] border border-[var(--color-primary-soft)] rounded-lg px-3 py-2.5 cursor-pointer hover:bg-[var(--color-primary-soft)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23845cbd' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              paddingRight: "30px",
            }}
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={idx} value={idx}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) =>
              setCurrentMonth(new Date(parseInt(e.target.value), month, 1))
            }
            className="text-sm font-semibold text-gray-700 bg-[var(--color-primary-soft)] border border-[var(--color-primary-soft)] rounded-lg px-3 py-2.5 cursor-pointer hover:bg-[var(--color-primary-soft)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23845cbd' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              paddingRight: "30px",
            }}
          >
            {Array.from(
              { length: 11 },
              (_, i) => today.getFullYear() - 5 + i
            ).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <div className="w-px h-8 bg-gray-200" />

          <button
            onClick={goToToday}
            className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white hover:brightness-95 transition-colors cursor-pointer shadow-sm"
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            className="p-3 rounded-lg bg-[var(--color-primary-soft)] hover:bg-[var(--color-primary-soft)] text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <FiChevronLeft size={22} />
          </button>
          <button
            onClick={nextMonth}
            className="p-3 rounded-lg bg-[var(--color-primary-soft)] hover:bg-[var(--color-primary-soft)] text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-lg flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {DAY_NAMES.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-3 bg-[var(--color-primary-tint)]"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div
          className="grid grid-cols-7 flex-1 min-h-0 overflow-hidden"
          style={{ gridTemplateRows: `repeat(${TOTAL_ROWS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: TOTAL_CELLS }, (_, cellIndex) => {
            const dayNumber = cellIndex - firstDayOfMonth + 1;
            const isValidDay = dayNumber >= 1 && dayNumber <= daysInMonth;

            if (!isValidDay) {
              return (
                <div
                  key={`cell-${cellIndex}`}
                  className="border-r border-b border-gray-100 bg-gray-50/50"
                />
              );
            }

            const dateKey = formatDateKey(dayNumber);
            const dayEntries = ordersByDate[dateKey] || [];
            const todayFlag = isToday(dayNumber);
            const visibleEntries = dayEntries.slice(0, MAX_VISIBLE);
            const extraCount = dayEntries.length - MAX_VISIBLE;
            const isSelected = selectedDate === dateKey;

            return (
              <div
                key={`cell-${cellIndex}`}
                onClick={() => dayEntries.length > 0 && setSelectedDate(dateKey)}
                className={`border-r border-b border-gray-100 flex flex-col overflow-hidden transition-all duration-150
                                    ${todayFlag ? "bg-[var(--color-primary-tint)]" : "bg-white"}
                                    ${dayEntries.length > 0 ? "cursor-pointer hover:bg-[var(--color-primary-tint)]" : ""}
                                    ${isSelected ? "ring-2 ring-[var(--color-primary)] ring-inset bg-[var(--color-primary-tint)]" : ""}
                                `}
              >
                {/* Date Number */}
                <div className="flex items-center justify-between px-2 py-1.5 flex-shrink-0">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full
                                        ${
                                          todayFlag
                                            ? "bg-[var(--color-primary)] text-white"
                                            : dayEntries.length > 0
                                              ? "text-gray-800"
                                              : "text-gray-400"
                                        }`}
                  >
                    {dayNumber}
                  </span>
                  {dayEntries.length > 0 && (
                    <span className="text-[9px] font-bold text-[var(--color-primary)] bg-[var(--color-primary-soft)] px-1.5 py-0.5 rounded-full">
                      {dayEntries.length}
                    </span>
                  )}
                </div>

                {/* Limited Orders Preview — no scroll, clipped */}
                <div className="flex-1 px-1 pb-1 space-y-0.5 overflow-hidden min-h-0">
                  {visibleEntries.map((entry) => (
                    <div
                      key={entry.order.id}
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium truncate bg-[var(--color-primary-soft)] text-[#6b3fa0] border border-[var(--color-primary-soft)]"
                    >
                      {entry.order.name}
                      {entry.sessions.length > 1 && (
                        <span className="ml-1 text-[8px] text-[var(--color-primary)]/70">
                          ({entry.sessions.length} sessions)
                        </span>
                      )}
                    </div>
                  ))}
                  {extraCount > 0 && (
                    <div className="text-[9px] font-bold text-[var(--color-primary)] px-1.5">
                      +{extraCount} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Slide-out Sidebar */}
      {selectedDate && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setSelectedDate(null)}
          />
          <div className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
            {/* Sidebar Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0 bg-[var(--color-primary-soft)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white">
                  <FiCalendar className="text-[var(--color-primary-text)]" size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    {sidebarDateFormatted}
                  </h3>
                  <p className="text-xs text-[var(--color-primary)] font-medium">
                    {sidebarOrderCount} order
                    {sidebarOrderCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-2 rounded-lg hover:bg-white/80 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Sidebar Orders List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {sidebarEntries.map((entry) => {
                const { order, sessions } = entry;
                // Get all unique times for this date
                const sessionTimes = sessions
                  .map((s) => s.event_time)
                  .filter(Boolean);
                // Get total estimated persons across sessions on this date
                const totalPersons = sessions.reduce(
                  (sum, s) => sum + (Number(s.estimated_persons) || 0),
                  0
                );
                const fallbackPersons = order.estimated_persons;

                return (
                  <div
                    key={order.id}
                    className="rounded-xl overflow-hidden bg-[var(--color-primary-tint)] border border-[var(--color-primary-border)] hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-primary-soft)] border-b border-[var(--color-primary-border)]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs">
                          {order.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800">
                            {order.name}
                          </h4>
                          {order.reference && (
                            <p className="text-[10px] text-gray-400">
                              Ref: {order.reference}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {sessions.length > 1 && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[var(--color-primary-tint)] text-[var(--color-primary-tint)]">
                            {sessions.length} sessions
                          </span>
                        )}
                        {order.status && (
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              order.status === "done"
                                ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-500"
                                  : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                            }`}
                          >
                            {order.status}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-4 py-3">
                      {/* Order info row */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {order.mobile_no && (
                          <span className="flex items-center gap-1">
                            <FiPhone size={11} className="text-[var(--color-primary-text)]" />
                            {order.mobile_no}
                          </span>
                        )}
                        {(totalPersons > 0 || fallbackPersons) && (
                          <span className="flex items-center gap-1">
                            <FiUsers size={11} className="text-[var(--color-primary-text)]" />
                            {totalPersons > 0
                              ? totalPersons
                              : fallbackPersons}{" "}
                            persons
                          </span>
                        )}
                      </div>

                      {/* Sessions detail for this date */}
                      {sessions.length > 0 && (
                        <div className="mt-2.5 space-y-1.5">
                          {sessions.map((session, sIdx) => (
                            <div
                              key={session.id || sIdx}
                              className="flex items-center gap-3 text-xs bg-white rounded-lg px-3 py-2 border border-[var(--color-primary-border)]"
                            >
                              <span className="flex items-center gap-1 text-[var(--color-primary)] font-semibold min-w-0">
                                <FiClock
                                  size={11}
                                  className="flex-shrink-0"
                                />
                                {session.event_time || "No time"}
                              </span>
                              {session.estimated_persons && (
                                <span className="flex items-center gap-1 text-gray-500">
                                  <FiUsers
                                    size={11}
                                    className="text-[var(--color-primary-text)] flex-shrink-0"
                                  />
                                  {session.estimated_persons} persons
                                </span>
                              )}
                              {session.per_dish_amount && (
                                <span className="text-gray-400 text-[10px]">
                                  ₹{session.per_dish_amount}/plate
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Fallback for orders without sessions */}
                      {sessions.length === 0 && (
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          {order.event_time && (
                            <span className="flex items-center gap-1">
                              <FiClock
                                size={11}
                                className="text-[var(--color-primary-text)]"
                              />
                              {order.event_time}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-3 border-t border-[var(--color-primary-border)]">
                      <button
                        onClick={() => navigate(`/view-order-details/${order.id}`)}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-[var(--color-primary-soft)] hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-white text-[13px] font-semibold rounded-lg cursor-pointer transition-colors"
                      >
                        <FiEye size={14} /> View Order Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.25s ease-out forwards;
                }
            `}</style>
    </div>
  );
}

export default CalendarComponent;
