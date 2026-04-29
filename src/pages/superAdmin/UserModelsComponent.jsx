/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  Chip,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { FiUsers, FiSearch, FiShield } from "react-icons/fi";
import Loader from "../../Components/common/Loader";

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

const UserModelsComponent = ({ loading, tenants = [] }) => {
  const [search, setSearch] = useState("");
  const [tenantFilter, setTenantFilter] = useState("all");

  const allUsers = useMemo(() => {
    const rows = [];
    tenants.forEach((tenant) => {
      const users = Array.isArray(tenant.users)
        ? tenant.users
        : Array.isArray(tenant.user_models)
          ? tenant.user_models
          : [];

      if (users.length === 0) {
        rows.push({
          id: `placeholder-${tenant.id}`,
          tenantId: tenant.id,
          tenantName: tenant.name,
          tenantSchema: tenant.schema_name,
          username: tenant.contact_email || tenant.admin_email || "admin",
          email: tenant.contact_email,
          role: "Tenant Admin",
          is_active: tenant.subscription_status === "active",
          last_login: tenant.last_login_at,
          created_at: tenant.created_at,
          isAdminPlaceholder: true,
        });
      } else {
        users.forEach((user) => {
          rows.push({
            id: `${tenant.id}-${user.id}`,
            tenantId: tenant.id,
            tenantName: tenant.name,
            tenantSchema: tenant.schema_name,
            username: user.username || user.name,
            email: user.email,
            role: user.role || user.user_type || "Member",
            is_active: user.is_active !== false,
            last_login: user.last_login,
            created_at: user.date_joined || user.created_at,
          });
        });
      }
    });
    return rows;
  }, [tenants]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allUsers.filter((u) => {
      if (tenantFilter !== "all" && String(u.tenantId) !== String(tenantFilter)) {
        return false;
      }
      if (!term) return true;
      return (
        (u.username || "").toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        (u.tenantName || "").toLowerCase().includes(term)
      );
    });
  }, [allUsers, search, tenantFilter]);

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
        <Loader message="Loading users..." />
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
              <FiShield size={22} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                User Models
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredUsers.length} of {allUsers.length} users across {tenants.length} tenant{tenants.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <TextField
              size="small"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 220 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              size="small"
              value={tenantFilter}
              onChange={(e) => setTenantFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">All tenants</MenuItem>
              {tenants.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </Paper>

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid var(--app-border)",
          boxShadow: "var(--app-shadow)",
          overflow: "hidden",
        }}
      >
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tenant</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Last Login</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: "var(--color-primary)",
                          color: "var(--color-primary-contrast)",
                          width: 36,
                          height: 36,
                          fontSize: "0.85rem",
                          fontWeight: 700,
                        }}
                      >
                        {(user.username || "?").charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }} variant="body2">
                          {user.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email || "-"}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user.tenantName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.tenantSchema}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={user.role}
                      variant="outlined"
                      color={user.isAdminPlaceholder ? "primary" : "default"}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={user.is_active ? "Active" : "Inactive"}
                      color={user.is_active ? "success" : "default"}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.last_login)}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <FiUsers size={28} style={{ opacity: 0.4 }} />
                    <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                      No users match the current filter.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Stack>
  );
};

export default UserModelsComponent;
