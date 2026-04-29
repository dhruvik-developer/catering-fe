import { useEffect, useState } from "react";
import DashboardComponent from "./DashboardComponent";
import { useTenants } from "../../hooks/useTenants";
import { getSubscriptionPlans } from "../../api/TenancyApis";

function DashboardController() {
  const { data: tenants = [], isLoading: tenantsLoading } = useTenants();
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setPlansLoading(true);
    getSubscriptionPlans()
      .then((response) => {
        if (!active) return;
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
        setPlans(list);
      })
      .catch(() => {
        if (active) setPlans([]);
      })
      .finally(() => {
        if (active) setPlansLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardComponent
      loading={tenantsLoading || plansLoading}
      tenants={tenants}
      plans={plans}
    />
  );
}

export default DashboardController;
