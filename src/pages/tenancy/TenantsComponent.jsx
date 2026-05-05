/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  FiEdit,
  FiUploadCloud,
  FiPlusCircle,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import PageHero from "../../Components/common/PageHero";

const formatDate = (value) => {
  if (!value) return null;
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

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "success";
    case "trialing":
      return "info";
    case "past_due":
      return "warning";
    case "suspended":
    case "cancelled":
    case "expired":
      return "error";
    default:
      return "default";
  }
};

const renderExpiry = (tenant) => {
  const endDate = tenant.subscription_end_date || tenant.next_billing_date;
  if (!endDate) {
    return (
      <Typography variant="caption" color="text.disabled">
        —
      </Typography>
    );
  }

  const days = daysUntil(endDate);
  const formatted = formatDate(endDate);
  let label = formatted;
  let color = "default";

  if (days !== null) {
    if (days < 0) {
      label = `Expired ${Math.abs(days)}d ago`;
      color = "error";
    } else if (days === 0) {
      label = "Expires today";
      color = "error";
    } else if (days <= 7) {
      label = `${days}d left`;
      color = "warning";
    } else if (days <= 30) {
      label = `${days}d left`;
      color = "info";
    }
  }

  return (
    <Stack spacing={0.25}>
      <Chip
        size="small"
        label={label}
        color={color}
        variant={color === "default" ? "outlined" : "filled"}
        sx={{ fontWeight: 600, alignSelf: "flex-start" }}
      />
      {color !== "default" ? (
        <Typography variant="caption" color="text.disabled">
          {formatted}
        </Typography>
      ) : null}
    </Stack>
  );
};

const TenantsComponent = ({
  loading,
  tenants,
  onAddTenant,
  onEditTenant,
  onProvisionTenant,
  onDeleteTenant,
}) => {
  return (
    <Box sx={{ p: 3 }}>
      <PageHero
        icon={<FiUsers size={24} />}
        eyebrow="Platform"
        title="Tenants Management"
        subtitle={`${tenants.length} tenant${tenants.length !== 1 ? "s" : ""} provisioned`}
        actions={
          <Button
            variant="contained"
            startIcon={<FiPlusCircle size={20} />}
            onClick={onAddTenant}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              px: 3,
              py: 1,
              bgcolor: "rgba(255,255,255,0.18)",
              color: "var(--color-primary-contrast,white)",
              border: "1px solid rgba(255,255,255,0.35)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
            }}
          >
            Add Tenant
          </Button>
        }
      />

      <Card sx={{ borderRadius: "16px", boxShadow: "var(--app-shadow-strong)", overflow: "hidden" }}>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Schema</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Expiry</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Provisioning</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>{tenant.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {tenant.contact_email}
                    </Typography>
                  </TableCell>
                  <TableCell>{tenant.schema_name}</TableCell>
                  <TableCell>{tenant.subscription_plan_name || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={tenant.subscription_status}
                      size="small"
                      color={getStatusColor(tenant.subscription_status)}
                      sx={{ borderRadius: "8px", fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>{renderExpiry(tenant)}</TableCell>
                  <TableCell>
                    <Chip
                      label={tenant.schema_status || "Pending"}
                      size="small"
                      variant="outlined"
                      color={tenant.schema_status === "ready" ? "success" : "warning"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit tenant">
                      <IconButton onClick={() => onEditTenant(tenant.id)} size="small" color="primary">
                        <FiEdit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        tenant.schema_status === "ready"
                          ? "Already provisioned"
                          : "Provision tenant schema"
                      }
                    >
                      <span>
                        <IconButton
                          onClick={() => onProvisionTenant(tenant.id)}
                          size="small"
                          color="secondary"
                          disabled={tenant.schema_status === "ready"}
                        >
                          <FiUploadCloud size={18} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    {onDeleteTenant ? (
                      <Tooltip title="Delete tenant">
                        <IconButton
                          onClick={() => onDeleteTenant(tenant)}
                          size="small"
                          sx={{ color: "error.main" }}
                        >
                          <FiTrash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
              {tenants.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    No tenants found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default TenantsComponent;
