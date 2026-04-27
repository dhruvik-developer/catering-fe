import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { toggleSidebar } from "../../redux/uiSlice";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        <Header toggleSidebar={() => dispatch(toggleSidebar())} />
        <Box
          sx={{
            flex: 1,
            overflowX: "hidden",
            overflowY: "auto",
            p: { xs: 1.5, sm: 2.5 },
            bgcolor: "transparent",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
