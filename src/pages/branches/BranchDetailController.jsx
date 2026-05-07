import { useNavigate, useParams } from "react-router-dom";
import BranchDetailComponent from "./BranchDetailComponent";
import { useBranchById, useBranchUsers } from "../../hooks/useBranches";

function BranchDetailController() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: branch, isLoading: branchLoading } = useBranchById(id);
  const { data: users = [], isLoading: usersLoading } = useBranchUsers(id);

  return (
    <BranchDetailComponent
      navigate={navigate}
      loading={branchLoading}
      branch={branch}
      users={users}
      usersLoading={usersLoading}
      onEdit={() => navigate(`/edit-branch/${id}`)}
    />
  );
}

export default BranchDetailController;
