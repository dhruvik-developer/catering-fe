/* eslint-disable react/prop-types */
import {
  Box,
  Card,
  CardContent,
  Chip,
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
import { FiEdit2, FiEye, FiGitBranch } from "react-icons/fi";
import EmptyState from "../common/EmptyState";

function StatusBadge({ active }) {
  return (
    <Chip
      size="small"
      label={active ? "Active" : "Inactive"}
      color={active ? "success" : "error"}
      variant="outlined"
      sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}
    />
  );
}

function MainBadge({ isMain }) {
  if (!isMain) return null;
  return (
    <Chip
      size="small"
      label="Main"
      color="primary"
      sx={{ fontWeight: 700, ml: 0.75, height: 20, fontSize: "0.65rem" }}
    />
  );
}

function BranchTable({ branches, onEdit, onView, onDelete }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  if (!branches || branches.length === 0) {
    return (
      <EmptyState
        icon={<FiGitBranch size={24} />}
        title="No branches yet"
        message='Use "Add Branch" to create your first branch (e.g. Surat, Ahmedabad).'
      />
    );
  }

  if (!isDesktop) {
    return (
      <Grid container spacing={1.5}>
        {branches.map((branch, index) => (
          <Grid key={branch.id} size={12}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center" }}
                    >
                      <Typography variant="caption" color="text.disabled">
                        #{(index + 1).toString().padStart(2, "0")}
                      </Typography>
                      <StatusBadge active={branch.is_active} />
                      <MainBadge isMain={branch.is_main} />
                    </Stack>
                    <Typography
                      variant="subtitle1"
                      noWrap
                      sx={{ fontWeight: 700, mt: 0.5 }}
                    >
                      {branch.name || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                    >
                      {branch.branch_code || "—"} · {branch.city || "—"}
                    </Typography>
                  </Box>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ flexShrink: 0 }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => onView(branch)}
                      title="View Branch"
                    >
                      <FiEye size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(branch)}
                      title="Edit Branch"
                    >
                      <FiEdit2 size={16} />
                    </IconButton>
                    {!branch.is_main && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(branch)}
                        title="Delete Branch"
                      >
                        <FaTrash size={14} />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
                {branch.address && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontWeight: 700,
                      }}
                    >
                      Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {branch.address}
                    </Typography>
                  </Box>
                )}
                {branch.manager_username && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontWeight: 700,
                      }}
                    >
                      Manager
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {branch.manager_username}
                    </Typography>
                  </Box>
                )}
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
            <TableCell sx={{ fontWeight: 700 }}>Branch Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>City</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Manager</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">
              Users
            </TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {branches.map((branch, index) => (
            <TableRow
              key={branch.id}
              hover
              sx={{ "&:last-child td": { borderBottom: 0 } }}
            >
              <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                {(index + 1).toString().padStart(2, "0")}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <Stack direction="row" sx={{ alignItems: "center" }}>
                  <span>{branch.name || "N/A"}</span>
                  <MainBadge isMain={branch.is_main} />
                </Stack>
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {branch.branch_code || "—"}
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {branch.city || "—"}
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {branch.manager_username || "—"}
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {branch.phone_number || "—"}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                {Number(branch.users_count ?? 0)}
              </TableCell>
              <TableCell align="center">
                <StatusBadge active={branch.is_active} />
              </TableCell>
              <TableCell align="center">
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ justifyContent: "center" }}
                >
                  <IconButton
                    size="small"
                    onClick={() => onView(branch)}
                    title="View Branch"
                  >
                    <FiEye size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(branch)}
                    title="Edit Branch"
                  >
                    <FiEdit2 size={16} />
                  </IconButton>
                  {!branch.is_main && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(branch)}
                      title="Delete Branch"
                    >
                      <FaTrash size={14} />
                    </IconButton>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BranchTable;
