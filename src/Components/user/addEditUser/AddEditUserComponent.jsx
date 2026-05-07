/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiArrowLeft, FiUserPlus } from "react-icons/fi";
import PageHero from "../../common/PageHero";
import { useBranches } from "../../../hooks/useBranches";

function AddEditUserComponent({
  navigate,
  mode,
  form,
  errors,
  onSubmit,
  onInputChange,
  isMainTenantAdmin = false,
  // eslint-disable-next-line no-unused-vars
  isBranchAdmin = false,
}) {
  const isEdit = mode === "editUser";
  const [showPassword, setShowPassword] = useState(false);
  // Branch + role dropdowns only matter when (a) we're creating a new user
  // and (b) the current user is a main tenant admin. Branch admins have
  // these fields auto-set on the server, so we hide them entirely.
  const showBranchAndRole = !isEdit && isMainTenantAdmin;
  const { data: branches = [], isLoading: branchesLoading } = useBranches(
    {},
    { enabled: showBranchAndRole }
  );

  return (
    <>
      <PageHero
        icon={<FiUserPlus size={24} />}
        eyebrow={isEdit ? "Update credentials" : "Onboarding"}
        title={isEdit ? "Change User Password" : "Add New User"}
        subtitle={
          isEdit
            ? "Set a new password for this user account."
            : "Register a new user with workspace access."
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
        <Stack spacing={2.5}>
          {!isEdit && (
            <>
              <TextField
                fullWidth
                label="User Name"
                placeholder={errors.username || "Enter Your User Name"}
                name="username"
                value={form.username}
                onChange={onInputChange}
                autoComplete="none"
                error={!!errors.username}
                helperText={errors.username || ""}
              />
              <TextField
                fullWidth
                label="Email"
                placeholder={errors.email || "Enter Your Mail Address"}
                name="email"
                value={form.email}
                onChange={onInputChange}
                error={!!errors.email}
                helperText={errors.email || "Optional"}
              />

              {showBranchAndRole && (
                <>
                  <TextField
                    fullWidth
                    select
                    label="Branch"
                    name="branch_profile_id"
                    value={form.branch_profile_id || ""}
                    onChange={onInputChange}
                    disabled={branchesLoading}
                    helperText={
                      branchesLoading
                        ? "Loading branches..."
                        : "Optional. Assigning a branch limits this user to that branch."
                    }
                  >
                    <MenuItem value="">— No branch —</MenuItem>
                    {branches.map((b) => (
                      <MenuItem key={b.id} value={b.id}>
                        {b.name}
                        {b.branch_code ? ` (${b.branch_code})` : ""}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    select
                    label="Role"
                    name="branch_role"
                    value={form.branch_role || "branch_user"}
                    onChange={onInputChange}
                    helperText="Branch admin can manage their own branch. Branch user has data-only access."
                  >
                    <MenuItem value="branch_user">Branch User</MenuItem>
                    <MenuItem value="branch_admin">Branch Admin</MenuItem>
                  </TextField>
                </>
              )}
            </>
          )}

          {isEdit && (
            <Typography variant="body2" color="text.secondary">
              User profile update API abhi backend me available nahi hai. Yahan
              se sirf password change hota hai.
            </Typography>
          )}

          <TextField
            fullWidth
            label={isEdit ? "New Password" : "Password"}
            type={showPassword ? "text" : "password"}
            placeholder={
              errors.password ||
              (isEdit ? "Enter New Password" : "Enter Password")
            }
            name="password"
            value={form.password}
            onChange={onInputChange}
            autoComplete="new-password"
            error={!!errors.password}
            helperText={errors.password || ""}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      edge="end"
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Stack direction="row" sx={{ justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ px: 4 }}
            >
              {isEdit ? "Update User" : "Save"}
            </Button>
          </Stack>
        </Stack>
      </Box>
      </Paper>
    </>
  );
}

export default AddEditUserComponent;
