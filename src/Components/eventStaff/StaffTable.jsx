/* eslint-disable react/prop-types */
import { FaTrash, FaWallet } from "react-icons/fa";
import { FiEdit2, FiUsers } from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";
import EmptyState from "../common/EmptyState";

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border shadow-sm ${active ? "bg-[var(--color-primary-tint)] text-[var(--color-primary-text)] border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${active ? "bg-emerald-500" : "bg-red-500"}`}
      ></span>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function FinancialLine({ label, amount, suffix, tone = "neutral" }) {
  const classes =
    tone === "primary"
      ? "bg-[var(--color-primary-tint)]/80 border-[var(--color-primary-border)]/30"
      : "bg-gray-50/80 border-gray-100";
  const labelClass =
    tone === "primary" ? "text-[var(--color-primary)]" : "text-gray-500";
  const amountClass =
    tone === "primary" ? "text-[var(--color-primary-text)]" : "text-gray-800";
  return (
    <div
      className={`flex items-center justify-between text-xs px-3 py-1.5 rounded-lg border shadow-sm ${classes}`}
    >
      <span className={`font-medium ${labelClass}`}>{label}</span>
      <span className={`font-bold ${amountClass}`}>
        ₹{amount.toFixed(2)}
        {suffix ? (
          <span className="font-normal opacity-60 text-[10px]">{suffix}</span>
        ) : null}
      </span>
    </div>
  );
}

function Financials({ staff, compact = false }) {
  const perPerson = parseFloat(staff.per_person_rate) || 0;
  const fixed = parseFloat(staff.fixed_salary) || 0;
  const contract = parseFloat(staff.contract_rate) || 0;
  const hasFixed = staff.staff_type === "Fixed" && fixed > 0;
  const hasContract = staff.staff_type === "Contract" && contract > 0;
  const hasAny = perPerson > 0 || hasFixed || hasContract;

  if (!hasAny) {
    return (
      <span className="text-xs text-gray-400 italic font-medium">
        No financials
      </span>
    );
  }

  const widthClass = compact ? "w-full" : "w-36";
  return (
    <div className={`flex flex-col gap-2 ${widthClass}`}>
      {perPerson > 0 && (
        <FinancialLine label="Per Day" amount={perPerson} />
      )}
      {hasFixed && (
        <FinancialLine label="Fixed" amount={fixed} suffix="/mo" tone="primary" />
      )}
      {hasContract && (
        <FinancialLine label="Contract" amount={contract} tone="primary" />
      )}
    </div>
  );
}

function StaffTable({
  staffList,
  onStaffEdit,
  onStaffDelete,
  onStaffPaymentSummary,
}) {
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission("eventstaff.update");
  const canDelete = hasPermission("eventstaff.delete");

  if (!staffList || staffList.length === 0) {
    return (
      <EmptyState
        icon={<FiUsers size={24} />}
        title="No Staff Available"
        message='Use the "Add Staff" button to register new staff members and they will appear here.'
      />
    );
  }

  return (
    <div className="w-full">
      {/* Mobile card layout */}
      <div className="md:hidden flex flex-col gap-3">
        {staffList.map((staff, index) => {
          const waiterType =
            staff.waiter_type_name ||
            (staff.waiter_type && staff.waiter_type.name);
          return (
            <div
              key={staff.id}
              className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex flex-col gap-3 hover:border-[var(--color-primary-border)] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-border)] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                  {staff.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-gray-400">
                      #{(index + 1).toString().padStart(2, "0")}
                    </span>
                    <StatusBadge active={staff.is_active} />
                  </div>
                  <p className="font-bold text-gray-900 text-base truncate">
                    {staff.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {staff.phone || "-"}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {staff.staff_type === "Fixed" && onStaffPaymentSummary && (
                    <button
                      onClick={() => onStaffPaymentSummary(staff.id)}
                      title="Salary Payments"
                      className="p-2 rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-all cursor-pointer"
                    >
                      <FaWallet size={14} />
                    </button>
                  )}
                  {canEdit && (
                    <button
                      onClick={() => onStaffEdit(staff)}
                      title="Edit Staff"
                      className="p-2 rounded-lg text-gray-500 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-all cursor-pointer"
                    >
                      <FiEdit2 size={15} />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => onStaffDelete(staff.id)}
                      title="Delete Staff"
                      className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="font-bold text-[var(--color-primary)] text-sm">
                  {staff.role_name || staff.role || "N/A"}
                </span>
                <span className="text-[10px] font-extrabold tracking-wider text-[var(--color-primary-text)] bg-[var(--color-primary-tint)] uppercase px-2.5 py-1 rounded-md border border-[var(--color-primary-border)]/30">
                  {staff.staff_type}
                  {staff.agency_name ? ` • ${staff.agency_name}` : ""}
                </span>
                {waiterType && (
                  <span className="text-[10px] text-gray-500 uppercase px-2 py-1 rounded-md bg-gray-50 border border-gray-100">
                    {waiterType}
                  </span>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Financials
                </span>
                <div className="mt-1.5">
                  <Financials staff={staff} compact />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto w-full pb-4">
        <table
          className="min-w-[900px] w-full border-separate"
          style={{ borderSpacing: "0 8px" }}
        >
          <thead>
            <tr className="bg-white">
              <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                #
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Name
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Role & Type
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Financials
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Status
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff, index) => {
              const waiterType =
                staff.waiter_type_name ||
                (staff.waiter_type && staff.waiter_type.name);
              return (
                <tr
                  key={staff.id}
                  className="bg-white hover:bg-[var(--color-primary-tint)] transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(132,92,189,0.08)] group rounded-xl"
                >
                  <td className="px-6 py-4 first:rounded-l-xl last:rounded-r-xl border-y border-transparent group-hover:border-[var(--color-primary-border)] first:border-l last:border-r font-medium text-gray-500 w-12">
                    {(index + 1).toString().padStart(2, "0")}
                  </td>
                  <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-border)] text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-[var(--color-primary-tint)] group-hover:ring-[var(--color-primary-soft)] transition-all flex-shrink-0">
                        {staff.name ? staff.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-[15px]">
                          {staff.name || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)] font-medium text-gray-500">
                    {staff.phone || "-"}
                  </td>
                  <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)]">
                    <div className="flex flex-col gap-2 items-start">
                      <span className="font-bold text-[var(--color-primary)] text-sm break-words line-clamp-2">
                        {staff.role_name || staff.role || "N/A"}
                      </span>
                      {waiterType ? (
                        <span className="text-[10px] text-gray-500 uppercase px-2.5 py-1 rounded-md">
                          Waiter Type: {waiterType}
                        </span>
                      ) : null}
                      <span className="text-[10px] font-extrabold tracking-wider text-[var(--color-primary-text)] bg-[var(--color-primary-tint)] group-hover:bg-[var(--color-primary-soft)] transition-colors uppercase px-2.5 py-1 rounded-md shadow-sm border border-[var(--color-primary-border)]/30 w-fit">
                        {staff.staff_type}{" "}
                        {staff.agency_name ? `• ${staff.agency_name}` : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)]">
                    <Financials staff={staff} />
                  </td>
                  <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)] text-center">
                    <StatusBadge active={staff.is_active} />
                  </td>
                  <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)] text-center w-40 first:rounded-l-xl last:rounded-r-xl first:border-l last:border-r">
                    <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      {staff.staff_type === "Fixed" && onStaffPaymentSummary && (
                        <button
                          onClick={() => onStaffPaymentSummary(staff.id)}
                          title="Salary Payments"
                          className="p-2 rounded-lg text-[var(--color-primary)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-primary-tint)] transition-all cursor-pointer shadow-sm border border-transparent hover:border-[var(--color-primary-border)]/30"
                        >
                          <FaWallet size={16} />
                        </button>
                      )}
                      {canEdit && (
                        <button
                          onClick={() => onStaffEdit(staff)}
                          title="Edit Staff"
                          className="p-2 rounded-lg text-gray-500 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-all cursor-pointer shadow-sm border border-transparent hover:border-[var(--color-primary-border)]/30"
                        >
                          <FiEdit2 size={16} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onStaffDelete(staff.id)}
                          title="Delete Staff"
                          className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer shadow-sm border border-transparent hover:border-red-100"
                        >
                          <FaTrash size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffTable;
