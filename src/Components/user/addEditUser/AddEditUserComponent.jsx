/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

function AddEditUserComponent({
  navigate,
  mode,
  form,
  errors,
  onSubmit,
  onInputChange,
}) {
  const isEdit = mode === "editUser";
  const [showPassword, setShowPassword] = useState(false);

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
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        {isEdit ? "Change User Password" : "Add New User"}
      </Typography>

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

          <Stack direction="row" justifyContent="center">
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
  );
}

export default AddEditUserComponent;
