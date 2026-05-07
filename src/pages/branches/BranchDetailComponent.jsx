/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  FiArrowLeft,
  FiEdit2,
  FiGitBranch,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import Loader from "../../Components/common/Loader";
import PageHero from "../../Components/common/PageHero";
import EmptyState from "../../Components/common/EmptyState";

function FieldRow({ icon, label, value }) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ alignItems: "flex-start", py: 0.75 }}
    >
      <Box sx={{ color: "primary.main", mt: 0.25 }}>{icon}</Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontWeight: 700,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontWeight: 500, wordBreak: "break-word" }}
        >
          {value || "—"}
        </Typography>
      </Box>
    </Stack>
  );
}

function BranchDetailComponent({
  navigate,
  loading,
  branch,
  users,
  usersLoading,
  onEdit,
}) {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
        }}
      >
        <Loader message="Loading branch..." />
      </Box>
    );
  }

  if (!branch) {
    return (
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <EmptyState
          icon={<FiGitBranch size={24} />}
          title="Branch not found"
          message="This branch may have been deleted or you may not have access."
        />
      </Paper>
    );
  }

  const heroBtnSx = {
    bgcolor: "rgba(255,255,255,0.18)",
    color: "var(--color-primary-contrast,white)",
    border: "1px solid rgba(255,255,255,0.35)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
  };

  return (
    <>
      <PageHero
        icon={<FiGitBranch size={24} />}
        eyebrow="Tenant"
        title={branch.name}
        subtitle={`Branch code: ${branch.branch_code || "—"}`}
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<FiArrowLeft size={16} />}
              onClick={() => navigate("/branches")}
              sx={heroBtnSx}
            >
              Back
            </Button>
            <Button
              variant="contained"
              startIcon={<FiEdit2 size={16} />}
              onClick={onEdit}
              sx={heroBtnSx}
            >
              Edit
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", mb: 1.5 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Profile
              </Typography>
              <Chip
                size="small"
                label={branch.is_active ? "Active" : "Inactive"}
                color={branch.is_active ? "success" : "error"}
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
              {branch.is_main && (
                <Chip
                  size="small"
                  label="Main"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                />
              )}
            </Stack>
            <Divider sx={{ mb: 1.5 }} />

            <FieldRow
              icon={<FiMapPin size={16} />}
              label="City / State"
              value={[branch.city, branch.state].filter(Boolean).join(", ")}
            />
            <FieldRow
              icon={<FiMapPin size={16} />}
              label="Address"
              value={branch.address}
            />
            <FieldRow
              icon={<FiPhone size={16} />}
              label="Phone"
              value={branch.phone_number}
            />
            <FieldRow
              icon={<FiMail size={16} />}
              label="Email"
              value={branch.email}
            />
            <FieldRow
              icon={<FiUser size={16} />}
              label="Manager"
              value={branch.manager_username}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Assigned Users
              </Typography>
              <Chip
                size="small"
                label={`${users?.length || 0} user${
                  users?.length !== 1 ? "s" : ""
                }`}
                sx={{ fontWeight: 700 }}
              />
            </Stack>
            <Divider sx={{ mb: 1 }} />

            {usersLoading ? (
              <Loader message="Loading users..." />
            ) : !users || users.length === 0 ? (
              <EmptyState
                icon={<FiUser size={20} />}
                title="No users assigned"
                message="Assign a user to this branch from the Users screen."
              />
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="center">
                        Active
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {u.username || u.id}
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {u.email || "—"}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={u.is_active ? "Active" : "Inactive"}
                            color={u.is_active ? "success" : "default"}
                            variant="outlined"
                            sx={{ fontWeight: 700 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default BranchDetailComponent;
