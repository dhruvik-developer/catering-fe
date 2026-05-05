import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { postLogin } from "../../api/AuthApis";
import tokenService from "../../services/tokenService";
import toast from "react-hot-toast";
import LoginComponent from "./LoginComponent";
import { getAllBusinessProfiles } from "../../api/BusinessProfile";
import { getDefaultRouteForAccess } from "../../utils/accessControl";
import { isPlatformAdminHost } from "../../services/tenantRuntime";
import { getApiErrorMessage } from "../../utils/apiResponse";
import { logError } from "../../utils/logger";

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
        logError("Failed to load login logo:", error);
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
      const refresh = loginData?.tokens?.refresh;
      const username = loginData?.username;
      const userType = loginData?.user_type;
      const permissions = loginData?.permissions || [];
      const tenant = loginData?.tenant || null;
      const enabledModules = tenant?.enabled_modules || [];

      if (!access || !username || !userType) {
        throw new Error("Invalid login response");
      }

      // Save refresh token so the axios interceptor can use it to silently
      // mint a fresh access token when this one expires.
      if (refresh) {
        tokenService.setRefreshToken(refresh);
      }
      login(access, username, userType, permissions, enabledModules, tenant);
      toast.success(response?.data?.message || "Login successfully");
      const target = isPlatformAdminHost()
        ? "/dashboard"
        : getDefaultRouteForAccess(permissions, enabledModules) || "/login";
      navigate(target);
    } catch (error) {
      const status = error?.response?.status;
      // Backend returns 401 both for wrong password AND for a cross-tenant
      // login (e.g. a Hare Krishna user posting to kailashcaterers.localhost).
      // We can't tell those apart safely, so we keep the message generic.
      const fallback =
        status === 401
          ? "Invalid credentials for this workspace."
          : "Login failed. Please try again.";
      toast.error(getApiErrorMessage(error, fallback));
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
      isAdminHost={isPlatformAdminHost()}
      onShowPassword={togglePassword}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    />
  );
}

export default LoginController;
