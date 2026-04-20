import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { postLogin } from "../../apis/AuthApis";
import toast from "react-hot-toast";
import LoginComponent from "./LoginComponent";
import { USER_ROLE_ADMIN } from "../../services/tokenService";

function LoginController() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};

    if (!credentials.username.trim())
      newErrors.username = "Username is required";
    if (!credentials.password.trim())
      newErrors.password = "Password is required";

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) toast.error("Please fill in your username and password.");
    return isValid;
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await postLogin(credentials);
      const access = response?.data?.data?.tokens?.access;
      const username = response?.data?.data?.username;
      const userType = response?.data?.data?.user_type;

      if (!access || !username || !userType) {
        throw new Error("Invalid login response");
      }

      if (userType !== USER_ROLE_ADMIN) {
        logout();
        throw new Error("Only admin users are allowed to log in.");
      }

      login(access, username, userType);
      toast.success(response?.data?.message || "Login successfully");
      navigate("/dish");
    } catch (error) {
      toast.error(error?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <LoginComponent
      credentials={credentials}
      loading={loading}
      showPassword={showPassword}
      errors={errors}
      onShowPassword={togglePassword}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    />
  );
}

export default LoginController;
