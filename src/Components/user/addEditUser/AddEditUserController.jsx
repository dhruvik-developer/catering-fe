import toast from "react-hot-toast";
import AddEditUserComponent from "./AddEditUserComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { addUser, updateUserPassword } from "../../../api/PostUsers";
import { getApiMessage } from "../../../utils/apiResponse";

function AddEditUserController() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location || {};
  const mode = state?.mode || (id ? "editUser" : "addUser");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "editUser" && state) {
      setForm({
        username: state.username || "",
        email: state.email || "",
        password: "",
      });
    }
  }, [mode, state]);

  const togglePassword = () => setShowPassword((prev) => !prev);

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

        if (form.email.trim()) {
          payload.email = form.email.trim();
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
      console.log("API Error:", error);
    }
  };

  return (
    <AddEditUserComponent
      navigate={navigate}
      mode={mode}
      form={form}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      errors={errors}
      onShowPassword={togglePassword}
      onInputChange={onInputChange}
      onSubmit={handleSubmit}
    />
  );
}

export default AddEditUserController;
