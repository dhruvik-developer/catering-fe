/* eslint-disable react/prop-types */
import { Button, Paper } from "@mui/material";
import { FiGitBranch, FiPlus } from "react-icons/fi";
import Loader from "../../Components/common/Loader";
import PageHero from "../../Components/common/PageHero";
import BranchTable from "../../Components/branches/BranchTable";

function BranchComponent({
  loading,
  branches,
  onAdd,
  onEdit,
  onView,
  onDelete,
}) {
  const heroActionSx = {
    bgcolor: "rgba(255,255,255,0.18)",
    color: "var(--color-primary-contrast,white)",
    border: "1px solid rgba(255,255,255,0.35)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
  };

  return (
    <>
      <PageHero
        icon={<FiGitBranch size={24} />}
        eyebrow="Tenant"
        title="Branches"
        subtitle={`${branches?.length || 0} branch${
          branches?.length !== 1 ? "es" : ""
        } configured`}
        actions={
          <Button
            variant="contained"
            startIcon={<FiPlus size={15} />}
            onClick={onAdd}
            sx={heroActionSx}
          >
            Add Branch
          </Button>
        }
      />
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        {loading ? (
          <Loader message="Loading branches..." />
        ) : (
          <BranchTable
            branches={branches}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
          />
        )}
      </Paper>
    </>
  );
}

export default BranchComponent;
