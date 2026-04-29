/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  FiCreditCard,
  FiCheck,
  FiPackage,
  FiPlusCircle,
  FiUsers,
  FiZap,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import Loader from "../../Components/common/Loader";

const formatPrice = (plan) => {
  const amount = plan.price ?? plan.amount ?? plan.monthly_price;
  const currency = plan.currency || "INR";
  if (amount === undefined || amount === null) return "-";
  const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${Number(amount).toLocaleString()}`;
};

const SubscriptionPlansComponent = ({
  loading,
  plans = [],
  tenants = [],
  modules = [],
  onAdd,
  onEdit,
  onDelete,
}) => {
  const moduleNameByKey = modules.reduce((acc, module) => {
    const key = module.key || module.code || module.name;
    if (key) acc[key] = module.name || key;
    return acc;
  }, {});

  const renderFeatureLabel = (feature) => {
    if (typeof feature === "string") {
      return moduleNameByKey[feature] || feature;
    }
    return (
      feature?.name ||
      feature?.label ||
      moduleNameByKey[feature?.key || feature?.code || feature?.module] ||
      feature?.module ||
      "—"
    );
  };

  const planUsage = (plan) =>
    tenants.filter(
      (t) =>
        t.subscription_plan_id === plan.id ||
        t.subscription_plan_name === plan.name
    ).length;

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
        <Loader message="Loading subscription plans..." />
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: "1px solid var(--app-border)",
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
                bgcolor: "var(--color-primary-border)",
                color: "primary.main",
                width: 48,
                height: 48,
              }}
            >
              <FiCreditCard size={22} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                Subscription Plans
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {plans.length} plan{plans.length !== 1 ? "s" : ""} configured for tenants
              </Typography>
            </Box>
          </Stack>
          {onAdd ? (
            <Button
              variant="contained"
              startIcon={<FiPlusCircle size={18} />}
              onClick={onAdd}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 2.5,
                fontWeight: 600,
              }}
            >
              Add Plan
            </Button>
          ) : null}
        </Stack>
      </Paper>

      {plans.length === 0 ? (
        <Card
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid var(--app-border)",
            boxShadow: "var(--app-shadow)",
          }}
        >
          <FiPackage size={36} style={{ opacity: 0.4 }} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
            No subscription plans configured
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first plan to make it assignable to tenants.
          </Typography>
          {onAdd ? (
            <Button
              variant="contained"
              startIcon={<FiPlusCircle size={18} />}
              onClick={onAdd}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Add your first plan
            </Button>
          ) : null}
        </Card>
      ) : (
        <>
          {/* Plan cards */}
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
            {plans.map((plan) => {
              const usage = planUsage(plan);
              const features = Array.isArray(plan.modules) && plan.modules.length > 0
                ? plan.modules
                : Array.isArray(plan.features)
                  ? plan.features
                  : Array.isArray(plan.enabled_modules)
                    ? plan.enabled_modules
                    : [];
              return (
                <Card
                  key={plan.id}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px solid var(--app-border)",
                    boxShadow: "var(--app-shadow)",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, var(--color-primary-soft) 0%, transparent 60%)",
                      opacity: 0.6,
                      pointerEvents: "none",
                    }}
                  />
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      position: "relative",
                    }}
                  >
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: "var(--color-primary)",
                          color: "var(--color-primary-contrast)",
                          width: 42,
                          height: 42,
                        }}
                      >
                        <FiZap size={18} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {plan.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {plan.billing_cycle || plan.interval || "Monthly"}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                      <Chip
                        size="small"
                        label={plan.is_active === false ? "Inactive" : "Active"}
                        color={plan.is_active === false ? "default" : "success"}
                        sx={{ fontWeight: 600 }}
                      />
                      {onEdit ? (
                        <IconButton
                          size="small"
                          onClick={() => onEdit(plan.id)}
                          sx={{ color: "primary.main" }}
                          aria-label="Edit plan"
                        >
                          <FiEdit2 size={16} />
                        </IconButton>
                      ) : null}
                      {onDelete ? (
                        <IconButton
                          size="small"
                          onClick={() => onDelete(plan)}
                          sx={{ color: "error.main" }}
                          aria-label="Delete plan"
                        >
                          <FiTrash2 size={16} />
                        </IconButton>
                      ) : null}
                    </Stack>
                  </Stack>

                  <Box sx={{ position: "relative" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, color: "var(--color-primary)" }}
                    >
                      {formatPrice(plan)}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 0.5, fontWeight: 500 }}
                      >
                        / {plan.billing_cycle === "yearly" || plan.interval === "year"
                          ? "yr"
                          : "mo"}
                      </Typography>
                    </Typography>
                    {plan.description ? (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {plan.description}
                      </Typography>
                    ) : null}
                  </Box>

                  <Divider sx={{ position: "relative" }} />

                  <Stack spacing={0.75} sx={{ position: "relative" }}>
                    {features.length === 0 ? (
                      <Typography variant="caption" color="text.disabled">
                        No modules included yet
                      </Typography>
                    ) : (
                      <>
                        {features.slice(0, 6).map((feature, idx) => (
                          <Stack
                            key={idx}
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                          >
                            <FiCheck size={14} color="#10b981" />
                            <Typography variant="body2" color="text.secondary">
                              {renderFeatureLabel(feature)}
                            </Typography>
                          </Stack>
                        ))}
                        {features.length > 6 ? (
                          <Typography variant="caption" color="text.disabled">
                            + {features.length - 6} more
                          </Typography>
                        ) : null}
                      </>
                    )}
                  </Stack>

                  <Box
                    sx={{
                      mt: "auto",
                      pt: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      position: "relative",
                    }}
                  >
                    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                      <FiUsers size={14} />
                      <Typography variant="caption" color="text.secondary">
                        {usage} tenant{usage !== 1 ? "s" : ""}
                      </Typography>
                    </Stack>
                    {plan.trial_days ? (
                      <Chip
                        size="small"
                        label={`${plan.trial_days}d trial`}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    ) : null}
                  </Box>
                </Card>
              );
            })}
          </Box>

          {/* Summary table */}
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid var(--app-border)",
              boxShadow: "var(--app-shadow)",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2, bgcolor: "var(--color-primary-soft)" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Plan adoption summary
              </Typography>
            </Box>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Plan</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Cycle</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Tenants
                    </TableCell>
                    {(onEdit || onDelete) ? (
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Actions
                      </TableCell>
                    ) : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={`row-${plan.id}`} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{plan.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {plan.description || plan.code || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{formatPrice(plan)}</TableCell>
                      <TableCell>{plan.billing_cycle || plan.interval || "monthly"}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={plan.is_active === false ? "Inactive" : "Active"}
                          color={plan.is_active === false ? "default" : "success"}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {planUsage(plan)}
                      </TableCell>
                      {(onEdit || onDelete) ? (
                        <TableCell align="right">
                          {onEdit ? (
                            <IconButton
                              size="small"
                              onClick={() => onEdit(plan.id)}
                              sx={{ color: "primary.main" }}
                              aria-label="Edit plan"
                            >
                              <FiEdit2 size={16} />
                            </IconButton>
                          ) : null}
                          {onDelete ? (
                            <IconButton
                              size="small"
                              onClick={() => onDelete(plan)}
                              sx={{ color: "error.main" }}
                              aria-label="Delete plan"
                            >
                              <FiTrash2 size={16} />
                            </IconButton>
                          ) : null}
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}
    </Stack>
  );
};

export default SubscriptionPlansComponent;
