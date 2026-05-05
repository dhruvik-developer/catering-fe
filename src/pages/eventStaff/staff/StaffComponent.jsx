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
import PageHero from "../../../Components/common/PageHero";
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
  const heroActionSx = {
    bgcolor: "rgba(255,255,255,0.18)",
    color: "var(--color-primary-contrast,white)",
    border: "1px solid rgba(255,255,255,0.35)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
  };

  return (
    <>
      <PageHero
        icon={<FiUsers size={24} />}
        eyebrow="Event team"
        title="Event Staff"
        subtitle={`${staffList?.length || 0} staff member${staffList?.length !== 1 ? "s" : ""} registered`}
        actions={
          hasPermission("eventstaff.create") ? (
            <Button
              variant="contained"
              startIcon={<FiUserPlus size={15} />}
              onClick={onStaffAdd}
              sx={heroActionSx}
            >
              Add Staff
            </Button>
          ) : null
        }
      />
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
      >
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
    </>
  );
}

export default StaffComponent;
