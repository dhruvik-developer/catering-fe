/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  FiKey,
  FiLock,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiBox,
} from "react-icons/fi";
import Loader from "../../Components/common/Loader";
import PageHero from "../../Components/common/PageHero";

const ICON_BY_MODULE = {
  default: <FiBox size={18} />,
};

const AccessControlComponent = ({ loading, modules = [], tenants = [] }) => {
  const totalActions = modules.reduce(
    (sum, m) => sum + (Array.isArray(m.actions) ? m.actions.length : 0),
    0
  );

  const moduleAdoption = (moduleKey) =>
    tenants.filter((t) => {
      const enabled =
        t.enabled_modules || t.modules || t.subscription_modules || [];
      return Array.isArray(enabled)
        ? enabled.some((m) => (m === moduleKey || m?.key === moduleKey || m?.name === moduleKey))
        : false;
    }).length;

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: "background.paper",
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader message="Loading access control..." />
      </Paper>
    );
  }

  const heroChipSx = {
    bgcolor: "rgba(255,255,255,0.18)",
    color: "var(--color-primary-contrast,white)",
    border: "1px solid rgba(255,255,255,0.35)",
    fontWeight: 700,
    "& .MuiChip-icon": { color: "var(--color-primary-contrast,white)" },
  };

  return (
    <Stack spacing={3}>
      <PageHero
        icon={<FiShield size={24} />}
        eyebrow="Platform"
        title="Access Control"
        subtitle="Platform-wide modules, actions and tenant adoption"
        chips={
          <>
            <Chip icon={<FiBox />} label={`${modules.length} modules`} sx={heroChipSx} />
            <Chip icon={<FiKey />} label={`${totalActions} actions`} sx={heroChipSx} />
          </>
        }
      />

      {modules.length === 0 ? (
        <Card
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid var(--app-border)",
            boxShadow: "var(--app-shadow)",
          }}
        >
          <FiLock size={32} style={{ opacity: 0.4 }} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
            No modules configured
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Permission modules will appear here once your access-control catalog is populated.
          </Typography>
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2.5,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
          }}
        >
          {modules.map((module) => {
            const actions = Array.isArray(module.actions) ? module.actions : [];
            const moduleKey = module.key || module.code || module.name;
            const adoption = moduleAdoption(moduleKey);
            return (
              <Card
                key={moduleKey || module.id}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid var(--app-border)",
                  boxShadow: "var(--app-shadow)",
                  bgcolor: "background.paper",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "center", mb: 1.5 }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: "var(--color-primary-soft)",
                      color: "primary.main",
                      width: 40,
                      height: 40,
                    }}
                  >
                    {ICON_BY_MODULE[moduleKey] || ICON_BY_MODULE.default}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {module.name || moduleKey}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {module.description || moduleKey}
                    </Typography>
                  </Box>
                  {module.is_active === false ? (
                    <FiXCircle size={18} color="#ef4444" />
                  ) : (
                    <FiCheckCircle size={18} color="#10b981" />
                  )}
                </Stack>
                <Divider sx={{ mb: 1.5 }} />
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ flexWrap: "wrap", gap: 0.75 }}
                >
                  {actions.length === 0 ? (
                    <Typography variant="caption" color="text.disabled">
                      No actions defined
                    </Typography>
                  ) : (
                    actions.map((action, idx) => (
                      <Chip
                        key={`${moduleKey}-${idx}`}
                        size="small"
                        label={action.label || action.name || action.code || action}
                        sx={{
                          bgcolor: "rgba(99, 102, 241, 0.08)",
                          color: "#4f46e5",
                          fontWeight: 600,
                        }}
                      />
                    ))
                  )}
                </Stack>
                <Box
                  sx={{
                    mt: 2,
                    pt: 1.5,
                    borderTop: "1px dashed var(--app-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Adopted by
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
                    {adoption} tenant{adoption !== 1 ? "s" : ""}
                  </Typography>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}
    </Stack>
  );
};

export default AccessControlComponent;
