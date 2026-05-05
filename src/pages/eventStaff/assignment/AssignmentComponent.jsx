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
import PageHero from "../../../Components/common/PageHero";
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

  const heroActionSx = {
    bgcolor: "rgba(255,255,255,0.18)",
    color: "var(--color-primary-contrast,white)",
    border: "1px solid rgba(255,255,255,0.35)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
  };

  return (
    <>
      <PageHero
        icon={<FiBriefcase size={24} />}
        eyebrow="Operations"
        title="Event Assignments"
        subtitle={`${assignments?.length || 0} event assignment${assignments?.length !== 1 ? "s" : ""} recorded`}
        actions={
          canCreate ? (
            <Button
              variant="contained"
              startIcon={<FiPlus size={16} />}
              onClick={onAssignmentAdd}
              sx={heroActionSx}
            >
              Assign Staff
            </Button>
          ) : null
        }
      />
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
      >
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
    </>
  );
}

export default AssignmentComponent;
