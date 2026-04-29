import { useCallback, useEffect, useState } from "react";
import SettingsComponent from "./SettingsComponent";
import { extractColorsFromImage } from "../../utils/colorUtils";
import {
  getAllBusinessProfiles,
  createBusinessProfile,
  updateBusinessProfile,
} from "../../api/BusinessProfile";
import {
  createPdfFormatter,
  deletePdfFormatter,
  getPdfFormatter,
  getPdfFormatterHtml,
  getPdfFormatters,
  updatePdfFormatter,
} from "../../api/PdfFormatters";
import toast from "react-hot-toast";
import usePermissions from "../../hooks/usePermissions";
import { extractArray, normalizeQueryParams } from "../../utils/queryData";
import Swal from "sweetalert2";

const ALLOWED_LOGO_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const ALLOWED_LOGO_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

const isAllowedLogoFile = (file) => {
  if (!file) return false;

  if (ALLOWED_LOGO_MIME_TYPES.includes(file.type)) {
    return true;
  }

  const lowerName = (file.name || "").toLowerCase();
  return ALLOWED_LOGO_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
};

const hardReloadPage = () => {
  if (typeof window === "undefined") return;

  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("_refresh", Date.now().toString());
  window.location.replace(nextUrl.toString());
};

const DEFAULT_PDF_FORMATTER_FORM = {
  id: null,
  name: "",
  code: "",
  description: "",
  html_content:
    "<html><body><h1>Invoice {{ invoice_number }}</h1><p>Customer: {{ customer_name }}</p></body></html>",
  sample_data_text: JSON.stringify(
    {
      invoice_number: "INV-001",
      customer_name: "Radha Catering",
    },
    null,
    2
  ),
  is_default: false,
  is_active: true,
};

const unwrapPdfFormatter = (response) => {
  if (!response || typeof response !== "object") return response;
  if (response.data && !Array.isArray(response.data)) return response.data;
  return response;
};

const formatSampleData = (sampleData) => {
  if (!sampleData) return "{}";

  if (typeof sampleData === "string") {
    try {
      return JSON.stringify(JSON.parse(sampleData), null, 2);
    } catch {
      return sampleData;
    }
  }

  return JSON.stringify(sampleData, null, 2);
};

const buildPdfFormatterForm = (formatter) => ({
  id: formatter?.id || null,
  name: formatter?.name || "",
  code: formatter?.code || "",
  description: formatter?.description || "",
  html_content: formatter?.html_content || "",
  sample_data_text: formatSampleData(formatter?.sample_data),
  is_default: Boolean(formatter?.is_default),
  is_active: formatter?.is_active !== false,
});

const openHtmlDocument = (html) => {
  if (typeof window === "undefined") return;

  const blob = new Blob([html || ""], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const opened = window.open(url, "_blank", "noopener,noreferrer");

  if (!opened) {
    toast.error("Popup blocked. Please allow popups for HTML preview.");
  }

  setTimeout(() => URL.revokeObjectURL(url), 60000);
};

function SettingsController() {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    caters_name: "",
    phone_number: "",
    whatsapp_number: "",
    fssai_number: "",
    godown_address: "",
    logo: "",
    logoFile: null,
    color_code: "#13609b", // Default color
  });

  const [extractedColors, setExtractedColors] = useState([]);
  const [pdfFormatters, setPdfFormatters] = useState([]);
  const [pdfFormatterFilters, setPdfFormatterFilters] = useState({
    search: "",
    code: "",
    is_active: "",
    is_default: "",
  });
  const [pdfFormatterForm, setPdfFormatterForm] = useState({
    ...DEFAULT_PDF_FORMATTER_FORM,
  });
  const [selectedPdfFormatterId, setSelectedPdfFormatterId] = useState(null);
  const [pdfFormatterLoading, setPdfFormatterLoading] = useState(false);
  const [pdfFormatterSaving, setPdfFormatterSaving] = useState(false);
  const [pdfFormatterDeletingId, setPdfFormatterDeletingId] = useState(null);
  const [pdfFormatterPreviewHtml, setPdfFormatterPreviewHtml] = useState("");
  const [pdfFormatterPreviewLoading, setPdfFormatterPreviewLoading] =
    useState(false);
  const [pdfFormatterDirty, setPdfFormatterDirty] = useState(false);

  // Keep a copy for cancel/revert
  const [originalData, setOriginalData] = useState({ ...formData });

  const handleExtractColors = useCallback(async (source) => {
    try {
      const colors = await extractColorsFromImage(source);
      setExtractedColors(colors);
    } catch (error) {
      console.error("Failed to extract colors:", error);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await getAllBusinessProfiles();
      const profileList = Array.isArray(response?.data)
        ? response.data
        : response?.data
          ? [response.data]
          : [];

      if (profileList.length > 0) {
        const profile = profileList[0];
        setProfileId(profile.id);
        const profileData = {
          caters_name: profile.caters_name || "",
          phone_number: profile.phone_number || "",
          whatsapp_number: profile.whatsapp_number || "",
          fssai_number: profile.fssai_number || "",
          godown_address: profile.godown_address || "",
          logo: profile.logo || "",
          logoFile: null,
          color_code: profile.color_code || "#845cbd",
        };
        setFormData(profileData);
        setOriginalData(profileData);
        
        if (profile.logo) {
          handleExtractColors(profile.logo);
        }
      }
    } catch (error) {
      console.error("Failed to load business profile:", error);
    }
  }, [handleExtractColors]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fetchPdfFormatters = useCallback(async (filters, preferredId = null) => {
    setPdfFormatterLoading(true);
    try {
      const response = await getPdfFormatters(normalizeQueryParams(filters));
      const list = extractArray(response);
      setPdfFormatters(list);

      const nextFormatter =
        (preferredId &&
          list.find((formatter) => String(formatter.id) === String(preferredId))) ||
        list[0] ||
        null;

      if (nextFormatter) {
        setSelectedPdfFormatterId(nextFormatter.id);
        let formatterDetails = nextFormatter;
        try {
          const detailResponse = await getPdfFormatter(nextFormatter.id);
          const detail = unwrapPdfFormatter(detailResponse);
          if (detail?.id) {
            formatterDetails = detail;
          }
        } catch (error) {
          console.error("PDF formatter detail error:", error);
        }
        setPdfFormatterForm(buildPdfFormatterForm(formatterDetails));
        setPdfFormatterDirty(false);
      } else {
        setSelectedPdfFormatterId(null);
        setPdfFormatterForm({ ...DEFAULT_PDF_FORMATTER_FORM });
        setPdfFormatterDirty(false);
      }
    } catch (error) {
      toast.error("Failed to load PDF formats");
      console.error("PDF formatter list error:", error);
    } finally {
      setPdfFormatterLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPdfFormatters(pdfFormatterFilters);
  }, [fetchPdfFormatters, pdfFormatterFilters]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "logoFile") {
      const selectedFile = files?.[0] || null;

      if (selectedFile && !isAllowedLogoFile(selectedFile)) {
        toast.error("Please upload PNG, JPG, JPEG or WEBP logo only.");
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        logoFile: selectedFile,
        logo: selectedFile ? URL.createObjectURL(selectedFile) : prev.logo,
      }));

      if (selectedFile) {
        handleExtractColors(selectedFile);
      }
      return;
    }

    if (name === "color_code") {
      setFormData((prev) => ({
        ...prev,
        color_code: value,
      }));
      return;
    }

    if (name === "phone_number" || name === "whatsapp_number") {
      const formattedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePdfFormatterFilterChange = (e) => {
    const { name, value } = e.target;
    setPdfFormatterFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePdfFormatterFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPdfFormatterForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setPdfFormatterDirty(true);
  };

  const handleNewPdfFormatter = () => {
    setSelectedPdfFormatterId(null);
    setPdfFormatterForm({ ...DEFAULT_PDF_FORMATTER_FORM });
    setPdfFormatterPreviewHtml("");
    setPdfFormatterDirty(false);
  };

  const handleSelectPdfFormatter = async (formatter) => {
    if (!formatter?.id) return;

    setSelectedPdfFormatterId(formatter.id);
    setPdfFormatterForm(buildPdfFormatterForm(formatter));
    setPdfFormatterPreviewHtml("");
    setPdfFormatterDirty(false);

    try {
      const response = await getPdfFormatter(formatter.id);
      const detail = unwrapPdfFormatter(response);
      if (String(detail?.id) === String(formatter.id)) {
        setPdfFormatterForm(buildPdfFormatterForm(detail));
      }
    } catch (error) {
      console.error("PDF formatter detail error:", error);
    }
  };

  const getPdfFormatterPayload = () => {
    let sampleData = {};
    const rawSampleData = pdfFormatterForm.sample_data_text.trim();

    if (rawSampleData) {
      sampleData = JSON.parse(rawSampleData);
      if (!sampleData || Array.isArray(sampleData) || typeof sampleData !== "object") {
        throw new Error("Sample data must be a JSON object.");
      }
    }

    const payload = {
      name: pdfFormatterForm.name.trim(),
      description: pdfFormatterForm.description.trim(),
      html_content: pdfFormatterForm.html_content,
      sample_data: sampleData,
      is_default: Boolean(pdfFormatterForm.is_default),
      is_active: Boolean(pdfFormatterForm.is_active),
    };

    if (pdfFormatterForm.code.trim()) {
      payload.code = pdfFormatterForm.code.trim();
    }

    return payload;
  };

  const handleSavePdfFormatter = async (e) => {
    e.preventDefault();
    if (pdfFormatterSaving) return;

    if (!pdfFormatterForm.name.trim()) {
      toast.error("PDF format name is required.");
      return;
    }

    if (!pdfFormatterForm.html_content.trim()) {
      toast.error("HTML content is required.");
      return;
    }

    setPdfFormatterSaving(true);
    try {
      const payload = getPdfFormatterPayload();
      const response = pdfFormatterForm.id
        ? await updatePdfFormatter(pdfFormatterForm.id, payload)
        : await createPdfFormatter(payload);
      const savedFormatter = unwrapPdfFormatter(response);
      const savedId = savedFormatter?.id || pdfFormatterForm.id;

      toast.success(
        pdfFormatterForm.id
          ? "PDF format updated successfully."
          : "PDF format created successfully."
      );
      setPdfFormatterDirty(false);
      await fetchPdfFormatters(pdfFormatterFilters, savedId);
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error("Sample data JSON is invalid.");
      } else {
        toast.error(error?.message || "Failed to save PDF format.");
      }
      console.error("PDF formatter save error:", error);
    } finally {
      setPdfFormatterSaving(false);
    }
  };

  const handleDeletePdfFormatter = async (id) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "Delete PDF format?",
      text: "This format will be removed permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-primary)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    setPdfFormatterDeletingId(id);
    try {
      await deletePdfFormatter(id);
      toast.success("PDF format deleted successfully.");
      setPdfFormatterPreviewHtml("");
      await fetchPdfFormatters(pdfFormatterFilters);
    } catch (error) {
      toast.error("Failed to delete PDF format.");
      console.error("PDF formatter delete error:", error);
    } finally {
      setPdfFormatterDeletingId(null);
    }
  };

  const getPreviewHtml = async () => {
    if (pdfFormatterForm.id && !pdfFormatterDirty) {
      return getPdfFormatterHtml(pdfFormatterForm.id);
    }

    return pdfFormatterForm.html_content;
  };

  const handlePreviewPdfFormatter = async () => {
    if (!pdfFormatterForm.html_content.trim()) {
      toast.error("HTML content is required.");
      return;
    }

    setPdfFormatterPreviewLoading(true);
    try {
      const html = await getPreviewHtml();
      setPdfFormatterPreviewHtml(html || "");
    } catch (error) {
      toast.error("Failed to load HTML preview.");
      console.error("PDF formatter preview error:", error);
    } finally {
      setPdfFormatterPreviewLoading(false);
    }
  };

  const handleOpenPdfFormatterHtml = async () => {
    if (!pdfFormatterForm.html_content.trim()) {
      toast.error("HTML content is required.");
      return;
    }

    setPdfFormatterPreviewLoading(true);
    try {
      const html = await getPreviewHtml();
      openHtmlDocument(html);
    } catch (error) {
      toast.error("Failed to open HTML preview.");
      console.error("PDF formatter open error:", error);
    } finally {
      setPdfFormatterPreviewLoading(false);
    }
  };

  const handleEdit = () => {
    const requiredPermission = profileId
      ? "business_profiles.update"
      : "business_profiles.create";
    if (!hasPermission(requiredPermission)) {
      toast.error("You do not have permission to edit the business profile.");
      return;
    }

    setOriginalData({ ...formData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const requiredPermission = profileId
      ? "business_profiles.update"
      : "business_profiles.create";
    if (!hasPermission(requiredPermission)) {
      toast.error("You do not have permission to save the business profile.");
      return;
    }

    if (
      !formData.caters_name.trim() ||
      !formData.fssai_number.trim() ||
      !formData.godown_address.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.phone_number && formData.phone_number.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    
    if (formData.whatsapp_number && formData.whatsapp_number.length !== 10) {
      toast.error("WhatsApp number must be exactly 10 digits");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        caters_name: formData.caters_name,
        phone_number: formData.phone_number,
        whatsapp_number: formData.whatsapp_number,
        fssai_number: formData.fssai_number,
        godown_address: formData.godown_address,
        logo: formData.logoFile || undefined,
        color_code: formData.color_code,
      };

      let response;
      if (profileId) {
        response = await updateBusinessProfile(profileId, payload);
      } else {
        response = await createBusinessProfile(payload);
      }

      const isSuccess =
        !!response &&
        (response.status === true ||
          response.success === true ||
          typeof response.message === "string" ||
          !!response.data);

      if (isSuccess) {
        const resolvedProfileId = response?.data?.id || response?.id || profileId;
        if (resolvedProfileId && !profileId) {
          setProfileId(resolvedProfileId);
        }

        const savedLogo = response?.data?.logo || formData.logo;
        const savedFormData = {
          ...formData,
          logo: savedLogo,
          logoFile: null,
        };
        setFormData(savedFormData);
        toast.success(response.message || "Profile saved successfully!");
        setOriginalData(savedFormData);
        setIsEditing(false);
        setTimeout(() => {
          hardReloadPage();
        }, 250);
      } else {
        toast.error("Profile save response invalid. Please retry.");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsComponent
      formData={formData}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      loading={loading}
      isEditing={isEditing}
      handleEdit={handleEdit}
      handleCancel={handleCancel}
      extractedColors={extractedColors}
      canModifyProfile={
        profileId
          ? hasPermission("business_profiles.update")
          : hasPermission("business_profiles.create")
      }
      pdfFormatterManager={{
        formatters: pdfFormatters,
        filters: pdfFormatterFilters,
        form: pdfFormatterForm,
        selectedId: selectedPdfFormatterId,
        loading: pdfFormatterLoading,
        saving: pdfFormatterSaving,
        deletingId: pdfFormatterDeletingId,
        previewHtml: pdfFormatterPreviewHtml,
        previewLoading: pdfFormatterPreviewLoading,
        onFilterChange: handlePdfFormatterFilterChange,
        onSelect: handleSelectPdfFormatter,
        onFormChange: handlePdfFormatterFormChange,
        onNew: handleNewPdfFormatter,
        onSave: handleSavePdfFormatter,
        onDelete: handleDeletePdfFormatter,
        onPreview: handlePreviewPdfFormatter,
        onOpenHtml: handleOpenPdfFormatterHtml,
        onRefresh: () =>
          fetchPdfFormatters(pdfFormatterFilters, selectedPdfFormatterId),
      }}
    />
  );
}

export default SettingsController;
