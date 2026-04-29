import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import TenantsComponent from "./TenantsComponent";
import { useTenants } from "../../hooks/useTenants";
import { deleteTenant, provisionTenant } from "../../api/TenancyApis";
import { getApiMessage } from "../../utils/apiResponse";

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
      toast.error(getApiMessage(error, "Failed to provision tenant."));
    }
  };

  const handleDeleteTenant = async (tenant) => {
    const result = await Swal.fire({
      title: `Delete "${tenant.name}"?`,
      html:
        "This will tear down the tenant schema and remove all of their data. " +
        "<br/><strong>This cannot be undone.</strong>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c2272d",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete tenant",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTenant(tenant.id);
      toast.success(`Tenant "${tenant.name}" deleted.`);
      refetchTenants();
    } catch (error) {
      toast.error(getApiMessage(error, "Failed to delete tenant."));
    }
  };

  return (
    <TenantsComponent
      loading={loading}
      tenants={tenants}
      onAddTenant={handleAddTenant}
      onEditTenant={handleEditTenant}
      onProvisionTenant={handleProvisionTenant}
      onDeleteTenant={handleDeleteTenant}
    />
  );
}

export default TenantsController;
