import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssignmentComponent from "./AssignmentComponent";
import toast from "react-hot-toast";
import { getAllAssignments } from "../../../api/EventStaffApis";
import DeleteConfirmation from "../../../Components/common/DeleteConfirmation";

function AssignmentController() {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);

  const fetchAssignments = async () => {
    try {
      const response = await getAllAssignments();
      if (response?.data) {
        // Determine structure: directly array or wrapped in response.data.data
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setAssignments(data);
      } else {
        toast.error("Failed to fetch event assignments");
      }
    } catch (error) {
      toast.error("Error fetching event assignments");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchAssignments();
      hasFetched.current = true;
    }
  }, []);

  // Handle Add
  const handleAddAssignment = () => {
    navigate("/add-assignment", { state: { mode: "add" } });
  };

  // Handle Edit
  const handleEditAssignment = (assignment) => {
    navigate(`/edit-assignment/${assignment.id}`, {
      state: { mode: "edit", assignmentData: assignment },
    });
  };

  // Handle Delete
  const handleDeleteAssignment = (id) => {
    DeleteConfirmation({
      id,
      apiEndpoint: "/event-assignments",
      name: "event assignment",
      successMessage: "Assignment deleted successfully!",
      onSuccess: fetchAssignments,
    });
  };

  return (
    <AssignmentComponent
      navigate={navigate}
      loading={loading}
      assignments={assignments}
      onAssignmentAdd={handleAddAssignment}
      onAssignmentEdit={handleEditAssignment}
      onAssignmentDelete={handleDeleteAssignment}
    />
  );
}

export default AssignmentController;
