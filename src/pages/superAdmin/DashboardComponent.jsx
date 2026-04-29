/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  FiUsers,
  FiCreditCard,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";
import Loader from "../../Components/common/Loader";

const StatCard = ({ icon, label, value, accent, sub }) => (
  <Card
    sx={{
      p: 2.5,
      borderRadius: 3,
      border: "1px solid var(--app-border)",
      boxShadow: "var(--app-shadow)",
      bgcolor: "background.paper",
      flex: 1,
      minWidth: 220,
    }}
  >
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Avatar
        variant="rounded"
        sx={{
          bgcolor: `${accent}22`,
          color: accent,
          width: 48,
          height: 48,
        }}
      >
        {icon}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
          {value}
        </Typography>
        {sub ? (
          <Typography variant="caption" color="text.secondary">
            {sub}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  </Card>
);

const statusMeta = {
  active: { color: "success", label: "Active" },
  trialing: { color: "info", label: "Trialing" },
  past_due: { color: "warning", label: "Past due" },
  suspended: { color: "error", label: "Suspended" },
  cancelled: { color: "error", label: "Cancelled" },
  expired: { color: "error", label: "Expired" },
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const daysUntil = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((d - today) / (1000 * 60 * 60 * 24));
};

const DashboardComponent = ({ loading, tenants = [], plans = [] }) => {
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(
    (t) => t.subscription_status === "active"
  ).length;
  const trialingTenants = tenants.filter(
    (t) => t.subscription_status === "trialing"
  ).length;

  const expiringSoon = tenants
    .map((t) => ({ ...t, _days: daysUntil(t.subscription_end_date || t.next_billing_date) }))
    .filter((t) => t._days !== null && t._days >= 0 && t._days <= 30)
    .sort((a, b) => a._days - b._days);

  const expired = tenants.filter((t) => {
    const days = daysUntil(t.subscription_end_date || t.next_billing_date);
    return (
      t.subscription_status === "expired" ||
      t.subscription_status === "cancelled" ||
      (days !== null && days < 0)
    );
  });

  const planCounts = plans.map((plan) => ({
    ...plan,
    count: tenants.filter(
      (t) =>
        t.subscription_plan_name === plan.name ||
        t.subscription_plan_id === plan.id
    ).length,
  }));

  const recentTenants = [...tenants]
    .sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    )
    .slice(0, 6);

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
        <Loader message="Loading SuperAdmin dashboard..." />
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: "1px solid var(--app-border)",
          background:
            "linear-gradient(135deg, var(--color-primary-soft), rgba(255,255,255,0.6))",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: "var(--color-primary)",
                color: "var(--color-primary-contrast)",
                width: 56,
                height: 56,
              }}
            >
              <FiActivity size={26} />
            </Avatar>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                SuperAdmin Portal
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "var(--color-primary)" }}>
                Control Center
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tenants, subscriptions, and platform-wide activity at a glance.
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Chip
              icon={<FiCheckCircle />}
              label={`${activeTenants} Active`}
              color="success"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              icon={<FiClock />}
              label={`${trialingTenants} Trialing`}
              color="info"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Stat tiles */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <StatCard
          icon={<FiUsers size={22} />}
          label="Total Tenants"
          value={totalTenants}
          accent="#6366f1"
          sub="All registered clients"
        />
        <StatCard
          icon={<FiCheckCircle size={22} />}
          label="Active Subscriptions"
          value={activeTenants}
          accent="#10b981"
          sub={`${trialingTenants} on trial`}
        />
        <StatCard
          icon={<FiAlertCircle size={22} />}
          label="Expiring Soon"
          value={expiringSoon.length}
          accent="#f59e0b"
          sub="Within 30 days"
        />
        <StatCard
          icon={<FiCreditCard size={22} />}
          label="Plans Available"
          value={plans.length}
          accent="#ec4899"
          sub={`${expired.length} expired tenants`}
        />
      </Box>

      {/* Two column section */}
      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
        }}
      >
        {/* Expiring tenants */}
        <Card
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
            sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: "rgba(245, 158, 11, 0.15)",
                  color: "#d97706",
                  width: 40,
                  height: 40,
                }}
              >
                <FiAlertCircle size={20} />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Expiring & Expired Subscriptions
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Plans ending in 30 days or already lapsed
                </Typography>
              </Box>
            </Stack>
            <Chip
              size="small"
              label={`${expiringSoon.length + expired.length} need attention`}
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          {expiringSoon.length === 0 && expired.length === 0 ? (
            <Box sx={{ py: 4, textAlign: "center", color: "text.disabled" }}>
              <FiCheckCircle size={32} style={{ opacity: 0.4 }} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                All subscriptions are healthy.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {[...expiringSoon, ...expired.slice(0, 5)].slice(0, 8).map((t) => {
                const days = daysUntil(t.subscription_end_date || t.next_billing_date);
                const isExpired = days !== null && days < 0;
                return (
                  <Box
                    key={`${t.id}-${t.schema_name}`}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: "1px solid var(--app-border)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      bgcolor: isExpired
                        ? "rgba(239, 68, 68, 0.05)"
                        : "rgba(245, 158, 11, 0.05)",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "var(--color-primary-border)",
                        color: "primary.main",
                        width: 38,
                        height: 38,
                        fontSize: "0.85rem",
                        fontWeight: 700,
                      }}
                    >
                      {t.name?.charAt(0)?.toUpperCase() || "?"}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {t.schema_name} • {t.subscription_plan_name || "No plan"}
                      </Typography>
                    </Box>
                    <Stack sx={{ alignItems: "flex-end", minWidth: 110 }}>
                      <Chip
                        size="small"
                        label={
                          isExpired
                            ? `Expired ${Math.abs(days)}d ago`
                            : days === 0
                              ? "Expires today"
                              : `${days}d left`
                        }
                        color={isExpired ? "error" : days <= 7 ? "warning" : "info"}
                        sx={{ fontWeight: 600 }}
                      />
                      <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                        {formatDate(t.subscription_end_date || t.next_billing_date)}
                      </Typography>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Card>

        {/* Plan distribution */}
        <Card
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid var(--app-border)",
            boxShadow: "var(--app-shadow)",
            bgcolor: "background.paper",
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: "rgba(99, 102, 241, 0.15)",
                color: "#4f46e5",
                width: 40,
                height: 40,
              }}
            >
              <FiTrendingUp size={20} />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Plan Distribution
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tenants per subscription plan
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          {planCounts.length === 0 ? (
            <Box sx={{ py: 4, textAlign: "center", color: "text.disabled" }}>
              <FiCreditCard size={28} style={{ opacity: 0.4 }} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                No plans configured yet.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {planCounts.map((plan) => {
                const ratio = totalTenants > 0 ? (plan.count / totalTenants) * 100 : 0;
                return (
                  <Box key={plan.id}>
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {plan.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {plan.count} tenant{plan.count !== 1 ? "s" : ""}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(ratio, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(15, 23, 42, 0.06)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          background:
                            "linear-gradient(90deg, var(--color-primary), color-mix(in srgb, var(--color-primary), white 40%))",
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          )}
        </Card>
      </Box>

      {/* Recent tenants */}
      <Card
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: "1px solid var(--app-border)",
          boxShadow: "var(--app-shadow)",
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: "rgba(16, 185, 129, 0.15)",
              color: "#059669",
              width: 40,
              height: 40,
            }}
          >
            <FiPackage size={20} />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Recent Tenants
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last clients added to the platform
            </Typography>
          </Box>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {recentTenants.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center", color: "text.disabled" }}>
            <FiUsers size={28} style={{ opacity: 0.4 }} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              No tenants yet.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
            }}
          >
            {recentTenants.map((t) => {
              const meta = statusMeta[t.subscription_status] || {
                color: "default",
                label: t.subscription_status || "Unknown",
              };
              return (
                <Box
                  key={`recent-${t.id}`}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid var(--app-border)",
                    bgcolor: "var(--color-primary-soft)",
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: "var(--color-primary)",
                        color: "var(--color-primary-contrast)",
                        width: 40,
                        height: 40,
                        fontSize: "0.95rem",
                        fontWeight: 700,
                      }}
                    >
                      {t.name?.charAt(0)?.toUpperCase() || "?"}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {t.contact_email || t.schema_name}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ alignItems: "center", justifyContent: "space-between" }}
                  >
                    <Chip
                      size="small"
                      label={meta.label}
                      color={meta.color}
                      sx={{ fontWeight: 600 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {t.subscription_plan_name || "No plan"}
                    </Typography>
                  </Stack>
                </Box>
              );
            })}
          </Box>
        )}
      </Card>
    </Stack>
  );
};

export default DashboardComponent;
