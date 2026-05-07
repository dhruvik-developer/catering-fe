/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AddEditBranchComponent from "./AddEditBranchComponent";
import {
  createBranch,
  getBranchById,
  updateBranch,
} from "../../api/branches";
import { logError } from "../../utils/logger";

const blankForm = () => ({
  name: "",
  branch_code: "",
  city: "",
  state: "",
  address: "",
  phone_number: "",
  email: "",
  manager: "",
  is_main: false,
  is_active: true,
});

const fromBackend = (data) => ({
  name: data?.name || "",
  branch_code: data?.branch_code || "",
  city: data?.city || "",
  state: data?.state || "",
  address: data?.address || "",
  phone_number: data?.phone_number || "",
  email: data?.email || "",
  // Backend stores manager as a UUID; the dropdown is populated from the
  // users API by AddEditBranchComponent.
  manager: data?.manager ?? "",
  is_main: Boolean(data?.is_main),
  is_active: data?.is_active !== undefined ? Boolean(data.is_active) : true,
});

function AddEditBranchController() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const stateMode = location.state?.mode;
  const mode = stateMode || (id ? "edit" : "add");

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(() => {
    const seed = location.state?.branchData;
    return seed ? fromBackend(seed) : blankForm();
  });

  // Hydrate from API when we landed on /edit-branch/:id without pre-filled
  // state (e.g. after a hard reload).
  useEffect(() => {
    let cancelled = false;
    if (mode !== "edit") return;
    if (location.state?.branchData) {
      setLoading(false);
      return;
    }
    if (!id) return;

    (async () => {
      try {
        const response = await getBranchById(id);
        const data = response?.data ?? response;
        if (!cancelled && data) {
          setForm(fromBackend(data));
        } else if (!cancelled) {
          toast.error("Branch not found");
          navigate(-1);
        }
      } catch (err) {
        logError("Branch fetch failed:", err);
        if (!cancelled) navigate(-1);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Branch name is required";
    if (!form.branch_code.trim()) next.branch_code = "Branch code is required";
    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      next.email = "Enter a valid email";
    }
    if (form.phone_number.trim() && !/^\d{6,15}$/.test(form.phone_number.trim())) {
      next.phone_number = "Phone must be 6–15 digits";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        branch_code: form.branch_code.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        address: form.address.trim(),
        phone_number: form.phone_number.trim(),
        email: form.email.trim(),
        // Empty string would fail uuid validation server-side; send null when
        // no manager is picked.
        manager: form.manager ? form.manager : null,
        is_main: Boolean(form.is_main),
        is_active: Boolean(form.is_active),
      };
      const response =
        mode === "add"
          ? await createBranch(payload)
          : await updateBranch(id, payload);

      if (response) {
        navigate("/branches");
      }
    } catch (err) {
      logError("Branch save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AddEditBranchComponent
      mode={mode}
      loading={loading}
      saving={saving}
      form={form}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      navigate={navigate}
    />
  );
}

export default AddEditBranchController;
