import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useIngredientCategories } from "../../../hooks/useIngredientCategories";
import {
  useCreateVendorMutation,
  useUpdateVendorMutation,
} from "../../../hooks/useVendorMutations";
import { useVendorById } from "../../../hooks/useVendors";
import { getApiErrorMessage } from "../../../utils/apiResponse";
import AddEditVendorComponent from "./AddEditVendorComponent";

function AddEditVendorController() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location || {};
  const mode = state?.mode || (id ? "edit" : "add");

  const [loading, setLoading] = useState(mode === "edit");
  const [hasExistingLogin, setHasExistingLogin] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile_no: "",
    address: "",
    is_active: true,
    login_enabled: false,
    login_username: "",
    login_password: "",
    login_email: "",
  });
  const [vendorCategories, setVendorCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const createVendorMutation = useCreateVendorMutation();
  const updateVendorMutation = useUpdateVendorMutation();
  const { data: availableCategories = [] } = useIngredientCategories();
  const { data: fetchedVendorData, isLoading: isVendorLoading } = useVendorById(
    id,
    { enabled: mode === "edit" && !state?.vendorData }
  );

  const populateVendorForm = (vendorData) => {
    const existingLogin =
      Boolean(vendorData?.linked_user_id) ||
      Boolean(vendorData?.linked_username) ||
      Boolean(vendorData?.user_account);

    setHasExistingLogin(existingLogin);
    setForm({
      name: vendorData?.name || "",
      mobile_no: vendorData?.mobile_no || "",
      address: vendorData?.address || "",
      is_active:
        vendorData?.is_active !== undefined ? vendorData.is_active : true,
      login_enabled: existingLogin,
      login_username: vendorData?.login_username || vendorData?.linked_username || "",
      login_password: "",
      login_email: vendorData?.login_email || vendorData?.email || "",
    });
    setVendorCategories(
      (vendorData?.vendor_categories || []).map((entry) => ({
        category: entry?.category ? String(entry.category) : "",
      }))
    );
  };

  useEffect(() => {
    if (mode !== "edit") {
      setLoading(false);
      return;
    }

    if (state?.vendorData) {
      populateVendorForm(state.vendorData);
      setLoading(false);
      return;
    }

    if (isVendorLoading) {
      setLoading(true);
      return;
    }

    if (!fetchedVendorData) {
      toast.error("Failed to load vendor details");
      navigate(-1);
      return;
    }

    populateVendorForm(fetchedVendorData);
    setLoading(false);
  }, [fetchedVendorData, isVendorLoading, mode, navigate, state]);

  const onInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "mobile_no") {
      const formattedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, mobile_no: formattedValue }));
      if (errors.mobile_no) {
        setErrors((prev) => ({ ...prev, mobile_no: "" }));
      }
      return;
    }

    if (name === "login_enabled") {
      const nextEnabled = checked || hasExistingLogin;

      setForm((prev) => ({
        ...prev,
        login_enabled: nextEnabled,
        login_username: nextEnabled ? prev.login_username : "",
        login_password: "",
        login_email: nextEnabled ? prev.login_email : "",
      }));
      setErrors((prev) => ({
        ...prev,
        login_username: "",
        login_password: "",
        login_email: "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryChange = (index, value) => {
    setVendorCategories((prev) => {
      const updated = [...prev];
      updated[index] = { category: value };

      const isLastRow = index === updated.length - 1;
      if (isLastRow && value) {
        updated.push({ category: "" });
      }

      return updated;
    });
  };

  const handleRemoveCategory = (index) => {
    setVendorCategories((prev) => {
      const filtered = prev.filter((_, currentIndex) => currentIndex !== index);
      const lastItem = filtered[filtered.length - 1];

      if (!lastItem || lastItem.category) {
        filtered.push({ category: "" });
      }

      return filtered;
    });
  };

  const handleAddCategoryRow = () => {
    setVendorCategories((prev) => [...prev, { category: "" }]);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Vendor name is required";
    }

    if (form.mobile_no && form.mobile_no.length !== 10) {
      nextErrors.mobile_no = "Mobile number must be exactly 10 digits";
    }

    if (form.login_enabled) {
      if (!form.login_username.trim()) {
        nextErrors.login_username = "Login username is required";
      }

      if (!hasExistingLogin && !form.login_password.trim()) {
        nextErrors.login_password = "Login password is required";
      } else if (
        form.login_password.trim() &&
        form.login_password.trim().length < 4
      ) {
        nextErrors.login_password = "Password must be at least 4 characters";
      }

      if (
        form.login_email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.login_email.trim())
      ) {
        nextErrors.login_email = "Enter a valid email address";
      }
    }

    setErrors(nextErrors);
    const isValid = Object.keys(nextErrors).length === 0;

    if (!isValid) {
      toast.error("Please fill in all required fields.");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        mobile_no: form.mobile_no.trim(),
        address: form.address.trim(),
        is_active: form.is_active,
        vendor_categories: vendorCategories
          .filter((entry) => entry.category)
          .map((entry) => ({
            category: Number(entry.category),
          })),
      };

      if (form.login_enabled) {
        payload.login_username = form.login_username.trim();

        if (form.login_email !== "") {
          payload.login_email = form.login_email.trim();
        }

        if (form.login_password.trim()) {
          payload.login_password = form.login_password;
        }
      }

      const response =
        mode === "edit"
          ? await updateVendorMutation.mutateAsync({ id, data: payload })
          : await createVendorMutation.mutateAsync(payload);

      if (response) {
        navigate("/people/vendor");
      }
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          `Failed to ${mode === "edit" ? "update" : "add"} vendor`
        )
      );
      console.error("Vendor submit error:", error);
    }
  };

  return (
    <AddEditVendorComponent
      navigate={navigate}
      mode={mode}
      loading={loading}
      form={form}
      errors={errors}
      vendorCategories={vendorCategories}
      availableCategories={availableCategories}
      hasExistingLogin={hasExistingLogin}
      onInputChange={onInputChange}
      onSubmit={handleSubmit}
      handleCategoryChange={handleCategoryChange}
      handleRemoveCategory={handleRemoveCategory}
      handleAddCategoryRow={handleAddCategoryRow}
    />
  );
}

export default AddEditVendorController;
