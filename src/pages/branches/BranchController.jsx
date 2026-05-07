import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BranchComponent from "./BranchComponent";
import { useBranches } from "../../hooks/useBranches";
import { deleteBranch } from "../../api/branches";

function BranchController() {
  const navigate = useNavigate();
  const {
    data: branches = [],
    isLoading: loading,
    refetch,
  } = useBranches();

  const handleAdd = () => {
    navigate("/add-branch", { state: { mode: "add" } });
  };

  const handleEdit = (branch) => {
    navigate(`/edit-branch/${branch.id}`, {
      state: { mode: "edit", branchData: branch },
    });
  };

  const handleView = (branch) => {
    navigate(`/branches/${branch.id}`);
  };

  const handleDelete = async (branch) => {
    // Backend rejects deletion of the main branch and any branch that still
    // has users assigned. We surface those errors via the toast on the API
    // helper.
    if (branch.is_main) {
      toast.error("The main branch cannot be deleted.");
      return;
    }
    const confirmed = window.confirm(
      `Delete branch "${branch.name}"? This cannot be undone.`
    );
    if (!confirmed) return;
    const response = await deleteBranch(branch.id);
    if (response) refetch();
  };

  return (
    <BranchComponent
      loading={loading}
      branches={branches}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onView={handleView}
      onDelete={handleDelete}
    />
  );
}

export default BranchController;
