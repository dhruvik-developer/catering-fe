import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import SubscriptionPlansComponent from "./SubscriptionPlansComponent";
import { useTenants } from "../../hooks/useTenants";
import {
  deleteSubscriptionPlan,
  getSubscriptionPlans,
} from "../../api/TenancyApis";
import { getPermissionModules } from "../../api/AccessControlApis";
import { getApiMessage } from "../../utils/apiResponse";

const extractList = (response) => {
  const payload = response?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.modules)) return payload.modules;
  if (Array.isArray(response)) return response;
  return [];
};

function SubscriptionPlansController() {
  const navigate = useNavigate();
  const { data: tenants = [], isLoading: tenantsLoading } = useTenants();
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    let active = true;
    getPermissionModules()
      .then((response) => {
        if (active) setModules(extractList(response));
      })
      .catch(() => {
        if (active) setModules([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const fetchPlans = useCallback(() => {
    setPlansLoading(true);
    return getSubscriptionPlans()
      .then((response) => {
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
        setPlans(list);
      })
      .catch(() => setPlans([]))
      .finally(() => setPlansLoading(false));
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleAdd = () => navigate("/add-subscription-plan");
  const handleEdit = (id) => navigate(`/edit-subscription-plan/${id}`);

  const handleDelete = async (plan) => {
    const result = await Swal.fire({
      title: `Delete "${plan.name}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c2272d",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete plan",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteSubscriptionPlan(plan.id);
      toast.success("Plan deleted.");
      fetchPlans();
    } catch (error) {
      toast.error(getApiMessage(error, "Failed to delete plan"));
    }
  };

  return (
    <SubscriptionPlansComponent
      loading={plansLoading || tenantsLoading}
      plans={plans}
      tenants={tenants}
      modules={modules}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

export default SubscriptionPlansController;
