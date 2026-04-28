/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { RiUser3Fill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from "../../Components/common/Loader";
import BaseImage from "../../Components/common/BaseImage";

function LoginComponent({
  credentials,
  loading,
  showPassword,
  errors,
  businessLogo,
  isLogoLoading,
  onShowPassword,
  handleInputChange,
  handleSubmit,
}) {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
          background: "var(--app-shell-background)",
        }}
      >
        <Loader message="Signing in..." />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        background: "var(--app-shell-background)",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          border: 1,
          borderColor: "var(--app-border)",
          bgcolor: "var(--app-surface-strong)",
          boxShadow: "var(--app-shadow)",
          backdropFilter: "blur(18px)",
          width: "100%",
          maxWidth: 400,
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Stack sx={{ mb: 2, alignItems: "center" }}>
          {isLogoLoading ? (
            <Skeleton variant="rounded" width={180} height={80} />
          ) : businessLogo ? (
            <BaseImage
              src={businessLogo}
              alt="Business Logo"
              className="h-20 max-w-[180px] object-contain"
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Set your logo
            </Typography>
          )}
        </Stack>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}
        >
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <Box>
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ fontWeight: 700, mb: 0.75 }}
              >
                Username
              </Typography>
              <TextField
                fullWidth
                name="username"
                type="text"
                placeholder={errors.username || "Enter your username"}
                value={credentials.username}
                onChange={handleInputChange}
                autoComplete="username"
                error={!!errors.username}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <RiUser3Fill color="currentColor" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ fontWeight: 700, mb: 0.75 }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={errors.password || "Enter your password"}
                value={credentials.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                error={!!errors.password}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          onClick={onShowPassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Button
              type="submit" fullWidth
              size="large"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              Sign In
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginComponent;
