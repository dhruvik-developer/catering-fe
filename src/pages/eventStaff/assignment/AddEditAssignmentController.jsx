import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createAssignment,
  getSingleAssignment,
  updateAssignment,
  getAllStaff,
  getRoles,
} from "../../../api/EventStaffApis";
import AddEditAssignmentComponent from "./AddEditAssignmentComponent";

function AddEditAssignmentController() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const stateMode = location.state?.mode;
  const mode = stateMode ? stateMode : id ? "edit" : "add";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [staffList, setStaffList] = useState([]);
  const [rolesList, setRolesList] = useState([]);

  // Current wizard step for add mode (1 = select staff, 2 = configure payout)
  const [currentStep, setCurrentStep] = useState(1);

  // Currently active category filter in step 1 (Fixed, Agency, Contract)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("");

  // Single-staff form data (used for edit mode)
  // Waiter service info from order (passed via navigation state)
  const waiterService = location.state?.waiterService || [];
  const waiterServiceAmount = location.state?.waiterServiceAmount || 0;
  const eventName = location.state?.eventName || "";

  const [formData, setFormData] = useState({
    event: location.state?.eventId || "",
    session: location.state?.sessionId || "",
    sessionName: location.state?.sessionName || "",
    staff: "",
    role_at_event: "",
    number_of_persons: "1",
    total_days: "1.0",
    per_day_rate: "0.00",
    paid_amount: "0.00",
    total_amount: "0.00",
  });

  // Multi-staff entries (used for add mode) — persists across role switches
  // Each entry: { staffId, roleId, total_days, per_day_rate, number_of_persons, paid_amount }
  const [selectedStaffEntries, setSelectedStaffEntries] = useState([]);

  // Recalculate total_amount for edit mode
  useEffect(() => {
    if (mode !== "edit") return;
    const days = parseFloat(formData.total_days) || 0;
    const selectedObj = staffList.find(
      (s) => s.id.toString() === formData.staff?.toString()
    );
    const isBulk =
      selectedObj &&
      (selectedObj.staff_type === "Agency" ||
        selectedObj.staff_type === "Contract");
    const isFixed = selectedObj && selectedObj.staff_type === "Fixed";
    const rate = isFixed ? 0 : parseFloat(formData.per_day_rate) || 0;
    const count = isBulk ? parseInt(formData.number_of_persons) || 1 : 1;

    setFormData((prev) => ({
      ...prev,
      total_amount: (days * rate * count).toFixed(2),
    }));
  }, [
    formData.total_days,
    formData.per_day_rate,
    formData.number_of_persons,
    formData.staff,
    staffList,
    mode,
  ]);

  useEffect(() => {
    const fetchDependenciesAndData = async () => {
      try {
        const staffRes = await getAllStaff();
        const staffData = Array.isArray(staffRes?.data)
          ? staffRes.data
          : staffRes?.data?.data || [];
        setStaffList(staffData);

        const rolesRes = await getRoles();
        const rolesData = Array.isArray(rolesRes?.data)
          ? rolesRes.data
          : rolesRes?.data?.data || [];
        setRolesList(rolesData);

        if (mode === "edit") {
          if (location.state?.assignmentData) {
            populateForm(location.state.assignmentData);
          } else if (id) {
            const response = await getSingleAssignment(id);
            if (response?.data) {
              populateForm(response.data.data || response.data);
            } else {
              toast.error("Failed to fetch assignment details");
              navigate(-1);
            }
          }
        }
      } catch (error) {
        toast.error("Error loading required data");
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDependenciesAndData();
  }, [id, mode, location.state, navigate]);

  const populateForm = (data) => {
    setFormData({
      id: data.id,
      event: data.event || data.event_id || "",
      session: data.session || data.session_id || "",
      sessionName: data.sessionName || data.session_name || "Assigned Session",
      staff: data.staff || "",
      role_at_event: data.role_at_event || "",
      number_of_persons: data.number_of_persons || "1",
      total_days: data.total_days || "1.0",
      per_day_rate: data.per_person_rate || data.per_day_rate || "0.00",
      paid_amount: data.paid_amount || "0.00",
      total_amount: data.total_amount || "0.00",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleStaffChange = (e) => {
    const staffId = e.target.value;
    setFormData((prev) => ({ ...prev, staff: staffId }));
    if (errors.staff) setErrors((prev) => ({ ...prev, staff: null }));

    if (staffId) {
      const selectedStaff = staffList.find(
        (s) => s.id.toString() === staffId.toString()
      );
      if (selectedStaff) {
        setFormData((prev) => ({
          ...prev,
          per_day_rate:
            selectedStaff.per_person_rate ||
            selectedStaff.per_day_rate ||
            "0.00",
        }));
      }
    }
  };

  // Edit mode role change
  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setFormData((prev) => ({ ...prev, role_at_event: roleId, staff: "" }));
  };

  // Add mode category filter change — does NOT clear selections
  const handleCategoryFilterChange = (category) => {
    setActiveCategoryFilter(category);
  };

  // Staff filtered by active category filter (for add mode step 1)
  const filteredStaffList = useMemo(() => {
    const activeStaff = staffList.filter((s) => s.is_active);
    if (!activeCategoryFilter && mode === "add") return activeStaff;
    if (!formData.role_at_event && mode === "edit") return activeStaff;

    if (mode === "add") {
      return activeStaff.filter(
        (s) => String(s.staff_type) === String(activeCategoryFilter)
      );
    } else {
      // Edit mode still uses the specific assigned role
      const roleId = formData.role_at_event;
      return activeStaff.filter((s) => String(s.role) === String(roleId));
    }
  }, [staffList, activeCategoryFilter, formData.role_at_event, mode]);

  // === Multi-staff handlers ===

  const onToggleStaff = (staff) => {
    const exists = selectedStaffEntries.find(
      (e) => String(e.staffId) === String(staff.id)
    );
    if (exists) {
      setSelectedStaffEntries((prev) =>
        prev.filter((e) => String(e.staffId) !== String(staff.id))
      );
    } else {
      // Determine the role to assign: use the staff's default role
      const roleId = staff.role || "";
      setSelectedStaffEntries((prev) => [
        ...prev,
        {
          staffId: staff.id,
          roleId: roleId,
          total_days: "1.0",
          per_day_rate:
            String(staff.per_person_rate || staff.per_day_rate || "0.00"),
          number_of_persons: "1",
          paid_amount: "0.00",
        },
      ]);
    }
  };

  const onUpdateStaffEntry = (staffId, field, value) => {
    setSelectedStaffEntries((prev) =>
      prev.map((e) =>
        String(e.staffId) === String(staffId) ? { ...e, [field]: value } : e
      )
    );
  };

  const onRemoveStaffEntry = (staffId) => {
    setSelectedStaffEntries((prev) =>
      prev.filter((e) => String(e.staffId) !== String(staffId))
    );
  };

  // Grand total calculation
  const grandTotal = useMemo(() => {
    return selectedStaffEntries.reduce((sum, entry) => {
      const staffObj = staffList.find(
        (s) => String(s.id) === String(entry.staffId)
      );
      const isBulk =
        staffObj &&
        (staffObj.staff_type === "Agency" ||
          staffObj.staff_type === "Contract");
      const isFixed = staffObj && staffObj.staff_type === "Fixed";

      if (isFixed) return sum;

      const days = parseFloat(entry.total_days) || 0;
      const rate = parseFloat(entry.per_day_rate) || 0;
      const count = isBulk ? parseInt(entry.number_of_persons) || 1 : 1;

      return sum + days * rate * count;
    }, 0);
  }, [selectedStaffEntries, staffList]);

  // Step navigation
  const goToStep2 = () => {
    if (selectedStaffEntries.length === 0) {
      toast.error("Please select at least one staff member");
      return;
    }
    setCurrentStep(2);
  };

  const goToStep1 = () => {
    setCurrentStep(1);
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (mode === "edit") {
      if (!formData.event) newErrors.event = "Please select an event";
      if (!formData.staff) newErrors.staff = "Please select a staff member";
      if (!formData.total_days || parseFloat(formData.total_days) <= 0) {
        newErrors.total_days = "Total days is required";
      }
      const selectedStaffObj = staffList.find(
        (s) => s.id.toString() === formData.staff?.toString()
      );
      const isFixed =
        selectedStaffObj && selectedStaffObj.staff_type === "Fixed";
      if (!isFixed) {
        if (
          !formData.per_day_rate ||
          parseFloat(formData.per_day_rate) <= 0
        ) {
          newErrors.per_day_rate = "Per day rate must be greater than 0";
        }
      }
      if (parseFloat(formData.paid_amount || "0") < 0) {
        newErrors.paid_amount = "Paid amount cannot be negative";
      }
    } else {
      // Multi-staff add validation
      if (selectedStaffEntries.length === 0) {
        toast.error("Please select at least one staff member");
        return false;
      }

      for (const entry of selectedStaffEntries) {
        const staffObj = staffList.find(
          (s) => String(s.id) === String(entry.staffId)
        );
        const isFixed = staffObj && staffObj.staff_type === "Fixed";

        if (!entry.total_days || parseFloat(entry.total_days) <= 0) {
          const name = staffObj?.name || "Unknown";
          toast.error(`Total days is required for ${name}`);
          return false;
        }
        if (
          !isFixed &&
          (!entry.per_day_rate || parseFloat(entry.per_day_rate) <= 0)
        ) {
          const name = staffObj?.name || "Unknown";
          toast.error(`Per day rate must be greater than 0 for ${name}`);
          return false;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      if (mode === "edit") {
        toast.error("Please correctly fill all highlighted required fields.");
      }
      return;
    }

    setSaving(true);

    try {
      if (mode === "edit") {
        const payload = {
          event: formData.event,
          session: formData.session,
          staff: formData.staff,
          role_at_event: formData.role_at_event,
          number_of_persons: parseInt(formData.number_of_persons) || 1,
          total_days: formData.total_days,
          per_person_rate: formData.per_day_rate,
          paid_amount: formData.paid_amount || "0.00",
        };

        const response = await updateAssignment(formData.id, payload);
        if (response && response.status >= 200 && response.status < 300) {
          toast.success("Assignment updated successfully!");
          navigate(-1);
        } else {
          toast.error("Operation failed. Please try again.");
        }
      } else {
        // Multi-staff create
        let successCount = 0;
        let failCount = 0;

        for (const entry of selectedStaffEntries) {
          const staffObj = staffList.find(
            (s) => String(s.id) === String(entry.staffId)
          );
          const isBulk =
            staffObj &&
            (staffObj.staff_type === "Agency" ||
              staffObj.staff_type === "Contract");

          const payload = {
            event: formData.event,
            session: formData.session,
            staff: entry.staffId,
            role_at_event: entry.roleId,
            number_of_persons: isBulk
              ? parseInt(entry.number_of_persons) || 1
              : 1,
            total_days: entry.total_days,
            per_person_rate: entry.per_day_rate,
            paid_amount: entry.paid_amount || "0.00",
          };

          try {
            const response = await createAssignment(payload);
            if (response && response.status >= 200 && response.status < 300) {
              successCount++;
            } else {
              failCount++;
            }
          } catch (err) {
            failCount++;
            console.error(
              `Failed to assign ${staffObj?.name || "staff"}:`,
              err
            );
          }
        }

        if (successCount > 0) {
          toast.success(
            `${successCount} staff member${
              successCount > 1 ? "s" : ""
            } assigned successfully!`
          );
        }
        if (failCount > 0) {
          toast.error(
            `${failCount} assignment${failCount > 1 ? "s" : ""} failed.`
          );
        }

        navigate(-1);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          `Error ${mode === "add" ? "creating" : "updating"} assignment`
      );
      console.error("API Error:", error);

      if (
        error?.response?.data &&
        typeof error.response.data === "object" &&
        !error.response.data.message
      ) {
        const apiErrors = {};
        Object.keys(error.response.data).forEach((key) => {
          apiErrors[key] = Array.isArray(error.response.data[key])
            ? error.response.data[key][0]
            : error.response.data[key];
        });
        setErrors(apiErrors);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <AddEditAssignmentComponent
      mode={mode}
      formData={formData}
      loading={loading}
      saving={saving}
      errors={errors}
      staffList={staffList}
      filteredStaffList={filteredStaffList}
      rolesList={rolesList}
      handleChange={handleChange}
      handleStaffChange={handleStaffChange}
      handleRoleChange={handleRoleChange}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      // Multi-staff props
      selectedStaffEntries={selectedStaffEntries}
      onToggleStaff={onToggleStaff}
      onUpdateStaffEntry={onUpdateStaffEntry}
      onRemoveStaffEntry={onRemoveStaffEntry}
      grandTotal={grandTotal}
      // Wizard step props
      currentStep={currentStep}
      goToStep1={goToStep1}
      goToStep2={goToStep2}
      activeCategoryFilter={activeCategoryFilter}
      handleCategoryFilterChange={handleCategoryFilterChange}
      // Waiter service info from order
      waiterService={waiterService}
      waiterServiceAmount={waiterServiceAmount}
      eventName={eventName}
    />
  );
}

export default AddEditAssignmentController;
