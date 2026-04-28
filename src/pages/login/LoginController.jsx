import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { postLogin } from "../../api/AuthApis";
import toast from "react-hot-toast";
import LoginComponent from "./LoginComponent";
import { getAllBusinessProfiles } from "../../api/BusinessProfile";
import { getDefaultRouteForAccess } from "../../utils/accessControl";

function LoginController() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [businessLogo, setBusinessLogo] = useState("");
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinessLogo = async () => {
      try {
        const response = await getAllBusinessProfiles();
        const profileList = Array.isArray(response?.data)
          ? response.data
          : response?.data
            ? [response.data]
            : [];

        const logoUrl = profileList[0]?.logo;
        setBusinessLogo(
          typeof logoUrl === "string" && logoUrl.trim() ? logoUrl : ""
        );
      } catch (error) {
        console.error("Failed to load login logo:", error);
        setBusinessLogo("");
      } finally {
        setIsLogoLoading(false);
      }
    };

    fetchBusinessLogo();
  }, []);

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
      const loginData = response?.data?.data;
      const access = loginData?.tokens?.access;
      const username = loginData?.username;
      const userType = loginData?.user_type;
      const permissions = loginData?.permissions || [];
      const tenant = loginData?.tenant || null;
      const enabledModules = tenant?.enabled_modules || [];

      if (!access || !username || !userType) {
        throw new Error("Invalid login response");
      }

      login(access, username, userType, permissions, enabledModules, tenant);
      toast.success(response?.data?.message || "Login successfully");
      navigate(getDefaultRouteForAccess(permissions, enabledModules) || "/login");
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
      showPassword={showPassword} errors={errors}
      businessLogo={businessLogo}
      isLogoLoading={isLogoLoading}
      onShowPassword={togglePassword}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    />
  );
}

export default LoginController;
