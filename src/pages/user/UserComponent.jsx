/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Loader from "../../Components/common/Loader";
import UsersTable from "../../Components/user/UserTable";
import PageHero from "../../Components/common/PageHero";
import { FiUsers, FiUserPlus, FiBook } from "react-icons/fi";

function UserComponent({
  navigate,
  loading,
  users,
  onUserAdd,
  onUserEdit,
  onUserDelete,
}) {
  const heroActionSx = {
    bgcolor: "rgba(255,255,255,0.18)",
    color: "var(--color-primary-contrast,white)",
    border: "1px solid rgba(255,255,255,0.35)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
  };

  return (
    <>
      <PageHero
        icon={<FiUsers size={24} />}
        eyebrow="Team"
        title="Users"
        subtitle={`${users?.length || 0} user${users?.length !== 1 ? "s" : ""} registered`}
        actions={
          <>
            <Button
              variant="contained"
              startIcon={<FiUserPlus size={15} />}
              onClick={onUserAdd}
              sx={heroActionSx}
            >
              Add User
            </Button>
            <Button
              variant="outlined"
              startIcon={<FiBook size={15} />}
              onClick={() => navigate("/add-rule", { state: "addrule" })}
              sx={heroActionSx}
            >
              Add Rule
            </Button>
          </>
        }
      />
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
      >

        {loading ? (
          <Loader message="Loading users..." />
        ) : (
          <UsersTable
            users={users}
            onUserEdit={onUserEdit}
            onUserDelete={onUserDelete}
          />
        )}
      </Paper>
    </>
  );
}

export default UserComponent;
