/* eslint-disable react/prop-types */
import Loader from "../../../Components/common/Loader";
import AssignmentTable from "../../../Components/eventStaff/AssignmentTable";
import { FiBriefcase, FiPlus } from "react-icons/fi";

function AssignmentComponent({
  loading,
  assignments,
  onAssignmentAdd,
  onAssignmentEdit,
  onAssignmentDelete,
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#f4effc]">
            <FiBriefcase className="text-[#845cbd]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Event Assignments
            </h2>
            <p className="text-sm text-gray-400">
              {assignments?.length || 0} event assignment
              {assignments?.length !== 1 ? "s" : ""} recorded
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAssignmentAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#845cbd] hover:bg-[#7350a8] text-white text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200"
          >
            <FiPlus size={16} />
            Assign Staff
          </button>
        </div>
      </div>

      {/* Data Grid */}
      {loading ? (
        <Loader message="Loading assignments..." />
      ) : (
        <AssignmentTable
          assignments={assignments}
          onAssignmentEdit={onAssignmentEdit}
          onAssignmentDelete={onAssignmentDelete}
        />
      )}
    </div>
  );
}

export default AssignmentComponent;
