import { useNavigate } from "react-router-dom";
import TenantsComponent from "./TenantsComponent";
import { useTenants } from "../../hooks/useTenants";
import { provisionTenant } from "../../api/TenancyApis";
import toast from "react-hot-toast";

function TenantsController() {
  const navigate = useNavigate();
  const {
    data: tenants = [],
    isLoading: loading,
    refetch: refetchTenants,
  } = useTenants();

  const handleAddTenant = () => {
    navigate("/add-tenant");
  };

  const handleEditTenant = (id) => {
    navigate(`/edit-tenant/${id}`);
  };

  const handleProvisionTenant = async (id) => {
    try {
      await provisionTenant(id);
      toast.success("Tenant provisioning started successfully!");
      refetchTenants();
    } catch (error) {
      toast.error(error?.message || "Failed to provision tenant.");
    }
  };

  return (
    <TenantsComponent
      loading={loading}
      tenants={tenants}
      onAddTenant={handleAddTenant}
      onEditTenant={handleEditTenant}
      onProvisionTenant={handleProvisionTenant}
    />
  );
}

export default TenantsController;
