import { useEffect, useState } from "react";
import AccessControlComponent from "./AccessControlComponent";
import { useTenants } from "../../hooks/useTenants";
import { getPermissionModules } from "../../api/AccessControlApis";

function AccessControlController() {
  const { data: tenants = [], isLoading: tenantsLoading } = useTenants();
  const [modules, setModules] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setModulesLoading(true);
    getPermissionModules()
      .then((response) => {
        if (!active) return;
        const payload = response?.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.modules)
              ? payload.modules
              : [];
        setModules(list);
      })
      .catch(() => {
        if (active) setModules([]);
      })
      .finally(() => {
        if (active) setModulesLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AccessControlComponent
      loading={modulesLoading || tenantsLoading}
      modules={modules}
      tenants={tenants}
    />
  );
}

export default AccessControlController;
