/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  FiUser,
  FiShield,
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
  FiUsers,
  FiLock,
} from "react-icons/fi";

function PermissionsComponent({
  loading,
  isSaving,
  modules,
  users,
  selectedType,
  selectedId,
  currentPermissions,
  onTypeChange,
  onSelectSubject,
  togglePermission,
  onSave,
}) {
  const [expandedModules, setExpandedModules] = useState([]);

  const toggleModule = (moduleName) => {
    setExpandedModules((prev) =>
      prev.includes(moduleName)
        ? prev.filter((name) => name !== moduleName)
        : [...prev, moduleName]
    );
  };

  const subjects = users;

  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      spacing={2}
      sx={{ height: { lg: "calc(100vh - 200px)" } }}
    >
      {/* Left sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: "100%", lg: 320 },
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedType}
            onChange={(_, value) => onTypeChange(value)}
            variant="fullWidth"
            sx={{
              minHeight: 36,
              "& .MuiTab-root": { minHeight: 36, textTransform: "capitalize", fontWeight: 700 },
            }}
          >
            <Tab label="Staff" value="staff" />
            <Tab label="Vendor" value="vendor" />
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
          {subjects.length === 0 && !loading && (
            <Stack alignItems="center" sx={{ py: 5, color: "text.disabled" }}>
              <FiUsers size={32} />
              <Typography variant="caption" sx={{ mt: 1 }}>
                No {selectedType}s found
              </Typography>
            </Stack>
          )}

          <Stack spacing={1}>
            {subjects.map((sub) => {
              const isActive = selectedId === sub.id;
              return (
                <Box
                  key={sub.id}
                  component="button"
                  type="button"
                  onClick={() => onSelectSubject(sub.id)}
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    cursor: "pointer",
                    textAlign: "left",
                    border: 1,
                    borderColor: isActive ? "primary.light" : "transparent",
                    bgcolor: isActive
                      ? (t) => t.palette.primary.light + "26"
                      : "transparent",
                    "&:hover": {
                      bgcolor: isActive
                        ? (t) => t.palette.primary.light + "33"
                        : "action.hover",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: isActive ? "primary.main" : "action.selected",
                      color: isActive ? "primary.contrastText" : "text.secondary",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <FiUser size={18} />
                  </Avatar>
                  <Box minWidth={0}>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color={isActive ? "primary.main" : "text.primary"}
                      noWrap
                    >
                      {sub.name || sub.username || "Unnamed"}
                    </Typography>
                    {sub.phone && (
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        noWrap
                      >
                        {sub.phone}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Paper>

      {/* Main area */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          overflow: "hidden",
          minHeight: { xs: 400, lg: "auto" },
        }}
      >
        {!selectedId ? (
          <Stack
            flex={1}
            alignItems="center"
            justifyContent="center"
            sx={{ color: "text.disabled", py: 6 }}
          >
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: "action.hover",
                color: "text.disabled",
                width: 72,
                height: 72,
                mb: 2,
              }}
            >
              <FiShield size={36} />
            </Avatar>
            <Typography variant="body2" fontWeight={500}>
              Select a {selectedType} to manage permissions
            </Typography>
          </Stack>
        ) : (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              sx={{
                p: 3,
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Assign Permissions
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Control what this {selectedType} can see and do.
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={onSave}
                disabled={isSaving || loading}
                startIcon={
                  isSaving ? (
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        border: "2px solid",
                        borderColor: "currentColor",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        "@keyframes spin": {
                          to: { transform: "rotate(360deg)" },
                        },
                      }}
                    />
                  ) : (
                    <FiCheckCircle />
                  )
                }
              >
                Save Changes
              </Button>
            </Stack>

            <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
              {loading ? (
                <Stack spacing={2}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      variant="rounded"
                      height={96}
                      animation="wave"
                    />
                  ))}
                </Stack>
              ) : (
                <Grid container spacing={2}>
                  {modules.map((mod) => {
                    const assignedCount = mod.permissions.filter((p) =>
                      currentPermissions.includes(p.code)
                    ).length;
                    const isExpanded = expandedModules.includes(mod.name);

                    return (
                      <Grid key={mod.name} size={{ xs: 12, md: 6 }}>
                        <Card
                          sx={{
                            overflow: "hidden",
                            transition: "border-color 0.2s",
                            "&:hover": { borderColor: "primary.main" },
                          }}
                        >
                          <Box
                            component="button"
                            type="button"
                            onClick={() => toggleModule(mod.name)}
                            sx={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              p: 2,
                              bgcolor: "action.hover",
                              border: 0,
                              cursor: "pointer",
                              textAlign: "left",
                              "&:hover": { bgcolor: "action.selected" },
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1.5}
                              alignItems="center"
                            >
                              <Avatar
                                variant="rounded"
                                sx={{
                                  bgcolor: "background.paper",
                                  color: "primary.main",
                                  width: 32,
                                  height: 32,
                                  border: 1,
                                  borderColor: "divider",
                                }}
                              >
                                <FiLock size={16} />
                              </Avatar>
                              <Typography
                                variant="body2"
                                fontWeight={700}
                                color="text.primary"
                              >
                                {mod.name}
                              </Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              spacing={1.5}
                              alignItems="center"
                            >
                              <Chip
                                size="small"
                                label={`${assignedCount}/${mod.permissions.length}`}
                                color={
                                  assignedCount > 0 ? "primary" : "default"
                                }
                                variant={
                                  assignedCount > 0 ? "filled" : "outlined"
                                }
                                sx={{
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  height: 20,
                                }}
                              />
                              <IconButton size="small" component="span">
                                {isExpanded ? (
                                  <FiChevronDown size={18} />
                                ) : (
                                  <FiChevronRight size={18} />
                                )}
                              </IconButton>
                            </Stack>
                          </Box>

                          {isExpanded && (
                            <Stack spacing={1} sx={{ p: 2 }}>
                              {mod.permissions.map((perm) => {
                                const isChecked = currentPermissions.includes(
                                  perm.code
                                );
                                return (
                                  <Box
                                    key={perm.code}
                                    component="label"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      p: 1.25,
                                      borderRadius: 2,
                                      border: 1,
                                      borderColor: isChecked
                                        ? "primary.light"
                                        : "divider",
                                      bgcolor: isChecked
                                        ? (t) => t.palette.primary.light + "26"
                                        : "transparent",
                                      color: isChecked
                                        ? "primary.main"
                                        : "text.secondary",
                                      cursor: "pointer",
                                      transition: "all 0.15s",
                                      "&:hover": {
                                        bgcolor: isChecked
                                          ? (t) =>
                                              t.palette.primary.light + "33"
                                          : "action.hover",
                                      },
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        variant="caption"
                                        fontWeight={700}
                                        sx={{
                                          display: "block",
                                          maxWidth: 150,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {perm.name}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          opacity: 0.6,
                                          textTransform: "uppercase",
                                          letterSpacing: 0.5,
                                          fontSize: "0.6rem",
                                        }}
                                      >
                                        {perm.code}
                                      </Typography>
                                    </Box>
                                    <Checkbox
                                      size="small"
                                      checked={isChecked}
                                      onChange={() =>
                                        togglePermission(perm.code)
                                      }
                                    />
                                  </Box>
                                );
                              })}
                            </Stack>
                          )}
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>
          </>
        )}
      </Paper>
    </Stack>
  );
}

export default PermissionsComponent;
