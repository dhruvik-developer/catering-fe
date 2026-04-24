/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Card,
  CardContent,
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
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { FaTrash, FaWallet } from "react-icons/fa";
import { FiEdit2, FiUsers } from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";
import EmptyState from "../common/EmptyState";

function StatusBadge({ active }) {
  return (
    <Chip
      size="small"
      label={active ? "Active" : "Inactive"}
      color={active ? "success" : "error"}
      variant="outlined"
      sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}
    />
  );
}

function FinancialLine({ label, amount, suffix, tone = "neutral" }) {
  const isPrimary = tone === "primary";
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        px: 1.5,
        py: 0.75,
        borderRadius: 1.5,
        border: 1,
        borderColor: isPrimary ? "primary.light" : "divider",
        bgcolor: isPrimary
          ? (t) => t.palette.primary.light + "1f"
          : "action.hover",
      }}
    >
      <Typography
        variant="caption"
        fontWeight={500}
        color={isPrimary ? "primary.main" : "text.secondary"}
      >
        {label}
      </Typography>
      <Typography
        variant="caption"
        fontWeight={700}
        color={isPrimary ? "primary.dark" : "text.primary"}
      >
        ₹{amount.toFixed(2)}
        {suffix && (
          <Box
            component="span"
            sx={{ fontWeight: 400, opacity: 0.6, fontSize: "0.65rem" }}
          >
            {suffix}
          </Box>
        )}
      </Typography>
    </Stack>
  );
}

function Financials({ staff, compact = false }) {
  const perPerson = parseFloat(staff.per_person_rate) || 0;
  const fixed = parseFloat(staff.fixed_salary) || 0;
  const contract = parseFloat(staff.contract_rate) || 0;
  const hasFixed = staff.staff_type === "Fixed" && fixed > 0;
  const hasContract = staff.staff_type === "Contract" && contract > 0;
  const hasAny = perPerson > 0 || hasFixed || hasContract;

  if (!hasAny) {
    return (
      <Typography
        variant="caption"
        color="text.disabled"
        fontStyle="italic"
        fontWeight={500}
      >
        No financials
      </Typography>
    );
  }

  return (
    <Stack spacing={1} sx={{ width: compact ? "100%" : 150 }}>
      {perPerson > 0 && <FinancialLine label="Per Day" amount={perPerson} />}
      {hasFixed && (
        <FinancialLine label="Fixed" amount={fixed} suffix="/mo" tone="primary" />
      )}
      {hasContract && (
        <FinancialLine label="Contract" amount={contract} tone="primary" />
      )}
    </Stack>
  );
}

function RoleAndTypeChips({ staff, waiterType }) {
  return (
    <Stack spacing={1} alignItems="flex-start">
      <Typography
        variant="body2"
        fontWeight={700}
        color="primary.main"
        sx={{ wordBreak: "break-word" }}
      >
        {staff.role_name || staff.role || "N/A"}
      </Typography>
      {waiterType && (
        <Chip
          size="small"
          label={`Waiter: ${waiterType}`}
          variant="outlined"
          sx={{ height: 20, fontSize: "0.65rem", textTransform: "uppercase" }}
        />
      )}
      <Chip
        size="small"
        label={`${staff.staff_type}${staff.agency_name ? ` • ${staff.agency_name}` : ""}`}
        color="primary"
        variant="outlined"
        sx={{
          fontWeight: 700,
          fontSize: "0.65rem",
          textTransform: "uppercase",
        }}
      />
    </Stack>
  );
}

function StaffTable({
  staffList,
  onStaffEdit,
  onStaffDelete,
  onStaffPaymentSummary,
}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission("eventstaff.update");
  const canDelete = hasPermission("eventstaff.delete");

  if (!staffList || staffList.length === 0) {
    return (
      <EmptyState
        icon={<FiUsers size={24} />}
        title="No Staff Available"
        message='Use the "Add Staff" button to register new staff members and they will appear here.'
      />
    );
  }

  const renderActions = (staff) => (
    <Stack direction="row" spacing={0.5} justifyContent="center">
      {staff.staff_type === "Fixed" && onStaffPaymentSummary && (
        <IconButton
          size="small"
          onClick={() => onStaffPaymentSummary(staff.id)}
          title="Salary Payments"
          color="primary"
        >
          <FaWallet size={14} />
        </IconButton>
      )}
      {canEdit && (
        <IconButton
          size="small"
          onClick={() => onStaffEdit(staff)}
          title="Edit Staff"
        >
          <FiEdit2 size={15} />
        </IconButton>
      )}
      {canDelete && (
        <IconButton
          size="small"
          color="error"
          onClick={() => onStaffDelete(staff.id)}
          title="Delete Staff"
        >
          <FaTrash size={14} />
        </IconButton>
      )}
    </Stack>
  );

  if (!isDesktop) {
    return (
      <Grid container spacing={1.5}>
        {staffList.map((staff, index) => {
          const waiterType =
            staff.waiter_type_name ||
            (staff.waiter_type && staff.waiter_type.name);
          return (
            <Grid key={staff.id} size={12}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {staff.name?.charAt(0).toUpperCase() || "?"}
                    </Avatar>
                    <Box minWidth={0} flex={1}>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography variant="caption" color="text.disabled">
                          #{(index + 1).toString().padStart(2, "0")}
                        </Typography>
                        <StatusBadge active={staff.is_active} />
                      </Stack>
                      <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {staff.name || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {staff.phone || "-"}
                      </Typography>
                    </Box>
                    {renderActions(staff)}
                  </Stack>
                  <Box sx={{ mt: 1.5 }}>
                    <RoleAndTypeChips staff={staff} waiterType={waiterType} />
                  </Box>
                  <Box sx={{ mt: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontWeight: 700,
                      }}
                    >
                      Financials
                    </Typography>
                    <Box sx={{ mt: 0.75 }}>
                      <Financials staff={staff} compact />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: (t) => t.palette.primary.light + "1a" }}>
            <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Role &amp; Type</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Financials</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staffList.map((staff, index) => {
            const waiterType =
              staff.waiter_type_name ||
              (staff.waiter_type && staff.waiter_type.name);
            return (
              <TableRow
                key={staff.id}
                hover
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                  {(index + 1).toString().padStart(2, "0")}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {staff.name?.charAt(0).toUpperCase() || "?"}
                    </Avatar>
                    <Typography variant="body1" fontWeight={700}>
                      {staff.name || "N/A"}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  {staff.phone || "-"}
                </TableCell>
                <TableCell>
                  <RoleAndTypeChips staff={staff} waiterType={waiterType} />
                </TableCell>
                <TableCell>
                  <Financials staff={staff} />
                </TableCell>
                <TableCell align="center">
                  <StatusBadge active={staff.is_active} />
                </TableCell>
                <TableCell align="center">{renderActions(staff)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StaffTable;
