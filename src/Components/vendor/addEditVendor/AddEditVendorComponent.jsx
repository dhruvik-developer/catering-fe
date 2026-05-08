/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { AnimatePresence, motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { FiArrowLeft, FiPlus, FiTruck } from "react-icons/fi";
import Loader from "../../common/Loader";
import PageHero from "../../common/PageHero";
import PasswordStrengthHints from "../../common/formInputs/PasswordStrengthHints";

function AddEditVendorComponent({
  navigate,
  mode,
  loading,
  form,
  errors,
  vendorCategories,
  availableCategories,
  hasExistingLogin,
  onInputChange,
  onSubmit,
  handleCategoryChange,
  handleRemoveCategory,
  handleAddCategoryRow,
}) {
  const isEdit = mode === "edit";
  const [showPassword, setShowPassword] = useState(false);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <Loader message="Loading vendor details..." />
      </Box>
    );
  }

  const selectedCategoryIds = vendorCategories
    .filter((entry) => entry.category)
    .map((entry) => Number(entry.category));

  return (
    <>
      <PageHero
        icon={<FiTruck size={24} />}
        eyebrow="Suppliers"
        title={isEdit ? "Edit Vendor" : "Add Vendor"}
        subtitle={
          isEdit ? "Update vendor details" : "Register a new vendor"
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
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Vendor Name *"
                placeholder="Enter vendor name"
                name="name"
                value={form.name}
                onChange={onInputChange}
                error={!!errors.name}
                helperText={errors.name || ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Mobile Number"
                placeholder="10-digit mobile number"
                name="mobile_no"
                type="tel"
                value={form.mobile_no}
                onChange={onInputChange}
                error={!!errors.mobile_no}
                helperText={errors.mobile_no || ""}
                slotProps={{ htmlInput: { maxLength: 10, inputMode: "numeric" } }}
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Address"
            placeholder="Enter vendor address"
            name="address"
            value={form.address}
            onChange={onInputChange}
          />

          <Divider />

          {/* Vendor login */}
          <Box>
            <Stack
              direction="row"


              spacing={2}
             sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Vendor Login
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Optional linked user account for vendor login.
                </Typography>
              </Box>
              <FormControlLabel
                sx={{ m: 0 }}
                control={
                  <Switch
                    name="login_enabled"
                    checked={Boolean(form.login_enabled)}
                    onChange={onInputChange}
                    disabled={hasExistingLogin}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    {form.login_enabled ? "Enabled" : "Disabled"}
                  </Typography>
                }
              />
            </Stack>

            {hasExistingLogin && (
              <Alert severity="info" variant="outlined" sx={{ mt: 1.5 }}>
                Existing linked login mila hai. Current backend se login disable
                nahi hota, sirf update hota hai.
              </Alert>
            )}

            {form.login_enabled && (
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Login Username *"
                    placeholder="Enter login username"
                    name="login_username"
                    value={form.login_username}
                    onChange={onInputChange}
                    autoComplete="none"
                    error={!!errors.login_username}
                    helperText={errors.login_username || ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={`Login Password${hasExistingLogin ? "" : " *"}`}
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      hasExistingLogin
                        ? "Leave blank to keep current password"
                        : "Create a strong password"
                    }
                    name="login_password"
                    value={form.login_password}
                    onChange={onInputChange}
                    autoComplete="new-password"
                    error={!!errors.login_password}
                    helperText={errors.login_password || ""}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              edge="end"
                              onClick={() => setShowPassword((s) => !s)}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <PasswordStrengthHints
                    value={form.login_password}
                    alwaysShow={!hasExistingLogin}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Login Email"
                    type="email"
                    placeholder="vendor@example.com"
                    name="login_email"
                    value={form.login_email}
                    onChange={onInputChange}
                    error={!!errors.login_email}
                    helperText={errors.login_email || "Optional"}
                  />
                </Grid>
              </Grid>
            )}
          </Box>

          <FormControlLabel
            sx={{ m: 0 }}
            control={
              <Switch
                name="is_active"
                checked={Boolean(form.is_active)}
                onChange={onInputChange}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Active Status —{" "}
                <Box component="span" sx={{ color: "text.secondary" }}>
                  {form.is_active ? "Active" : "Inactive"}
                </Box>
              </Typography>
            }
          />

          <Divider />

          {/* Vendor Categories */}
          <Box>
            <Stack
              direction="row"


              sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Vendor Categories
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  (Send nested `category` objects as required by backend)
                </Typography>
              </Stack>
              {vendorCategories.length === 0 && (
                <Button
                  variant="text"
                  size="small"
                  startIcon={<FiPlus size={14} />}
                  onClick={handleAddCategoryRow}
                >
                  Add Category
                </Button>
              )}
            </Stack>

            <Stack spacing={1}>
              <AnimatePresence>
                {vendorCategories.map((entry, index) => {
                  const isLastEmptyRow =
                    index === vendorCategories.length - 1 && !entry.category;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <Select
                          fullWidth
                          size="small"
                          value={entry.category}
                          onChange={(e) =>
                            handleCategoryChange(index, e.target.value)
                          }
                          displayEmpty
                          sx={{ flex: 1 }}
                        >
                          <MenuItem value="">
                            <em>Select Category</em>
                          </MenuItem>
                          {availableCategories.map((category) => (
                            <MenuItem
                              key={category.id}
                              value={category.id}
                              disabled={
                                selectedCategoryIds.includes(category.id) &&
                                Number(entry.category) !== category.id
                              }
                            >
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>

                        {!isLastEmptyRow ? (
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveCategory(index)}
                            sx={{
                              bgcolor: "error.light",
                              color: "common.white",
                              "&:hover": { bgcolor: "error.main" },
                            }}
                          >
                            <FaTimes size={16} />
                          </IconButton>
                        ) : (
                          <Box sx={{ width: 40 }} />
                        )}
                      </Stack>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Stack>
          </Box>

          <Stack direction="row" sx={{ justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 4 }}
            >
              {isEdit ? "Update Vendor" : "Save Vendor"}
            </Button>
          </Stack>
        </Stack>
      </Box>
      </Paper>
    </>
  );
}

export default AddEditVendorComponent;
