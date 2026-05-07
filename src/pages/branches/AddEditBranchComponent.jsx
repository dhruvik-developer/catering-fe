/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { FiArrowLeft, FiGitBranch, FiSave } from "react-icons/fi";
import Loader from "../../Components/common/Loader";
import PageHero from "../../Components/common/PageHero";
import { getUsers } from "../../api/FetchUsers";
import { extractArray } from "../../utils/queryData";
import { logError } from "../../utils/logger";

function AddEditBranchComponent({
  mode,
  loading,
  saving,
  form,
  errors,
  onChange,
  onSubmit,
  navigate,
}) {
  const isEdit = mode === "edit";
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Manager dropdown is populated from the tenant's user list. We only need
  // the id + display name, so a lightweight transform here is enough.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await getUsers();
        if (cancelled) return;
        setUsers(extractArray(response?.data));
      } catch (err) {
        logError("Failed to load users for manager dropdown", err);
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  return (
    <>
      <PageHero
        icon={<FiGitBranch size={24} />}
        eyebrow="Tenant"
        title={isEdit ? "Edit Branch" : "Add Branch"}
        subtitle={
          isEdit ? "Update branch details" : "Register a new branch"
        }
        actions={
          <Button
            variant="outlined"
            startIcon={<FiArrowLeft size={16} />}
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "rgba(255,255,255,0.18)",
              color: "var(--color-primary-contrast,white)",
              border: "1px solid rgba(255,255,255,0.35)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
            }}
          >
            Back
          </Button>
        }
      />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Branch Name"
                name="name"
                value={form.name}
                onChange={onChange}
                error={Boolean(errors.name)}
                helperText={errors.name || " "}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Branch Code"
                name="branch_code"
                value={form.branch_code}
                onChange={onChange}
                error={Boolean(errors.branch_code)}
                helperText={
                  errors.branch_code ||
                  "Short identifier (e.g. surat, ahmedabad)"
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={form.city}
                onChange={onChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={form.state}
                onChange={onChange}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={form.address}
                onChange={onChange}
                multiline
                minRows={2}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={form.phone_number}
                onChange={onChange}
                error={Boolean(errors.phone_number)}
                helperText={errors.phone_number || " "}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                error={Boolean(errors.email)}
                helperText={errors.email || " "}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Manager"
                name="manager"
                value={form.manager || ""}
                onChange={onChange}
                disabled={usersLoading}
                helperText={
                  usersLoading
                    ? "Loading users..."
                    : "Optional. Pick a tenant user to manage this branch."
                }
              >
                <MenuItem value="">— None —</MenuItem>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.username || u.email || u.id}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack
                direction="row"
                spacing={3}
                sx={{ alignItems: "center", height: "100%" }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      name="is_active"
                      checked={Boolean(form.is_active)}
                      onChange={onChange}
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="is_main"
                      checked={Boolean(form.is_main)}
                      onChange={onChange}
                    />
                  }
                  label="Main branch"
                />
              </Stack>
            </Grid>
          </Grid>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ mt: 3, justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<FiSave size={16} />}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Branch"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </>
  );
}

export default AddEditBranchComponent;
