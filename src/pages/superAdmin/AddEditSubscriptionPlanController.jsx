import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AddEditSubscriptionPlanComponent from "./AddEditSubscriptionPlanComponent";
import {
  createSubscriptionPlan,
  getSubscriptionPlans,
  updateSubscriptionPlan,
} from "../../api/TenancyApis";
import { getPermissionModules } from "../../api/AccessControlApis";
import { getApiMessage } from "../../utils/apiResponse";

const EMPTY_FORM = {
  name: "",
  code: "",
  description: "",
  price: "0",
  billing_cycle: "monthly",
  max_users: "0",
  trial_days: "0",
  is_active: true,
  modules: [],
};

const extractModuleList = (response) => {
  const payload = response?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.modules)) return payload.modules;
  if (Array.isArray(response)) return response;
  return [];
};

function AddEditSubscriptionPlanController() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    let active = true;
    getPermissionModules()
      .then((response) => {
        if (!active) return;
        setModules(extractModuleList(response));
      })
      .catch(() => {
        if (active) setModules([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let active = true;

    getSubscriptionPlans()
      .then((response) => {
        if (!active) return;
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
        const plan = list.find((p) => String(p.id) === String(id));
        if (!plan) return;

        const planModules = Array.isArray(plan.modules)
          ? plan.modules
          : Array.isArray(plan.enabled_modules)
            ? plan.enabled_modules
            : [];
        const normalizedModules = planModules.map((m) =>
          typeof m === "string" ? m : m.key || m.code || m.name
        );

        setForm({
          name: plan.name || "",
          code: plan.code || "",
          description: plan.description || "",
          price: String(plan.price ?? plan.amount ?? 0),
          billing_cycle: plan.billing_cycle || plan.interval || "monthly",
          max_users: String(plan.max_users ?? 0),
          trial_days: String(plan.trial_days ?? 0),
          is_active: plan.is_active !== false,
          modules: normalizedModules,
        });
      })
      .catch(() => toast.error("Failed to load subscription plan."));

    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onToggleActive = (e) => {
    setForm((prev) => ({ ...prev, is_active: e.target.checked }));
  };

  const onModuleToggle = (moduleKey) => {
    setForm((prev) => {
      const current = prev.modules || [];
      const next = current.includes(moduleKey)
        ? current.filter((m) => m !== moduleKey)
        : [...current, moduleKey];
      return { ...prev, modules: next };
    });
    setErrors((prev) => ({ ...prev, modules: "" }));
  };

  const onSelectAllModules = () => {
    setForm((prev) => ({
      ...prev,
      modules: modules.map((m) => m.key || m.code || m.name).filter(Boolean),
    }));
  };

  const onClearModules = () => {
    setForm((prev) => ({ ...prev, modules: [] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.code.trim()) {
      newErrors.code = "Code is required";
    } else if (!/^[a-z0-9][a-z0-9_-]*$/.test(form.code.trim())) {
      newErrors.code = "Use lowercase letters, digits, hyphens or underscores";
    }
    const priceNum = Number(form.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      newErrors.price = "Enter a valid non-negative price";
    }
    if (!form.modules || form.modules.length === 0) {
      newErrors.modules =
        "Pick at least one module — tenants on this plan inherit these.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(newErrors.modules || "Please fix the highlighted fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      code: form.code.trim(),
      description: form.description.trim() || null,
      price: Number(form.price) || 0,
      billing_cycle: form.billing_cycle,
      max_users: Number(form.max_users) || 0,
      trial_days: Number(form.trial_days) || 0,
      is_active: !!form.is_active,
      modules: form.modules || [],
    };

    setSaving(true);
    try {
      if (isEdit) {
        await updateSubscriptionPlan(id, payload);
        toast.success("Subscription plan updated.");
      } else {
        await createSubscriptionPlan(payload);
        toast.success("Subscription plan created.");
      }
      navigate("/subscription-plans");
    } catch (error) {
      toast.error(
        getApiMessage(
          error,
          isEdit ? "Failed to update plan" : "Failed to create plan"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AddEditSubscriptionPlanComponent
      isEdit={isEdit}
      form={form}
      errors={errors}
      saving={saving}
      modules={modules}
      onChange={onChange}
      onToggleActive={onToggleActive}
      onModuleToggle={onModuleToggle}
      onSelectAllModules={onSelectAllModules}
      onClearModules={onClearModules}
      onCancel={() => navigate("/subscription-plans")}
      onSubmit={handleSubmit}
    />
  );
}

export default AddEditSubscriptionPlanController;
