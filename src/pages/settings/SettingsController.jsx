import { useCallback, useEffect, useState } from "react";
import SettingsComponent from "./SettingsComponent";
import { extractColorsFromImage } from "../../utils/colorUtils";
import {
  getAllBusinessProfiles,
  createBusinessProfile,
  updateBusinessProfile,
} from "../../api/BusinessProfile";
import toast from "react-hot-toast";
import usePermissions from "../../hooks/usePermissions";

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
    />
  );
}

export default SettingsController;
