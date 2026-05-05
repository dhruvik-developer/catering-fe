import Sidebar from "./Sidebar";
import Header from "./Header";
import TranslationGate from "./TranslationGate";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useContext } from "react";
import { Box } from "@mui/material";
import { UserContext } from "../../context/UserContext";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logout } = useContext(UserContext);

  useEffect(() => {
    if (!token) {
      logout();
      navigate("/login");
    }
  }, [token, navigate, logout]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "background.default",
        background: "var(--app-shell-background)",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Header />
        <Box
          key={location.pathname}
          sx={{
            flex: 1,
            overflowX: "hidden",
            overflowY: "auto",
            p: { xs: 1.5, sm: 2.5 },
            bgcolor: "var(--color-primary-soft)",
            animation: "slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <TranslationGate>
              <Outlet />
            </TranslationGate>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
