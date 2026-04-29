import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FiEdit, FiUploadCloud, FiPlusCircle } from "react-icons/fi";

const TenantsComponent = ({
  loading,
  tenants,
  onAddTenant,
  onEditTenant,
  onProvisionTenant,
}) => {
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
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--color-primary)" }}>
          Tenants Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<FiPlusCircle size={20} />}
          onClick={onAddTenant}
          sx={{
            borderRadius: "12px",
            background: "var(--color-primary)",
            textTransform: "none",
            px: 3,
            py: 1,
            "&:hover": {
              background: "var(--color-primary-dark)",
            },
          }}
        >
          Add Tenant
        </Button>
      </Box>

      <Card sx={{ borderRadius: "16px", boxShadow: "var(--app-shadow-strong)", overflow: "hidden" }}>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Schema</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
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
                  <TableCell>
                    <Chip
                      label={tenant.schema_status || "Pending"}
                      size="small"
                      variant="outlined"
                      color={tenant.schema_status === "ready" ? "success" : "warning"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => onEditTenant(tenant.id)} size="small" color="primary">
                      <FiEdit size={18} />
                    </IconButton>
                    <IconButton
                      onClick={() => onProvisionTenant(tenant.id)}
                      size="small"
                      color="secondary"
                      disabled={tenant.schema_status === "ready"}
                    >
                      <FiUploadCloud size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {tenants.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
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
