/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Loader from "../../../Components/common/Loader";
import StaffTable from "../../../Components/eventStaff/StaffTable";
import { FiUsers, FiUserPlus } from "react-icons/fi";
import usePermissions from "../../../hooks/usePermissions";

function StaffComponent({
  loading,
  staffList,
  onStaffAdd,
  onStaffEdit,
  onStaffDelete,
  onStaffPaymentSummary,
}) {
  const { hasPermission } = usePermissions();
  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: "var(--color-primary-border)",
              color: "primary.main",
              width: 44,
              height: 44,
            }}
          >
            <FiUsers size={20} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Event Staff
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {staffList?.length || 0} staff member
              {staffList?.length !== 1 ? "s" : ""} registered
            </Typography>
          </Box>
        </Stack>
        {hasPermission("eventstaff.create") && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<FiUserPlus size={15} />}
            onClick={onStaffAdd}
          >
            Add Staff
          </Button>
        )}
      </Stack>

      {loading ? (
        <Loader message="Loading staff..." />
      ) : (
        <StaffTable
          staffList={staffList}
          onStaffEdit={onStaffEdit}
          onStaffDelete={onStaffDelete}
          onStaffPaymentSummary={onStaffPaymentSummary}
        />
      )}
    </Paper>
  );
}

export default StaffComponent;
