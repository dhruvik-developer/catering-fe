import UserModelsComponent from "./UserModelsComponent";
import { useTenants } from "../../hooks/useTenants";

function UserModelsController() {
  const { data: tenants = [], isLoading } = useTenants();

  return <UserModelsComponent loading={isLoading} tenants={tenants} />;
}

export default UserModelsController;
