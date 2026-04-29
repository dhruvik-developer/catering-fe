import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AddEditTenantComponent from "./AddEditTenantComponent";
import {
  createTenant,
  getSubscriptionPlans,
  getTenants,
  updateTenant,
} from "../../api/TenancyApis";
import { getPermissionModules } from "../../api/AccessControlApis";
import { getApiMessage } from "../../utils/apiResponse";
import { queryClient } from "../../lib/queryClient";

const EMPTY_FORM = {
  name: "",
  schema_name: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  subscription_plan: "",
  subscription_status: "trialing",
  subscription_start_date: "",
  subscription_end_date: "",
  admin_username: "",
  admin_email: "",
  admin_password: "",
  domains: [{ domain: "", is_primary: true }],
};

const extractList = (response) => {
  const payload = response?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.modules)) return payload.modules;
  if (Array.isArray(response)) return response;
  return [];
};

function AddEditTenantController() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [plans, setPlans] = useState([]);
  const [modules, setModules] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.allSettled([getSubscriptionPlans(), getPermissionModules()]).then(
      ([plansRes, modulesRes]) => {
        if (!active) return;
        if (plansRes.status === "fulfilled") {
          setPlans(extractList(plansRes.value));
        }
        if (modulesRes.status === "fulfilled") {
          setModules(extractList(modulesRes.value));
        }
      }
    );

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let active = true;

    getTenants()
      .then((response) => {
        if (!active) return;
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
        const tenant = list.find((t) => String(t.id) === String(id));
        if (!tenant) return;

        setForm({
          name: tenant.name || "",
          schema_name: tenant.schema_name || "",
          contact_name: tenant.contact_name || "",
          contact_email: tenant.contact_email || "",
          contact_phone: tenant.contact_phone || "",
          subscription_plan:
            tenant.subscription_plan_id || tenant.subscription_plan || "",
          subscription_status: tenant.subscription_status || "trialing",
          subscription_start_date: tenant.subscription_start_date || "",
          subscription_end_date: tenant.subscription_end_date || "",
          admin_username: tenant.admin_username || "",
          admin_email: tenant.admin_email || "",
          admin_password: "",
          domains:
            Array.isArray(tenant.domains) && tenant.domains.length > 0
              ? tenant.domains.map((d) => ({
                  id: d.id,
                  domain: d.domain || d.name || "",
                  is_primary: !!d.is_primary,
                }))
              : [{ domain: "", is_primary: true }],
        });
      })
      .catch(() => {
        toast.error("Failed to load tenant.");
      });

    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onDomainChange = (index, field, value) => {
    setForm((prev) => {
      const next = [...(prev.domains || [])];
      next[index] = { ...next[index], [field]: value };
      if (field === "is_primary" && value) {
        next.forEach((d, i) => {
          if (i !== index) d.is_primary = false;
        });
      }
      return { ...prev, domains: next };
    });
  };

  const onAddDomain = () => {
    setForm((prev) => ({
      ...prev,
      domains: [...(prev.domains || []), { domain: "", is_primary: false }],
    }));
  };

  const onRemoveDomain = (index) => {
    setForm((prev) => {
      const next = (prev.domains || []).filter((_, i) => i !== index);
      return {
        ...prev,
        domains: next.length > 0 ? next : [{ domain: "", is_primary: true }],
      };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";

    const schemaName = form.schema_name.trim().toLowerCase();
    if (!schemaName) {
      newErrors.schema_name = "Schema name is required";
    } else if (!/^[a-z][a-z0-9_]*$/.test(schemaName)) {
      newErrors.schema_name =
        "Use lowercase letters, digits and underscores only";
    } else if (
      schemaName === "admin" ||
      schemaName === "public" ||
      schemaName === "www"
    ) {
      newErrors.schema_name = `"${schemaName}" is a reserved schema name`;
    }

    if (
      form.contact_email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email.trim())
    ) {
      newErrors.contact_email = "Enter a valid email";
    }
    if (!isEdit && form.admin_username.trim() && !form.admin_password.trim()) {
      newErrors.admin_password =
        "Password is required when an admin username is provided";
    }

    // Domain validation — multi-tenant requires an exact-match Domain row
    // for the host the user will load. No domain = unreachable tenant.
    const filledDomains = (form.domains || []).filter((d) =>
      (d.domain || "").trim()
    );
    if (filledDomains.length === 0) {
      newErrors.domains = "Add at least one domain so this tenant is reachable";
    } else {
      const lower = filledDomains.map((d) => d.domain.trim().toLowerCase());
      const reserved = lower.find(
        (d) => d === "admin" || d.startsWith("admin.")
      );
      if (reserved) {
        newErrors.domains = `"${reserved}" is reserved for the platform admin`;
      } else if (new Set(lower).size !== lower.length) {
        newErrors.domains = "Duplicate domain entries are not allowed";
      } else if (!filledDomains.some((d) => d.is_primary)) {
        newErrors.domains = "Mark one domain as primary";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(newErrors.domains || "Please fix the highlighted fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      schema_name: form.schema_name.trim(),
      contact_name: form.contact_name.trim() || null,
      contact_email: form.contact_email.trim() || null,
      contact_phone: form.contact_phone.trim() || null,
      subscription_status: form.subscription_status,
      subscription_start_date: form.subscription_start_date || null,
      subscription_end_date: form.subscription_end_date || null,
      domains: (form.domains || [])
        .filter((d) => (d.domain || "").trim())
        .map((d) => ({
          ...(d.id ? { id: d.id } : {}),
          domain: d.domain.trim(),
          is_primary: !!d.is_primary,
        })),
    };

    if (form.subscription_plan) {
      payload.subscription_plan = form.subscription_plan;
    }

    if (!isEdit && form.admin_username.trim()) {
      payload.admin_username = form.admin_username.trim();
      payload.admin_email = form.admin_email.trim() || null;
      payload.admin_password = form.admin_password;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await updateTenant(id, payload);
        toast.success("Tenant updated successfully.");
      } else {
        await createTenant(payload);
        toast.success("Tenant created successfully.");
      }
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      navigate("/tenants");
    } catch (error) {
      toast.error(
        getApiMessage(
          error,
          isEdit ? "Failed to update tenant" : "Failed to create tenant"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const selectedPlan = plans.find(
    (p) => String(p.id) === String(form.subscription_plan)
  );

  return (
    <AddEditTenantComponent
      isEdit={isEdit}
      form={form}
      errors={errors}
      plans={plans}
      modules={modules}
      selectedPlan={selectedPlan}
      saving={saving}
      onChange={onChange}
      onDomainChange={onDomainChange}
      onAddDomain={onAddDomain}
      onRemoveDomain={onRemoveDomain}
      onCancel={() => navigate("/tenants")}
      onSubmit={handleSubmit}
    />
  );
}

export default AddEditTenantController;
