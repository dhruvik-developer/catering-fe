/* eslint-disable react/prop-types */
import Loader from "../../../Components/common/Loader";
import StaffTable from "../../../Components/eventStaff/StaffTable";
import Button from "../../../Components/common/Button";
import PageHeader from "../../../Components/common/PageHeader";
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
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <PageHeader
        icon={<FiUsers size={22} />}
        title="Event Staff"
        subtitle={`${staffList?.length || 0} staff member${staffList?.length !== 1 ? "s" : ""} registered`}
        actions={
          hasPermission("eventstaff.create") ? (
            <Button
              onClick={onStaffAdd}
              leftIcon={<FiUserPlus size={15} />}
            >
              Add Staff
            </Button>
          ) : null
        }
        className="mb-6"
      />

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
