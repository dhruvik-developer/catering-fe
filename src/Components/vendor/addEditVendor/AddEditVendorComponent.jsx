/* eslint-disable react/prop-types */
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
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
import { FaTimes } from "react-icons/fa";
import { FiArrowLeft, FiPlus, FiTruck } from "react-icons/fi";
import Loader from "../../common/Loader";

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
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        bgcolor: "background.paper",
        mt: 5,
      }}
    >
      <Button
        variant="outlined"
        startIcon={<FiArrowLeft size={16} />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: "var(--color-primary-border)",
            color: "primary.main",
            width: 44,
            height: 44,
          }}
        >
          <FiTruck size={20} />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {isEdit ? "Edit Vendor" : "Add Vendor"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEdit ? "Update vendor details" : "Register a new vendor"}
          </Typography>
        </Box>
      </Stack>

      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.5}>
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
          <TextField
            fullWidth
            label="Mobile Number"
            placeholder="Enter mobile number"
            name="mobile_no"
            value={form.mobile_no}
            onChange={onInputChange}
            error={!!errors.mobile_no}
            helperText={errors.mobile_no || ""}
          />
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
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
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
                    type="password"
                    placeholder={
                      hasExistingLogin
                        ? "Leave blank to keep current password"
                        : "Minimum 4 characters"
                    }
                    name="login_password"
                    value={form.login_password}
                    onChange={onInputChange}
                    autoComplete="new-password"
                    error={!!errors.login_password}
                    helperText={errors.login_password || ""}
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
              <Typography variant="body2" fontWeight={500}>
                Active Status —{" "}
                <Box component="span" color="text.secondary">
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
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography variant="subtitle1" fontWeight={600}>
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
                      <Stack direction="row" spacing={1} alignItems="center">
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

          <Stack direction="row" justifyContent="center">
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
  );
}

export default AddEditVendorComponent;
