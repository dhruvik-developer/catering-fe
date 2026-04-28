/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { FiBriefcase, FiPlus } from "react-icons/fi";
import Loader from "../../../Components/common/Loader";
import AssignmentTable from "../../../Components/eventStaff/AssignmentTable";
import usePermissions from "../../../hooks/usePermissions";

function AssignmentComponent({
  loading,
  assignments,
  onAssignmentAdd,
  onAssignmentEdit,
  onAssignmentDelete,
}) {
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission("eventstaff.create");
  const canUpdate = hasPermission("eventstaff.update");
  const canDelete = hasPermission("eventstaff.delete");

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
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
            <FiBriefcase size={20} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Event Assignments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {assignments?.length || 0} event assignment
              {assignments?.length !== 1 ? "s" : ""} recorded
            </Typography>
          </Box>
        </Stack>
        {canCreate && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<FiPlus size={16} />}
            onClick={onAssignmentAdd}
          >
            Assign Staff
          </Button>
        )}
      </Stack>

      {loading ? (
        <Loader message="Loading assignments..." />
      ) : (
        <AssignmentTable
          assignments={assignments}
          onAssignmentEdit={onAssignmentEdit}
          onAssignmentDelete={onAssignmentDelete}
          canEdit={canUpdate}
          canDelete={canDelete}
        />
      )}
    </Paper>
  );
}

export default AssignmentComponent;
