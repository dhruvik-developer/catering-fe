/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { FaTrash } from "react-icons/fa";
import { FiEdit2, FiUsers } from "react-icons/fi";
import EmptyState from "../common/EmptyState";

function UsersTable({ users, onUserEdit, onUserDelete }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  if (!users || users.length === 0) {
    return (
      <EmptyState
        icon={<FiUsers size={24} />}
        title="No Users Available"
        message='Use the "Add User" button to create new users.'
      />
    );
  }

  if (!isDesktop) {
    return (
      <Grid container spacing={1.5}>
        {users.map((user, index) => (
          <Grid key={user.id} size={12}>
            <Card>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {user.username?.charAt(0).toUpperCase() || "?"}
                </Avatar>
                <Box minWidth={0} flex={1}>
                  <Typography variant="caption" color="text.disabled">
                    #{(index + 1).toString().padStart(2, "0")}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>
                    {user.username || "N/A"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {user.email || "-"}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.5} flexShrink={0}>
                  <IconButton
                    size="small"
                    onClick={() => onUserEdit(user.id)}
                    title="Edit Password"
                  >
                    <FiEdit2 size={15} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onUserDelete(user.id)}
                    title="Delete User"
                  >
                    <FaTrash size={14} />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: (t) => t.palette.primary.light + "1a" }}>
            <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>User Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.id}
              hover
              sx={{ "&:last-child td": { borderBottom: 0 } }}
            >
              <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                {(index + 1).toString().padStart(2, "0")}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                    {user.username?.charAt(0).toUpperCase() || "?"}
                  </Avatar>
                  <Typography variant="body1" fontWeight={700}>
                    {user.username || "N/A"}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {user.email || "-"}
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={0.5} justifyContent="center">
                  <IconButton
                    size="small"
                    onClick={() => onUserEdit(user.id)}
                    title="Edit Password"
                  >
                    <FiEdit2 size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onUserDelete(user.id)}
                    title="Delete User"
                  >
                    <FaTrash size={14} />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UsersTable;
