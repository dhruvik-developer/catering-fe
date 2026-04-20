import { useState, useEffect } from "react";
import SettingsComponent from "./SettingsComponent";
import {
  getAllBusinessProfiles,
  createBusinessProfile,
  updateBusinessProfile,
} from "../../apis/BusinessProfile";
import toast from "react-hot-toast";

function SettingsController() {
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    caters_name: "",
    phone_number: "",
    whatsapp_number: "",
    fssai_number: "",
    godown_address: "",
    user: "550e8400-e29b-41d4-a716-446655440000",
  });

  // Keep a copy for cancel/revert
  const [originalData, setOriginalData] = useState({ ...formData });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getAllBusinessProfiles();
      if (
        response &&
        response.status &&
        response.data &&
        response.data.length > 0
      ) {
        const profile = response.data[0];
        setProfileId(profile.id);
        const profileData = {
          caters_name: profile.caters_name || "",
          phone_number: profile.phone_number || "",
          whatsapp_number: profile.whatsapp_number || "",
          fssai_number: profile.fssai_number || "",
          godown_address: profile.godown_address || "",
          user: profile.user || formData.user,
        };
        setFormData(profileData);
        setOriginalData(profileData);
      }
    } catch (error) {
      console.error("Failed to load business profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
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
    setOriginalData({ ...formData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      let response;
      if (profileId) {
        response = await updateBusinessProfile(profileId, formData);
      } else {
        response = await createBusinessProfile(formData);
        if (response && response.status && response.data) {
          setProfileId(response.data.id);
        }
      }

      if (response && response.status) {
        toast.success(response.message || "Profile saved successfully!");
        setOriginalData({ ...formData });
        setIsEditing(false);
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
    />
  );
}

export default SettingsController;
