import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffComponent from "./StaffComponent";
import toast from "react-hot-toast";
import { getAllStaff } from "../../../api/EventStaffApis";
import DeleteConfirmation from "../../../Components/common/DeleteConfirmation";

function StaffController() {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);

  const fetchStaffList = async () => {
    try {
      const response = await getAllStaff();
      if (response?.data) {
        // Assuming data is returned directly or in response.data.data
        const data = response.data.data || response.data;
        setStaffList(data);
      } else {
        toast.error("Failed to fetch event staff");
      }
    } catch (error) {
      toast.error("Error fetching event staff");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchStaffList();
      hasFetched.current = true;
    }
  }, []);

  // Handle Add
  const handleAddStaff = () => {
    navigate("/add-staff", { state: { mode: "add" } });
  };

  // Handle Edit
  const handleEditStaff = (staff) => {
    navigate(`/edit-staff/${staff.id}`, {
      state: { mode: "edit", staffData: staff },
    });
  };

  // Handle Delete
  const handleDeleteStaff = (id) => {
    DeleteConfirmation({
      id,
      apiEndpoint: "/staff",
      name: "event staff member",
      successMessage: "Staff deleted successfully!",
      onSuccess: fetchStaffList,
    });
  };

  // Handle Payment Summary (Fixed Staff)
  const handlePaymentSummary = (id) => {
    navigate(`/fixed-staff-payments/${id}`);
  };

  return (
    <StaffComponent
      navigate={navigate}
      loading={loading}
      staffList={staffList}
      onStaffAdd={handleAddStaff}
      onStaffEdit={handleEditStaff}
      onStaffDelete={handleDeleteStaff}
      onStaffPaymentSummary={handlePaymentSummary}
    />
  );
}

export default StaffController;
