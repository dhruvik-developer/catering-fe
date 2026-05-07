import toast from "react-hot-toast";
import AddEditUserComponent from "./AddEditUserComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { addUser, updateUserPassword } from "../../../api/PostUsers";
import { getApiMessage } from "../../../utils/apiResponse";
import { UserContext } from "../../../context/UserContext";

function AddEditUserController() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location || {};
  const mode = state?.mode || (id ? "editUser" : "addUser");
  const { isMainTenantAdmin, isBranchAdmin } = useContext(UserContext);

  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    // Empty string = unassigned. Backend accepts null to clear.
    branch_profile_id: "",
    // Three-tier role. Branch admin can only create branch_user (backend
    // enforces); for main admin we let them pick branch_admin or branch_user.
    // main_admin is intentionally NOT an option here — that role is set only
    // during tenant creation.
    branch_role: "branch_user",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "editUser" && state) {
      setForm({
        username: state.username || "",
        first_name: state.first_name || "",
        last_name: state.last_name || "",
        email: state.email || "",
        password: "",
        branch_profile_id:
          state.branch_profile?.id ??
          state.branch_profile_id ??
          "",
        branch_role: state.branch_role || "branch_user",
      });
    }
  }, [mode, state]);



  const onInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    const { username, email, password } = form;
    const newErrors = {};

    if (mode === "addUser") {
      if (!username.trim()) newErrors.username = "User name is required";
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = "Enter a valid email address";
      }
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) toast.error("Please fill in all required fields properly.");
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    let payload = {};

    try {
      let response;

      if (mode === "editUser") {
        payload = {
          new_password: form.password,
        };
        response = await updateUserPassword(id, payload);
      } else {
        payload = {
          username: form.username.trim(),
          password: form.password,
        };

        if (form.first_name.trim()) {
          payload.first_name = form.first_name.trim();
        }
        if (form.last_name.trim()) {
          payload.last_name = form.last_name.trim();
        }
        if (form.email.trim()) {
          payload.email = form.email.trim();
        }

        // Branch admin: don't send branch_profile_id or branch_role — the
        // backend forces both to the admin's own branch + branch_user. Main
        // admin: send whatever they picked.
        if (isMainTenantAdmin) {
          if (form.branch_profile_id) {
            payload.branch_profile_id = form.branch_profile_id;
          }
          // Set is_staff to mirror the role choice. Backend rejects this
          // pair from a branch admin anyway.
          payload.branch_role = form.branch_role || "branch_user";
          payload.is_staff = form.branch_role === "branch_admin";
        }

        response = await addUser(payload);
      }

      if (response) {
        if (mode === "editUser") {
          toast.success(response.message || "Password changed successfully.");
        } else {
          toast.success(response.data?.message || "User created successfully.");
        }
        navigate(-1);
      }
    } catch (error) {
      toast.error(
        getApiMessage(
          error,
          `Failed to ${mode === "editUser" ? "update password" : "add user"}`
        )
      );
    }
  };

  return (
    <AddEditUserComponent
      navigate={navigate}
      mode={mode}
      form={form} errors={errors}
      onInputChange={onInputChange}
      onSubmit={handleSubmit}
      isMainTenantAdmin={isMainTenantAdmin}
      isBranchAdmin={isBranchAdmin}
    />
  );
}

export default AddEditUserController;
