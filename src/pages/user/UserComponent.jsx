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
import { FiUsers, FiUserPlus, FiBook } from "react-icons/fi";

function UserComponent({
  navigate,
  loading,
  users,
  onUserAdd,
  onUserEdit,
  onUserDelete,
}) {
  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: (t) => t.palette.primary.light + "33",
              color: "primary.main",
              width: 44,
              height: 44,
            }}
          >
            <FiUsers size={20} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {users?.length || 0} user{users?.length !== 1 ? "s" : ""}{" "}
              registered
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FiUserPlus size={15} />}
            onClick={onUserAdd}
          >
            Add User
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FiBook size={15} />}
            onClick={() => navigate("/add-rule", { state: "addrule" })}
          >
            Add Rule
          </Button>
        </Stack>
      </Stack>

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
  );
}

export default UserComponent;
