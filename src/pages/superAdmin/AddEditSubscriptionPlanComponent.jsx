/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  FiArrowLeft,
  FiCheck,
  FiCreditCard,
  FiPackage,
  FiZap,
} from "react-icons/fi";

const BILLING_CYCLES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
  { value: "lifetime", label: "Lifetime" },
];

function AddEditSubscriptionPlanComponent({
  isEdit,
  form,
  errors,
  saving,
  modules = [],
  onChange,
  onToggleActive,
  onModuleToggle,
  onSelectAllModules,
  onClearModules,
  onCancel,
  onSubmit,
}) {
  const selectedModules = form.modules || [];
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
                {isEdit ? "Edit Subscription Plan" : "Add Subscription Plan"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Define what tenants get and how often they pay for it.
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
              {saving ? "Saving..." : isEdit ? "Update Plan" : "Save Plan"}
            </Button>
          </Stack>
        </Stack>
      </Paper>

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
            <FiCreditCard size={18} />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Plan details
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Identification, pricing, and limits
            </Typography>
          </Box>
        </Stack>
        <Divider sx={{ mb: 2 }} />

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
            label="Code"
            name="code"
            value={form.code}
            onChange={onChange}
            error={!!errors.code}
            helperText={
              errors.code || "Lowercase identifier (e.g. starter, pro)"
            }
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Description"
            name="description"
            value={form.description}
            onChange={onChange}
            sx={{ gridColumn: { sm: "span 2" } }}
          />
          <TextField
            fullWidth
            required
            type="number"
            label="Price"
            name="price"
            value={form.price}
            onChange={onChange}
            error={!!errors.price}
            helperText={errors.price || ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
              inputProps: { min: 0, step: "0.01" },
            }}
          />
          <TextField
            select
            fullWidth
            required
            label="Billing cycle"
            name="billing_cycle"
            value={form.billing_cycle}
            onChange={onChange}
          >
            {BILLING_CYCLES.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="number"
            label="Max users"
            name="max_users"
            value={form.max_users}
            onChange={onChange}
            helperText="0 means unlimited users"
            InputProps={{ inputProps: { min: 0, step: 1 } }}
          />
          <TextField
            fullWidth
            type="number"
            label="Trial days"
            name="trial_days"
            value={form.trial_days}
            onChange={onChange}
            helperText="0 disables the free trial"
            InputProps={{ inputProps: { min: 0, step: 1 } }}
          />
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: form.is_active
                  ? "rgba(16, 185, 129, 0.15)"
                  : "rgba(148, 163, 184, 0.15)",
                color: form.is_active ? "#059669" : "#475569",
                width: 36,
                height: 36,
              }}
            >
              <FiZap size={16} />
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {form.is_active ? "Plan is active" : "Plan is inactive"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Inactive plans cannot be assigned to new tenants.
              </Typography>
            </Box>
          </Stack>
          <FormControlLabel
            control={
              <Switch
                checked={!!form.is_active}
                onChange={onToggleActive}
                color="primary"
              />
            }
            label={form.is_active ? "Active" : "Inactive"}
            labelPlacement="start"
            sx={{ ml: 0 }}
          />
        </Stack>
      </Card>

      {/* Modules included in this plan */}
      <Card
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 3,
          border: "1px solid var(--app-border)",
          boxShadow: "var(--app-shadow)",
          bgcolor: "background.paper",
          mt: 2.5,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: "var(--color-primary-soft)",
                color: "primary.main",
                width: 40,
                height: 40,
              }}
            >
              <FiPackage size={18} />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Included modules
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tenants on this plan automatically inherit these modules.
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={onSelectAllModules}
              disabled={modules.length === 0}
            >
              Select all
            </Button>
            <Button
              size="small"
              variant="text"
              color="inherit"
              onClick={onClearModules}
              disabled={selectedModules.length === 0}
            >
              Clear
            </Button>
          </Stack>
        </Stack>

        {errors.modules ? (
          <Typography
            variant="body2"
            color="error"
            sx={{ mb: 1.5, fontWeight: 600 }}
          >
            {errors.modules}
          </Typography>
        ) : null}

        {modules.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No permission modules available yet. Configure them in Access Control first.
          </Typography>
        ) : (
          <>
            <Stack
              direction="row"
              spacing={0.75}
              sx={{ flexWrap: "wrap", gap: 0.75, mb: 2 }}
            >
              {selectedModules.length === 0 ? (
                <Typography variant="caption" color="text.disabled">
                  No modules selected
                </Typography>
              ) : (
                selectedModules.map((moduleKey) => {
                  const moduleObj = modules.find(
                    (m) => (m.key || m.code || m.name) === moduleKey
                  );
                  return (
                    <Chip
                      key={moduleKey}
                      size="small"
                      label={moduleObj?.name || moduleKey}
                      onDelete={() => onModuleToggle(moduleKey)}
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    />
                  );
                })
              )}
            </Stack>
            <Divider sx={{ mb: 1.5 }} />
            <Box
              sx={{
                display: "grid",
                gap: 0.5,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                maxHeight: 280,
                overflowY: "auto",
                pr: 1,
              }}
            >
              {modules.map((module) => {
                const key = module.key || module.code || module.name;
                const checked = selectedModules.includes(key);
                return (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={() => onModuleToggle(key)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {module.name || key}
                      </Typography>
                    }
                  />
                );
              })}
            </Box>
          </>
        )}
      </Card>

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
          {saving ? "Saving..." : isEdit ? "Update Plan" : "Save Plan"}
        </Button>
      </Stack>
    </Box>
  );
}

export default AddEditSubscriptionPlanComponent;
