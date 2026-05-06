import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";
import { isPlatformAdminHost } from "../services/tenantRuntime";
import { logError } from "../utils/logger";

let businessProfilesInFlightRequest = null;
let businessProfilesCache = null;

const EMPTY_PROFILES_RESPONSE = { status: true, data: [] };
const DEFAULT_LANGUAGE_RESPONSE = {
  status: true,
  data: { selected_language: "en" },
};

const toMultipartFormData = (payload = {}) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, value);
  });

  return formData;
};

export const createBusinessProfile = async (payload) => {
  try {
    const response = await ApiInstance.post(
      "/business-profiles/",
      toMultipartFormData(payload)
    );
    businessProfilesCache = null;
    return response.data;
  } catch (error) {
    toast.error("Error creating business profile");
    logError("Business Profile API Error:", error);
  }
};

export const updateBusinessProfile = async (id, payload) => {
  try {
    const response = await ApiInstance.put(
      `/business-profiles/${id}/`,
      toMultipartFormData(payload)
    );
    businessProfilesCache = null;
    return response.data;
  } catch (error) {
    toast.error("Error updating business profile");
    logError("Business Profile API Error:", error);
  }
};

const getCachedBusinessLanguage = () => {
  const profile = Array.isArray(businessProfilesCache?.data)
    ? businessProfilesCache.data[0]
    : businessProfilesCache?.data;
  return profile?.selected_language || null;
};

const updateCachedBusinessLanguage = (selectedLanguage) => {
  if (!businessProfilesCache || !selectedLanguage) return;

  if (Array.isArray(businessProfilesCache.data)) {
    businessProfilesCache = {
      ...businessProfilesCache,
      data: businessProfilesCache.data.map((profile, index) =>
        index === 0 ? { ...profile, selected_language: selectedLanguage } : profile
      ),
    };
    return;
  }

  if (businessProfilesCache.data) {
    businessProfilesCache = {
      ...businessProfilesCache,
      data: {
        ...businessProfilesCache.data,
        selected_language: selectedLanguage,
      },
    };
  }
};

export const getBusinessLanguage = async () => {
  if (isPlatformAdminHost()) {
    return DEFAULT_LANGUAGE_RESPONSE;
  }

  const cachedLanguage = getCachedBusinessLanguage();
  if (cachedLanguage) {
    return {
      status: true,
      data: { selected_language: cachedLanguage },
    };
  }

  try {
    const response = await ApiInstance.get("/business-profiles/language/");
    return response.data;
  } catch (error) {
    logError("Business Language API Error:", error);
    return DEFAULT_LANGUAGE_RESPONSE;
  }
};

export const updateBusinessLanguage = async (selectedLanguage) => {
  if (isPlatformAdminHost()) {
    return DEFAULT_LANGUAGE_RESPONSE;
  }

  try {
    const response = await ApiInstance.put("/business-profiles/language/", {
      selected_language: selectedLanguage,
    });
    const savedLanguage = response.data?.data?.selected_language;
    if (savedLanguage) {
      updateCachedBusinessLanguage(savedLanguage);
    }
    return response.data;
  } catch (error) {
    logError("Business Language API Error:", error);
    return { status: false, data: { selected_language: selectedLanguage } };
  }
};

export const getAllBusinessProfiles = async () => {
  // Business profiles are tenant-scoped; the platform admin schema doesn't
  // expose this endpoint, so skip the network call entirely on admin.* hosts.
  if (isPlatformAdminHost()) {
    return EMPTY_PROFILES_RESPONSE;
  }

  if (businessProfilesCache) {
    return businessProfilesCache;
  }

  if (businessProfilesInFlightRequest) {
    return businessProfilesInFlightRequest;
  }

  try {
    businessProfilesInFlightRequest = ApiInstance.get("/business-profiles/")
      .then((response) => {
        businessProfilesCache = response.data;
        return response.data;
      })
      .catch((error) => {
        // Suppress error toast here as it might be empty on first load.
        logError("Business Profile API Error:", error);
        return { status: false, data: [] };
      })
      .finally(() => {
        businessProfilesInFlightRequest = null;
      });

    return await businessProfilesInFlightRequest;
  } catch (error) {
    // Suppress error toast here as it might be empty on first load.
    logError("Business Profile API Error:", error);
    return { status: false, data: [] };
  }
};
