/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  FiArrowLeft,
  FiClipboard,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiBox,
  FiEdit2,
  FiBriefcase,
  FiUser,
} from "react-icons/fi";
import Loader from "../../Components/common/Loader";
import { format } from "date-fns";

import DishTagModal from "../../Components/dishTag/DishTagModal";
import PaymentModal from "../../Components/payment/PaymentModal";
import GroundManagementModal from "../../Components/ground/GroundManagementModal";
import ItemVendorModal from "../../Components/vendor/ItemVendorModal";

function ViewOrderDetailsComponent({
  orderDetails,
  loading,
  handleViewIngredientBySession,
  handleEditOrder,
  handleEditSession,
  handleAssignStaff,
  handleEditAssignment,
  handleOpenSessionChecklistPreview,
  handleSaveGroundManagement,
  handleBack,
  handleOpenTags,
  tagSession,
  onCloseTag,
  catererNameProfile,
  isPaymentModalOpen,
  onOpenPaymentModal,
  onClosePaymentModal,
  onPaymentSuccess,
}) {
  const [groundMgmtSession, setGroundMgmtSession] = useState(null);
  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const [itemVendorSession, setItemVendorSession] = useState(null);

  const showDishes = (session) => {
    setItemVendorSession(session);
  };

  if (loading) {
    return (
      <div className="p-8">
        <Loader message="Loading Order Details..." />
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
        <FiBox size={48} className="mb-4 text-gray-300" />
        <p className="text-xl font-medium text-gray-600">Order not found</p>
        <button
          onClick={handleBack}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-primary)] hover:brightness-95 rounded-lg shadow-md transition-all duration-200"
        >
          <FiArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const {
    id,
    name,
    reference,
    mobile_no,
    event_address,
    advance_amount,
    status,
    event_date,
    estimated_persons,
    sessions = [],
  } = orderDetails;

  // Use sessions array or fallback to root data
  const orderSessions =
    sessions.length > 0
      ? sessions
      : [
          {
            event_date,
            event_time: orderDetails.event_time,
            estimated_persons,
            per_dish_amount: orderDetails.per_dish_amount,
            extra_service_amount: orderDetails.extra_service_amount,
          },
        ];

  // Helper to extract unique dates
  const uniqueDates = Array.from(
    new Set(orderSessions.map((s) => s.event_date))
  ).filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-20 fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleBack}
            className="flex-shrink-0 p-2.5 rounded-xl bg-gray-100/80 hover:bg-white text-gray-600 hover:text-[var(--color-primary)] border border-gray-200 shadow-sm transition-all cursor-pointer group"
          >
            <FiArrowLeft
              size={20}
              className="transform group-hover:-translate-x-1 transition-transform"
            />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              Order Details
              <span
                className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${
                  status === "done"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : status === "cancelled"
                      ? "bg-red-50 text-red-500 border-red-200"
                      : "bg-amber-50 text-amber-600 border-amber-200"
                }`}
              >
                {status || "Pending"}
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <FiClipboard className="text-gray-400" /> ID: #{id}
            </p>
          </div>
        </div>
        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">

          <button
            onClick={() => handleEditOrder(id)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-[var(--color-primary)] hover:brightness-95 rounded-xl shadow-md transition-all duration-200 cursor-pointer"
            title="Edit entire order (all sessions)"
          >
            <FiEdit2 size={16} /> Edit Complete Order
          </button>
        </div>
      </div>

      {/* Customer Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-primary)]"></div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Name & Ref */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FiUsers /> Customer
              </span>
              <span className="text-lg font-bold text-gray-800">
                {name || "—"}
              </span>
              {reference && (
                <span className="text-sm text-gray-500 mt-0.5">
                  Ref: {reference}
                </span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FiPhone /> Mobile No
              </span>
              <span className="text-base font-semibold text-gray-700">
                {mobile_no || "—"}
              </span>
            </div>

            {/* Total Dates */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FiCalendar /> Event Dates
              </span>
              <span className="text-base font-medium text-gray-700">
                {uniqueDates.join(", ") || "—"}
              </span>
            </div>

            {/* Totals Summary */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FiDollarSign /> Advance Paid
              </span>
              <span className="text-2xl font-black text-gray-800">
                ₹{Number(advance_amount || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Address Line (if present) */}
          {event_address && (
            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col">
              <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FiMapPin /> Event Address
              </span>
              <span className="text-base font-medium text-gray-700 max-w-3xl">
                {event_address}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sessions List */}
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
          <FiClock size={18} />
        </div>
        Session Breakdown ({orderSessions.length})
      </h3>

      <div className="grid xl:grid-cols-2 gap-5">
        {orderSessions.map((session, index) => {
          const sessionDateStr = session.event_date;
          // Format date nicely if it's parsable, otherwise use string
          let displayDate = sessionDateStr;
          try {
            const parts = sessionDateStr?.split("-");
            if (parts && parts.length === 3) {
              let d;
              if (parts[0].length === 4) {
                d = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
              } else {
                d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
              }
              if (!isNaN(d)) displayDate = format(d, "dd MMM, yyyy");
            }
          } catch {
            /* ignore */
          }

          return (
            <div
              key={index}
              className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Session Header */}
              <div className="bg-gradient-to-r from-[var(--color-primary-soft)] to-white border-b border-gray-100 px-5 py-3 flex justify-between items-center text-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                    S{index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-gray-800">
                      {session.event_time || `Session ${index + 1}`}
                    </h4>
                    <p className="text-xs font-semibold text-gray-500">
                      {displayDate || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 bg-white border border-gray-200 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleEditSession(id, index)}
                    title={`Edit ${session.event_time || `Session ${index + 1}`}`}
                  >
                    <FiEdit2 size={14} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] bg-indigo-50 border border-indigo-100 hover:bg-[var(--color-primary)] hover:text-white rounded-lg transition-colors cursor-pointer"
                    onClick={() =>
                      handleAssignStaff(id, session.id, session.event_time)
                    }
                    title={`Assign Staff to ${session.event_time || `Session ${index + 1}`}`}
                  >
                    <FiBriefcase size={14} />
                    <span className="hidden sm:inline">Assign Staff</span>
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    onClick={() =>
                      handleViewIngredientBySession(id, session.id, session.event_time)
                    }
                  >
                    <FiBox size={14} />
                    <span className="hidden sm:inline">Ingredients</span>
                  </button>
                </div>
              </div>

              {/* Session Stats */}
              <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1">
                    <FiUsers size={12} /> Estimated Persons
                  </span>
                  <span className="font-bold text-gray-800">
                    {session.estimated_persons || "—"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1">
                    <FiDollarSign size={12} /> Per Dish Amount
                  </span>
                  <span className="font-bold text-gray-800">
                    {session.per_dish_amount
                      ? `₹${Number(session.per_dish_amount).toLocaleString("en-IN")}`
                      : "—"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1">
                    <FiDollarSign size={12} /> Extra Service Amt
                  </span>
                  <span className="font-bold text-gray-800">
                    {session.extra_service_amount
                      ? `₹${Number(session.extra_service_amount).toLocaleString("en-IN")}`
                      : "—"}
                  </span>
                </div>

                {/* Session Address */}
                {session.event_address && (
                  <div className="col-span-2 md:col-span-3 pt-3 border-t border-gray-50 flex flex-col">
                    <span className="text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1">
                      <FiMapPin size={12} /> Event Address
                    </span>
                    <span className="font-medium text-gray-700 max-w-3xl text-sm">
                      {session.event_address}
                    </span>
                  </div>
                )}

                {/* Session Actions (Items count quick preview & Checklist) */}
                <div className="col-span-2 md:col-span-3 pt-3 mt-1 border-t border-gray-50 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {session.selected_items && Object.keys(session.selected_items).length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => showDishes(session)}
                          className="flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 hover:border-purple-300 transition-colors cursor-pointer"
                          title="Click to view category-wise selected dishes and assign vendors"
                        >
                          Selected Dishes
                        </button>
                        <button
                          className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 hover:bg-fuchsia-100 rounded-md transition-colors cursor-pointer"
                          onClick={() => handleOpenTags(session)}
                          title={`Print Dish Tags for ${session.event_time || `Session ${index + 1}`}`}
                        >
                          <span className="text-sm">🏷️</span>
                          <span>Dish Tags</span>
                        </button>
                      </>
                    )}
                    <button
                      className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 rounded-md transition-colors cursor-pointer"
                      onClick={() =>
                        handleOpenSessionChecklistPreview(id, session.id ?? index)
                      }
                      title={`Open Checklist Preview for ${session.event_time || `Session ${index + 1}`}`}
                    >
                      <FiClipboard size={14} />
                      <span>Checklist PDF</span>
                    </button>
                    <button
                      className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                      onClick={() => setGroundMgmtSession(session)}
                      title={`Manage Ground Items for ${session.event_time || `Session ${index + 1}`}`}
                    >
                      <FiBox size={14} />
                      <span>Ground Mgmt</span>
                      {session.ground_management && Object.keys(session.ground_management).length > 0 && (
                        <span className="ml-0.5 bg-emerald-200 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {Object.values(session.ground_management).reduce(
                            (sum, items) => sum + (Array.isArray(items) ? items.length : 1), 0
                          )}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Managers Assigned Details */}
                {session.managers_assigned &&
                  session.managers_assigned.length > 0 && (
                    <div className="col-span-2 md:col-span-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1 uppercase tracking-wider">
                        <FiUser size={12} /> Assigned Managers
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {session.managers_assigned.map((staff, mIdx) => (
                          <button
                            key={`mgr-${mIdx}`}
                            onClick={() =>
                              staff.assignment_id &&
                              handleEditAssignment(staff.assignment_id)
                            }
                            title={
                              staff.assignment_id
                                ? "Edit Manager Assignment"
                                : "No Assignment ID"
                            }
                            className={`text-left text-xs px-3 py-2 rounded-lg border flex flex-col gap-1 transition-colors ${staff.assignment_id ? "border-orange-100 bg-orange-50 hover:bg-orange-100 hover:border-orange-200 cursor-pointer" : "border-gray-100 bg-gray-50"}`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <span className="font-bold text-orange-700">
                                {staff.name || staff}
                              </span>
                              {staff.staff_type && (
                                <span className="text-[10px] font-semibold bg-white px-1.5 py-0.5 rounded text-gray-600 border border-gray-200">
                                  {staff.staff_type}
                                </span>
                              )}
                            </div>
                            {staff.role && (
                              <div className="flex items-center gap-2 text-gray-600 font-medium">
                                <span>{staff.role}</span>
                                {staff.people_summoned && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span>
                                      {staff.people_summoned}{" "}
                                      {staff.people_summoned === 1
                                        ? "person"
                                        : "people"}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Summoned Staff Details */}
                {session.summoned_staff_details &&
                  session.summoned_staff_details.length > 0 && (
                    <div className="col-span-2 md:col-span-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1 uppercase tracking-wider">
                        <FiBriefcase size={12} /> Assigned Staff
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {session.summoned_staff_details.map((staff, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() =>
                              staff.assignment_id &&
                              handleEditAssignment(staff.assignment_id)
                            }
                            title={
                              staff.assignment_id
                                ? "Edit Assignment"
                                : "No Assignment ID"
                            }
                            className={`text-left text-xs px-3 py-2 rounded-lg border flex flex-col gap-1 transition-colors ${staff.assignment_id ? "border-indigo-100 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-200 cursor-pointer" : "border-gray-100 bg-gray-50"}`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <span className="font-bold text-[var(--color-primary)]">
                                {staff.name}
                              </span>
                              <span className="text-[10px] font-semibold bg-white px-1.5 py-0.5 rounded text-gray-600 border border-gray-200">
                                {staff.staff_type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 font-medium">
                              <span>{staff.role}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                              <span>
                                {staff.people_summoned}{" "}
                                {staff.people_summoned === 1
                                  ? "person"
                                  : "people"}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
      {orderSessions.length === 0 && (
        <div className="text-center p-8 bg-white border border-gray-200 rounded-xl text-gray-500">
          No session details available.
        </div>
      )}

      <DishTagModal
        isOpen={!!tagSession}
        session={tagSession}
        onClose={onCloseTag}
        catererNameProfile={catererNameProfile}
        customerName={name}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={onClosePaymentModal}
        bookingId={id}
        onPaymentSuccess={onPaymentSuccess}
      />

      {/* Ground Management Modal */}
      <GroundManagementModal
        isOpen={!!groundMgmtSession}
        onClose={() => setGroundMgmtSession(null)}
        onSave={async (groundData) => {
          if (groundMgmtSession) {
            await handleSaveGroundManagement(groundMgmtSession.id, groundData);
            setGroundMgmtSession(null);
          }
        }}
        existingData={groundMgmtSession?.ground_management || null}
        sessionName={groundMgmtSession?.event_time || ""}
      />

      {/* Item Vendor Assignment Modal */}
      <ItemVendorModal
        isOpen={!!itemVendorSession}
        onClose={() => setItemVendorSession(null)}
        session={itemVendorSession}
        eventId={id}
      />
    </div>
  );
}

export default ViewOrderDetailsComponent;


