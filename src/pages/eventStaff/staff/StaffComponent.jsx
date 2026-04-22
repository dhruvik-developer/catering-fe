/* eslint-disable react/prop-types */
import Loader from "../../../Components/common/Loader";
import StaffTable from "../../../Components/eventStaff/StaffTable";
import { FiUsers, FiUserPlus } from "react-icons/fi";
import usePermissions from "../../../hooks/usePermissions";

function StaffComponent({
  loading,
  staffList,
  onStaffAdd,
  onStaffEdit,
  onStaffDelete,
  onStaffPaymentSummary,
}) {
  const { hasPermission } = usePermissions();
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
            <FiUsers className="text-[var(--color-primary)]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Event Staff</h2>
            <p className="text-sm text-gray-400">
              {staffList?.length || 0} staff member
              {staffList?.length !== 1 ? "s" : ""} registered
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {hasPermission("eventstaff.create") && (
            <button
              onClick={onStaffAdd}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[var(--color-primary)] hover:brightness-95 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200"
            >
              <FiUserPlus size={15} />
              Add Staff
            </button>
          )}
        </div>
      </div>

      {/* Data Grid */}
      {loading ? (
        <Loader message="Loading staff..." />
      ) : (
        <StaffTable
          staffList={staffList}
          onStaffEdit={onStaffEdit}
          onStaffDelete={onStaffDelete}
          onStaffPaymentSummary={onStaffPaymentSummary}
        />
      )}
    </div>
  );
}

export default StaffComponent;
