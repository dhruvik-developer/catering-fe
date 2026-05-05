/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiUser,
  FiCreditCard,
  FiPackage,
  FiKey,
  FiGlobe,
} from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SectionCard = ({ icon, title, subtitle, children }) => (
  <Card
    sx={{
      p: { xs: 2, sm: 2.5 },
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
          bgcolor: "var(--color-primary-soft)",
          color: "primary.main",
          width: 40,
          height: 40,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Box>
    </Stack>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Card>
);

const STATUS_OPTIONS = [
  { value: "trialing", label: "Trialing" },
  { value: "active", label: "Active" },
  { value: "past_due", label: "Past due" },
  { value: "suspended", label: "Suspended" },
  { value: "cancelled", label: "Cancelled" },
];

function AddEditTenantComponent({
  isEdit,
  form,
  errors,
  plans = [],
  modules = [],
  selectedPlan,
  saving,
  onChange,
  onDomainChange,
  onAddDomain,
  onRemoveDomain,
  onCancel,
  onSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const moduleNameByKey = modules.reduce((acc, module) => {
    const key = module.key || module.code || module.name;
    if (key) acc[key] = module.name || key;
    return acc;
  }, {});

  const planModules = (() => {
    if (!selectedPlan) return [];
    const raw = Array.isArray(selectedPlan.modules)
      ? selectedPlan.modules
      : Array.isArray(selectedPlan.enabled_modules)
        ? selectedPlan.enabled_modules
        : Array.isArray(selectedPlan.features)
          ? selectedPlan.features
          : [];
    return raw.map((m) =>
      typeof m === "string" ? m : m.key || m.code || m.name
    );
  })();

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: "1px solid var(--app-border)",
          mb: 2.5,
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
            <Button
              variant="outlined"
              startIcon={<FiArrowLeft size={16} />}
              onClick={onCancel}
            >
              Back
            </Button>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {isEdit ? "Edit Tenant" : "Add Tenant"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isEdit
                  ? "Update tenant details, subscription, and admin credentials."
                  : "Provision a new client schema and configure its subscription."}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={onCancel} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<FiCheck size={16} />}
              disabled={saving}
            >
              {saving ? "Saving..." : isEdit ? "Update Tenant" : "Save Tenant"}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Stack spacing={2.5}>
        {/* Tenant section */}
        <SectionCard
          icon={<FiUser size={18} />}
          title="Tenant"
          subtitle="Basic identification and contact info"
        >
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            }}
          >
            <TextField
              fullWidth
              required
              label="Name"
              name="name"
              value={form.name}
              onChange={onChange}
              error={!!errors.name}
              helperText={errors.name || ""}
            />
            <TextField
              fullWidth
              required
              label="Schema name"
              name="schema_name"
              value={form.schema_name}
              onChange={onChange}
              error={!!errors.schema_name}
              helperText={
                errors.schema_name ||
                "Lowercase letters, digits & underscores only"
              }
              disabled={isEdit}
            />
            <TextField
              fullWidth
              label="Contact name"
              name="contact_name"
              value={form.contact_name}
              onChange={onChange}
            />
            <TextField
              fullWidth
              label="Contact email"
              name="contact_email"
              value={form.contact_email}
              onChange={onChange}
              error={!!errors.contact_email}
              helperText={errors.contact_email || ""}
            />
            <TextField
              fullWidth
              label="Contact phone"
              name="contact_phone"
              value={form.contact_phone}
              onChange={onChange}
              sx={{ gridColumn: { sm: "span 2" } }}
            />
          </Box>
        </SectionCard>

        {/* Subscription */}
        <SectionCard
          icon={<FiCreditCard size={18} />}
          title="Subscription"
          subtitle="Plan, status, and billing window"
        >
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            }}
          >
            <TextField
              select
              fullWidth
              label="Subscription plan"
              name="subscription_plan"
              value={form.subscription_plan || ""}
              onChange={onChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {plans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Subscription status"
              name="subscription_status"
              value={form.subscription_status}
              onChange={onChange}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              fullWidth
              label="Subscription start date"
              name="subscription_start_date"
              value={form.subscription_start_date || ""}
              onChange={onChange}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              type="date"
              fullWidth
              label="Subscription end date"
              name="subscription_end_date"
              value={form.subscription_end_date || ""}
              onChange={onChange}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </SectionCard>

        {/* Modules — driven by the selected plan */}
        <SectionCard
          icon={<FiPackage size={18} />}
          title="Modules included"
          subtitle="Inherited from the subscription plan above. To change them, edit the plan."
        >
          {!selectedPlan ? (
            <Typography variant="body2" color="text.secondary">
              Pick a subscription plan to see the modules this tenant will get.
            </Typography>
          ) : planModules.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {`The "${selectedPlan.name}" plan has no modules configured yet. Open it under Subscription Plans to add some.`}
            </Typography>
          ) : (
            <Stack
              direction="row"
              spacing={0.75}
              sx={{ flexWrap: "wrap", gap: 0.75 }}
            >
              {planModules.map((moduleKey) => (
                <Chip
                  key={moduleKey}
                  size="small"
                  label={moduleNameByKey[moduleKey] || moduleKey}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              ))}
            </Stack>
          )}
        </SectionCard>

        {/* Tenant Admin Login */}
        <SectionCard
          icon={<FiKey size={18} />}
          title="Create Tenant Admin Login"
          subtitle="Optional. Creates the first login user inside this tenant schema."
        >
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            }}
          >
            <TextField
              fullWidth
              label="Admin Username"
              name="admin_username"
              value={form.admin_username}
              onChange={onChange}
              autoComplete="off"
              disabled={isEdit}
            />
            <TextField
              fullWidth
              label="Admin Email"
              name="admin_email"
              value={form.admin_email}
              onChange={onChange}
              autoComplete="off"
              disabled={isEdit}
            />
            <TextField
              fullWidth
              label="Admin Password"
              name="admin_password"
              type={showPassword ? "text" : "password"}
              value={form.admin_password}
              onChange={onChange}
              autoComplete="new-password"
              disabled={isEdit}
              error={!!errors.admin_password}
              helperText={
                errors.admin_password ||
                (isEdit
                  ? "Use the operations portal to reset tenant passwords"
                  : "")
              }
              sx={{ gridColumn: { sm: "span 2" } }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={() => setShowPassword((s) => !s)}
                        disabled={isEdit}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </SectionCard>

        {/* Domains */}
        <SectionCard
          icon={<FiGlobe size={18} />}
          title="Domains"
          subtitle="Map one or more hostnames to this tenant. If blank, the schema name becomes the primary domain."
        >
          {errors.domains ? (
            <Typography
              variant="body2"
              color="error"
              sx={{ mb: 1.5, fontWeight: 600 }}
            >
              {errors.domains}
            </Typography>
          ) : null}
          <Stack spacing={1.5}>
            {(form.domains || []).map((domain, idx) => (
              <Stack
                key={idx}
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  alignItems: { xs: "stretch", sm: "center" },
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid var(--app-border)",
                  bgcolor: "var(--color-primary-soft)",
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="e.g. acme.example.com"
                  value={domain.domain}
                  onChange={(e) =>
                    onDomainChange(idx, "domain", e.target.value)
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!domain.is_primary}
                      onChange={(e) =>
                        onDomainChange(idx, "is_primary", e.target.checked)
                      }
                      size="small"
                    />
                  }
                  label="Primary"
                  sx={{ minWidth: 100 }}
                />
                <IconButton
                  color="error"
                  onClick={() => onRemoveDomain(idx)}
                  size="small"
                  disabled={(form.domains || []).length <= 1}
                >
                  <FiTrash2 />
                </IconButton>
              </Stack>
            ))}
            <Button
              variant="text"
              startIcon={<FiPlus />}
              onClick={onAddDomain}
              sx={{ alignSelf: "flex-start" }}
            >
              Add another domain
            </Button>
          </Stack>
        </SectionCard>
      </Stack>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{ mt: 3, justifyContent: "flex-end" }}
      >
        <Button variant="outlined" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={<FiCheck size={16} />}
          disabled={saving}
        >
          {saving ? "Saving..." : isEdit ? "Update Tenant" : "Save Tenant"}
        </Button>
      </Stack>
    </Box>
  );
}

export default AddEditTenantComponent;
