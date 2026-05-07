/* eslint-disable react/prop-types */
import {
  Avatar,
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
import { FaEye, FaEyeSlash, FaUtensils, FaBirthdayCake, FaWineGlassAlt } from "react-icons/fa";
import {
  GiChefToque,
  GiCookingPot,
  GiKnifeFork,
  GiForkKnifeSpoon,
  GiCupcake,
  GiHotMeal,
  GiBowlOfRice,
  GiSlicedBread,
} from "react-icons/gi";
import { MdRestaurantMenu, MdLocalDining, MdEventAvailable } from "react-icons/md";
import Loader from "../../Components/common/Loader";
import BaseImage from "../../Components/common/BaseImage";

// Decorative catering icons floated in the login background. Each entry pins
// the icon to a viewport corner with subtle opacity / rotation so the card
// stays the focal point but the page no longer feels empty.
const BACKGROUND_ICONS = [
  { Icon: GiChefToque, top: "6%", left: "8%", size: 110, rotate: -12, opacity: 0.32 },
  { Icon: FaUtensils, top: "14%", right: "10%", size: 80, rotate: 18, opacity: 0.28 },
  { Icon: GiCookingPot, bottom: "10%", left: "6%", size: 118, rotate: 8, opacity: 0.32 },
  { Icon: GiCupcake, bottom: "14%", right: "8%", size: 96, rotate: -14, opacity: 0.32 },
  { Icon: MdRestaurantMenu, top: "42%", left: "4%", size: 72, rotate: 0, opacity: 0.26 },
  { Icon: MdLocalDining, top: "38%", right: "5%", size: 76, rotate: -8, opacity: 0.26 },
  { Icon: FaBirthdayCake, top: "70%", left: "22%", size: 64, rotate: 6, opacity: 0.24 },
  { Icon: FaWineGlassAlt, top: "22%", left: "30%", size: 60, rotate: -10, opacity: 0.22 },
  { Icon: GiKnifeFork, bottom: "30%", right: "26%", size: 68, rotate: 14, opacity: 0.24 },
  { Icon: GiForkKnifeSpoon, top: "62%", right: "18%", size: 68, rotate: -6, opacity: 0.24 },
  { Icon: GiHotMeal, top: "8%", left: "48%", size: 62, rotate: 4, opacity: 0.22 },
  { Icon: GiBowlOfRice, bottom: "8%", left: "44%", size: 62, rotate: -4, opacity: 0.22 },
  { Icon: GiSlicedBread, top: "30%", left: "16%", size: 54, rotate: 10, opacity: 0.22 },
  { Icon: MdEventAvailable, bottom: "38%", left: "30%", size: 56, rotate: -6, opacity: 0.22 },
];

// Decorative shapes (rings, dots, dashed circles) layered over the icon
// field so the background reads as "designed" rather than "icon dump".
const BACKGROUND_SHAPES = [
  // Large outlined ring, top-right
  { type: "ring", top: "12%", right: "18%", size: 180, borderWidth: 2, opacity: 0.35 },
  // Smaller solid dot cluster, top-left area
  { type: "dot", top: "20%", left: "22%", size: 14, opacity: 0.5 },
  { type: "dot", top: "24%", left: "26%", size: 8, opacity: 0.4 },
  { type: "dot", top: "18%", left: "28%", size: 6, opacity: 0.45 },
  // Dashed ring, mid-left
  { type: "dashedRing", top: "55%", left: "12%", size: 140, opacity: 0.35 },
  // Mid-right small ring
  { type: "ring", bottom: "22%", right: "14%", size: 100, borderWidth: 2, opacity: 0.35 },
  // Bottom-left dots
  { type: "dot", bottom: "18%", left: "32%", size: 12, opacity: 0.45 },
  { type: "dot", bottom: "22%", left: "36%", size: 6, opacity: 0.4 },
];

function LoginComponent({
  credentials,
  loading,
  showPassword,
  errors,
  businessLogo,
  isLogoLoading,
  isAdminHost,
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
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        background: "var(--app-shell-background)",
        overflow: "hidden",
        p: 2,
      }}
    >
      {/* Soft primary-tinted gradient blobs add depth behind the icon field. */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-primary), transparent 55%) 0%, transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: 560,
          height: 560,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-primary), transparent 65%) 0%, transparent 70%)",
          filter: "blur(24px)",
          pointerEvents: "none",
        }}
      />

      {/* Dotted grid texture — gives the page a fine "menu paper" feel. */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.55,
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--color-primary), transparent 78%) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(circle at center, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 30%, transparent 80%)",
        }}
      />

      {/* Decorative shapes (rings + dots) layered behind the icons. */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          display: { xs: "none", sm: "block" },
        }}
      >
        {BACKGROUND_SHAPES.map((shape, i) => {
          const base = {
            position: "absolute",
            top: shape.top,
            left: shape.left,
            right: shape.right,
            bottom: shape.bottom,
            width: shape.size,
            height: shape.size,
            opacity: shape.opacity,
          };
          if (shape.type === "ring") {
            return (
              <Box
                key={i}
                sx={{
                  ...base,
                  borderRadius: "50%",
                  border: `${shape.borderWidth}px solid var(--color-primary)`,
                }}
              />
            );
          }
          if (shape.type === "dashedRing") {
            return (
              <Box
                key={i}
                sx={{
                  ...base,
                  borderRadius: "50%",
                  border: "2px dashed var(--color-primary)",
                }}
              />
            );
          }
          // dot
          return (
            <Box
              key={i}
              sx={{
                ...base,
                borderRadius: "50%",
                bgcolor: "var(--color-primary)",
              }}
            />
          );
        })}
      </Box>

      {/* Catering-themed icon field. Hidden on small screens so the card
          remains uncluttered on phones. */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          display: { xs: "none", sm: "block" },
        }}
      >
        {BACKGROUND_ICONS.map(
          ({ Icon, top, left, right, bottom, size, rotate, opacity }, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                top,
                left,
                right,
                bottom,
                color: "var(--color-primary)",
                opacity,
                transform: `rotate(${rotate}deg)`,
                lineHeight: 0,
                filter:
                  "drop-shadow(0 4px 12px color-mix(in srgb, var(--color-primary), transparent 75%))",
              }}
            >
              <Icon size={size} />
            </Box>
          )
        )}
      </Box>

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          border: 1,
          borderColor: "var(--app-border)",
          bgcolor: "color-mix(in srgb, var(--app-surface-strong), transparent 8%)",
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
        <Stack sx={{ mb: 2, alignItems: "center" }} spacing={1}>
          {isAdminHost ? (
            <>
              <Avatar
                sx={{
                  width: 88,
                  height: 88,
                  fontSize: "2rem",
                  fontWeight: 800,
                  letterSpacing: 1,
                  color: "var(--color-primary-contrast)",
                  background:
                    "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary), black 25%) 100%)",
                  boxShadow: "0 16px 32px -16px rgba(15, 23, 42, 0.55)",
                }}
              >
                EV
              </Avatar>
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: "var(--color-primary)",
                }}
              >
                Trayza Admin Login
              </Typography>
            </>
          ) : isLogoLoading ? (
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
          {isAdminHost ? "Operations Sign In" : "Sign In"}
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
